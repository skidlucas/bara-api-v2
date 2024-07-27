import { Controller, Get } from '@nestjs/common'
import { CreateRequestContext, MikroORM } from '@mikro-orm/postgresql'
import { UserFromReq } from '../auth/user.decorator'
import { User } from '../../entities/user.entity'
import { StatisticsService } from './statistics.service'

@Controller('statistics')
export class StatisticsController {
    constructor(
        private statsService: StatisticsService,
        private readonly orm: MikroORM,
    ) {}

    @Get('dashboard-numbers')
    @CreateRequestContext()
    async getInvoices(
        @UserFromReq() user: User,
    ): Promise<{ totalReceivedThisMonth: number; totalLeftThisMonth: number; total: number }> {
        return await this.statsService.getDashboardNumbers(user.id)
    }
}
