import { Module } from '@nestjs/common'
import { PatientController } from './patient.controller'
import { PatientService } from './patient.service'
import { LoggerModule } from '../logger/logger.module'

@Module({
    imports: [LoggerModule],
    controllers: [PatientController],
    providers: [PatientService],
})
export class PatientModule {}
