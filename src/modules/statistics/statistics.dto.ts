import { IsISO8601 } from 'class-validator'

export class DashboardQueryParams {
    @IsISO8601({ strict: false })
    from: Date

    @IsISO8601({ strict: false })
    to: Date
}
