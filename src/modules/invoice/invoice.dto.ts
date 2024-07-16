import { IsBoolean, IsInt, IsISO8601, IsNumber, IsOptional } from 'class-validator'

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
