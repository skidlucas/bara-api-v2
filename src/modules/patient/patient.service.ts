import { Injectable } from '@nestjs/common'
import { EntityManager, QueryOrder } from '@mikro-orm/postgresql'
import { CreatePatientDto, FindPatientsQueryParams } from './patient.dto'
import { Patient } from '../../entities/patient.entity'
import { Insurance } from '../../entities/insurance.entity'
import { User } from '../../entities/user.entity'

@Injectable()
export class PatientService {
    constructor(private readonly em: EntityManager) {}

    async getPatients(
        userId: number,
        queryParams: FindPatientsQueryParams,
    ): Promise<{ data: Patient[]; totalItems: number }> {
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

    async createPatient(userId: number, patientDto: CreatePatientDto): Promise<Patient> {
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
}
