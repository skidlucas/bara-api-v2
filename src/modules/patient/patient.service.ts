import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { EntityManager, QueryOrder } from '@mikro-orm/postgresql'
import { FindPatientsQueryParams, PatientDto } from './patient.dto'
import { Patient } from '../../entities/patient.entity'
import { Insurance } from '../../entities/insurance.entity'
import { User } from '../../entities/user.entity'
import { EmojiLogger } from '../logger/emoji-logger.service'

@Injectable()
export class PatientService {
    constructor(
        private readonly em: EntityManager,
        private readonly logger: EmojiLogger,
    ) {}

    async getPatients(
        userId: number,
        queryParams: FindPatientsQueryParams,
    ): Promise<{ data: Patient[]; totalItems: number }> {
        this.logger.log('getPatients', { userId, queryParams })
        const { limit, page, search } = queryParams

        const where: any = { healthProfessional: { id: userId } }

        if (search) {
            const ilikeSearch = { $ilike: `%${search}%` }
            where.firstname = ilikeSearch
            where.lastname = ilikeSearch
        }

        const [patients, count] = await this.em.findAndCount(Patient, where, {
            limit: limit,
            offset: limit * (page - 1),
            populate: ['insurance'],
            fields: ['id', 'firstname', 'lastname', 'insurance.name'],
            orderBy: { lastname: QueryOrder.ASC, firstname: QueryOrder.ASC },
        })

        return { data: patients as Patient[], totalItems: count }
    }

    async createPatient(userId: number, patientDto: PatientDto): Promise<Patient> {
        this.logger.log('createPatient', { userId, patientDto })
        const { firstname, lastname, insuranceId } = patientDto

        const patient = new Patient({
            firstname: `${firstname[0].toUpperCase()}${firstname.slice(1)}`,
            lastname: lastname.toUpperCase(),
            healthProfessional: this.em.getReference(User, userId),
            insurance: insuranceId ? this.em.getReference(Insurance, insuranceId) : null,
        })

        try {
            await this.em.persistAndFlush(patient)
            return patient
        } catch (err) {
            this.logger.error('createPatient', { userId, patientDto, err })
            throw new InternalServerErrorException('Failed to create patient')
        }
    }

    async updatePatient(patientId: number, userId: number, patientDto: PatientDto): Promise<Patient> {
        this.logger.log('updatePatient', { patientId, userId, patientDto })
        const patient = await this.em.findOne(Patient, { id: patientId, healthProfessional: { id: userId } })

        if (!patient) {
            this.logger.error(`Patient ${patientId} not found`, { patientId, userId, patientDto })
            throw new NotFoundException(`Patient ${patientId} not found`)
        }

        const { firstname, lastname, insuranceId } = patientDto

        patient.firstname = `${firstname[0].toUpperCase()}${firstname.slice(1)}`
        patient.lastname = lastname.toUpperCase()
        if (insuranceId > 0) {
            patient.insurance = this.em.getReference(Insurance, insuranceId)
        } else if (insuranceId === 0) {
            patient.insurance = null
        }

        try {
            await this.em.persistAndFlush(patient)
            return patient
        } catch (err) {
            this.logger.error('updatePatient', { patientId, userId, patientDto, err })
            throw new InternalServerErrorException('Failed to update patient')
        }
    }
}
