import { IsBoolean, IsInt, IsISO8601, IsNumber, IsNumberString, IsOptional, IsString } from 'class-validator'

export class CreateInvoiceDto {
    @IsNumber()
    socialSecurityAmount: number

    @IsNumber()
    insuranceAmount: number

    @IsBoolean()
    isSocialSecurityPaid: boolean

    @IsBoolean()
    isInsurancePaid: boolean

    @IsISO8601({ strict: false })
    date: Date

    @IsInt()
    patientId: number

    @IsInt()
    @IsOptional()
    insuranceId?: number
}

export class UpdateInvoiceDto {
    @IsNumber()
    @IsOptional()
    socialSecurityAmount?: number

    @IsNumber()
    @IsOptional()
    insuranceAmount?: number

    @IsBoolean()
    @IsOptional()
    isSocialSecurityPaid?: boolean

    @IsBoolean()
    @IsOptional()
    isInsurancePaid?: boolean

    @IsISO8601({ strict: false })
    @IsOptional()
    date?: Date

    @IsInt()
    @IsOptional()
    patientId?: number

    @IsInt()
    @IsOptional()
    insuranceId?: number
}

export class FindInvoicesQueryParams {
    @IsNumberString()
    page: number

    @IsNumberString()
    limit: number

    @IsString()
    @IsOptional()
    search?: string

    @IsString()
    @IsOptional()
    unpaid?: string
}
