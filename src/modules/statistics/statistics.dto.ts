import { IsISO8601 } from 'class-validator'

export class DashboardQueryParams {
    @IsISO8601({ strict: false })
    from: Date

    @IsISO8601({ strict: false })
    to: Date
}

export class MetricsByMonth {
    month: string
    total_social_security_paid: number
    total_social_security_unpaid: number
    total_insurance_paid: number
    total_insurance_unpaid: number
    total_paid_cumulative: number
}
