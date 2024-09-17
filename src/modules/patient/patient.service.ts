import { Injectable, NotFoundException } from '@nestjs/common'
import { EntityManager, QueryOrder } from '@mikro-orm/postgresql'
import { FindPatientsQueryParams, PatientDto } from './patient.dto'
import { Patient } from '../../entities/patient.entity'
import { Insurance } from '../../entities/insurance.entity'
import { User } from '../../entities/user.entity'
import { Cron, CronExpression } from '@nestjs/schedule'

@Injectable()
export class PatientService {
    constructor(private readonly em: EntityManager) {}

    async getPatients(
        userId: number,
        queryParams: FindPatientsQueryParams,
    ): Promise<{ data: Patient[]; totalItems: number }> {
        const { limit, page, search, activeOnly } = queryParams

        const where: any = { healthProfessional: { id: userId } }

        if (search) {
            const ilikeSearch = { $ilike: `%${search}%` }
            where.firstname = ilikeSearch
            where.lastname = ilikeSearch
        }

        if (activeOnly) {
            where.archived = false
        }

        const [patients, count] = await this.em.findAndCount(Patient, where, {
            limit: limit,
            offset: limit * (page - 1),
            populate: ['insurance'],
            fields: ['id', 'firstname', 'lastname', 'archived', 'insurance.name'],
            orderBy: { lastname: QueryOrder.ASC, firstname: QueryOrder.ASC },
        })

        return { data: patients as Patient[], totalItems: count }
    }

    async createPatient(userId: number, patientDto: PatientDto): Promise<Patient> {
        const { firstname, lastname, insuranceId } = patientDto

        const patient = new Patient({
            firstname,
            lastname,
            healthProfessional: this.em.getReference(User, userId),
            insurance: insuranceId ? this.em.getReference(Insurance, insuranceId) : null,
        })

        try {
            await this.em.persistAndFlush(patient)
            return patient
        } catch (err) {
            console.error(err)
        }
    }

    async updatePatient(patientId: number, userId: number, patientDto: PatientDto): Promise<Patient> {
        const patient = await this.em.findOne(Patient, { id: patientId, healthProfessional: { id: userId } })

        if (!patient) {
            throw new NotFoundException(`Patient ${patientId} not found`)
        }

        const { firstname, lastname, insuranceId } = patientDto

        patient.firstname = firstname
        patient.lastname = lastname
        if (insuranceId > 0) {
            patient.insurance = this.em.getReference(Insurance, insuranceId)
        } else if (insuranceId === 0) {
            patient.insurance = null
        }

        try {
            await this.em.persistAndFlush(patient)
            return patient
        } catch (err) {
            console.error(err)
        }
    }

    @Cron(CronExpression.EVERY_DAY_AT_2AM)
    async archivePatientsWithoutInvoices(): Promise<void> {
        const em = this.em.fork()
        const now = new Date()
        const lastYear = new Date(now.setFullYear(now.getFullYear() - 1))
        const patients = await em.fork().find(Patient, {
            invoices: { date: { $lt: lastYear } },
            archived: false,
        })

        for (const patient of patients) {
            patient.archived = true
        }

        await em.persistAndFlush(patients)
    }
}
