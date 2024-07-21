import { Injectable } from '@nestjs/common'
import { EntityManager, QueryOrder } from '@mikro-orm/postgresql'
import { CreateInsuranceDto, FindInsurancesQueryParams } from './insurance.dto'
import { Insurance } from '../../entities/insurance.entity'

@Injectable()
export class InsuranceService {
    constructor(private readonly em: EntityManager) {}

    async getInsurances(queryParams: FindInsurancesQueryParams): Promise<{ data: Insurance[]; totalItems: number }> {
        const { limit, page, search } = queryParams

        const where: any = {}

        if (search) {
            const ilikeSearch = { $ilike: `%${search}%` }
            where.name = ilikeSearch
            where.amcNumber = ilikeSearch
        }

        const [insurances, count] = await this.em.findAndCount(Insurance, where, {
            limit: limit,
            offset: limit * (page - 1),
            fields: ['id', 'name', 'amcNumber'],
            orderBy: { name: QueryOrder.ASC },
        })

        return { data: insurances as Insurance[], totalItems: count }
    }

    async createInsurance(insuranceDto: CreateInsuranceDto): Promise<Insurance> {
        const { name, amcNumber } = insuranceDto

        const insurance = new Insurance({
            name,
            amcNumber,
        })

        try {
            await this.em.persistAndFlush(insurance)
            return insurance
        } catch (err) {
            console.error(err)
        }
    }
}
