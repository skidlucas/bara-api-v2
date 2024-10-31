import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { EntityManager, QueryOrder } from '@mikro-orm/postgresql'
import { CreateInsuranceDto, FindInsurancesQueryParams } from './insurance.dto'
import { Insurance } from '../../entities/insurance.entity'
import { EmojiLogger } from '../logger/emoji-logger.service'

@Injectable()
export class InsuranceService {
    constructor(
        private readonly em: EntityManager,
        private readonly logger: EmojiLogger,
    ) {}

    async getInsurances(queryParams: FindInsurancesQueryParams): Promise<{ data: Insurance[]; totalItems: number }> {
        this.logger.log('getInsurances', { queryParams })
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
        this.logger.log('createInsurance', { insuranceDto })
        const { name, amcNumber } = insuranceDto

        const insurance = new Insurance({
            name,
            amcNumber,
        })

        try {
            await this.em.persistAndFlush(insurance)
            return insurance
        } catch (err) {
            this.logger.error('createInsurance', { insuranceDto, err })
            throw new InternalServerErrorException('Failed to create insurance')
        }
    }
}
