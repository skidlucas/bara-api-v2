import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { CreateRequestContext, MikroORM } from '@mikro-orm/postgresql'
import { PatientService } from './patient.service'
import { UserFromReq } from '../auth/user.decorator'
import { User } from '../../entities/user.entity'
import { Patient } from '../../entities/patient.entity'
import { CreatePatientDto, FindPatientsQueryParams } from './patient.dto'

@Controller('patients')
export class PatientController {
    constructor(
        private patientService: PatientService,
        private readonly orm: MikroORM,
    ) {}

    @Get()
    @CreateRequestContext()
    async getPatients(
        @UserFromReq() user: User,
        @Query() queryParams: FindPatientsQueryParams,
    ): Promise<{ data: Patient[]; totalItems: number }> {
        return await this.patientService.getPatients(user.id, queryParams)
    }

    @Post()
    @CreateRequestContext()
    async createPatient(@UserFromReq() user: User, @Body() patientDto: CreatePatientDto): Promise<Patient> {
        return await this.patientService.createPatient(user.id, patientDto)
    }
}
