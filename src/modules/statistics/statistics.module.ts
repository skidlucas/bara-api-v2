import { Module } from '@nestjs/common'
import { StatisticsController } from './statistics.controller'
import { StatisticsService } from './statistics.service'
import { LoggerModule } from '../logger/logger.module'

@Module({
    imports: [LoggerModule],
    controllers: [StatisticsController],
    providers: [StatisticsService],
})
export class StatisticsModule {}
