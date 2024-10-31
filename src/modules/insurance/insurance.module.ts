import { Module } from '@nestjs/common'
import { InsuranceController } from './insurance.controller'
import { InsuranceService } from './insurance.service'
import { LoggerModule } from '../logger/logger.module'

@Module({
    imports: [LoggerModule],
    controllers: [InsuranceController],
    providers: [InsuranceService],
})
export class InsuranceModule {}
