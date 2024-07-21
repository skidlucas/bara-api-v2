import { IsNumberString, IsOptional, IsString } from 'class-validator'

export class CreateInsuranceDto {
    @IsString()
    name: string

    @IsString()
    @IsOptional()
    amcNumber?: string
}

export class FindInsurancesQueryParams {
    @IsNumberString()
    page: number

    @IsNumberString()
    limit: number

    @IsString()
    @IsOptional()
    search?: string
}
