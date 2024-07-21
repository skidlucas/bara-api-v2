import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { CreateRequestContext, MikroORM } from '@mikro-orm/postgresql'
import { InsuranceService } from './insurance.service'
import { CreateInsuranceDto, FindInsurancesQueryParams } from './insurance.dto'
import { Insurance } from '../../entities/insurance.entity'

@Controller('insurances')
export class InsuranceController {
    constructor(
        private insuranceService: InsuranceService,
        private readonly orm: MikroORM,
    ) {}

    @Get()
    @CreateRequestContext()
    async getInsurances(
        @Query() queryParams: FindInsurancesQueryParams,
    ): Promise<{ data: Insurance[]; totalItems: number }> {
        return await this.insuranceService.getInsurances(queryParams)
    }

    @Post()
    @CreateRequestContext()
    async createInsurance(@Body() insuranceDto: CreateInsuranceDto): Promise<Insurance> {
        return await this.insuranceService.createInsurance(insuranceDto)
    }
}
