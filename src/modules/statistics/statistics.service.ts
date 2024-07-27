import { Injectable } from '@nestjs/common'
import { EntityManager } from '@mikro-orm/postgresql'

@Injectable()
export class StatisticsService {
    constructor(private readonly em: EntityManager) {}

    async getDashboardNumbers(
        userId: number,
    ): Promise<{ totalReceivedThisMonth: number; totalLeftThisMonth: number; total: number }> {
        // todo here
        return {
            totalReceivedThisMonth: 6403,
            totalLeftThisMonth: 1003,
            total: 64503,
        }
    }
}
