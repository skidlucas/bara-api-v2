import { IsBooleanString, IsNumberString, IsOptional, IsString } from 'class-validator'

export class PatientDto {
    @IsString()
    firstname: string

    @IsString()
    lastname: string

    @IsOptional()
    insuranceId?: number
}

export class FindPatientsQueryParams {
    @IsNumberString()
    page: number

    @IsNumberString()
    limit: number

    @IsString()
    @IsOptional()
    search?: string

    @IsBooleanString()
    @IsOptional()
    activeOnly?: boolean
}
