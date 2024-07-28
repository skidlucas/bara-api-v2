import { Injectable } from '@nestjs/common'
import { EntityManager } from '@mikro-orm/postgresql'
import { DashboardQueryParams, MetricsByMonth } from './statistics.dto'

interface DashboardQueryResult {
    month: string
    total_social_security_paid: string
    total_social_security_unpaid: string
    total_insurance_paid: string
    total_insurance_unpaid: string
    total_paid_cumulative: string
}

@Injectable()
export class StatisticsService {
    constructor(private readonly em: EntityManager) {}

    async getDashboardNumbers(
        userId: number,
        queryParams: DashboardQueryParams,
    ): Promise<{
        totalReceivedThisMonth: number
        totalLeftThisMonth: number
        total: number
        metricsByMonth: MetricsByMonth[]
    }> {
        const { from, to } = queryParams

        const queryResults: DashboardQueryResult[] = await this.em.getDriver().execute(
            `WITH invoice_totals AS (
                            SELECT 
                                TO_CHAR(DATE_TRUNC('month', i.date), 'YYYY-MM') AS month,
                                SUM(CASE WHEN i.is_social_security_paid THEN i.social_security_amount ELSE 0 END) AS total_social_security_paid,
                                SUM(CASE WHEN NOT i.is_social_security_paid THEN i.social_security_amount ELSE 0 END) AS total_social_security_unpaid,
                                SUM(CASE WHEN i.is_insurance_paid THEN i.insurance_amount ELSE 0 END) AS total_insurance_paid,
                                SUM(CASE WHEN NOT i.is_insurance_paid THEN i.insurance_amount ELSE 0 END) AS total_insurance_unpaid
                            FROM 
                                invoice i
                            JOIN patient p ON p.id = i.patient_id
                            JOIN "user" u ON u.id = p.health_professional_id
                            WHERE i.date BETWEEN ? AND ?
                                AND u.id = ?
                                AND i.deleted_at IS NULL
                            GROUP BY 
                                TO_CHAR(DATE_TRUNC('month', i.date), 'YYYY-MM')
                        )
                        SELECT
                            month,
                            total_social_security_paid,
                            total_social_security_unpaid,
                            total_insurance_paid,
                            total_insurance_unpaid,
                            SUM(total_social_security_paid + total_insurance_paid) OVER (ORDER BY month ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS total_paid_cumulative
                        FROM
                            invoice_totals
                        ORDER BY
                            month;`,
            [from, to, userId],
        )

        const metricsByMonth: MetricsByMonth[] = []
        for (const row of queryResults) {
            metricsByMonth.push({
                month: row.month,
                total_social_security_paid: parseInt(row.total_social_security_paid, 10) / 100,
                total_social_security_unpaid: parseInt(row.total_social_security_unpaid, 10) / 100,
                total_insurance_paid: parseInt(row.total_insurance_paid, 10) / 100,
                total_insurance_unpaid: parseInt(row.total_insurance_unpaid, 10) / 100,
                total_paid_cumulative: parseInt(row.total_paid_cumulative, 10) / 100,
            })
        }

        const currentMonth = new Date().toISOString().slice(0, 7) // format YYYY-MM like the SQL result
        const currentMonthData = metricsByMonth.find((row) => row.month === currentMonth)

        let totalReceivedThisMonth = 0,
            totalLeftThisMonth = 0,
            total = 0
        if (currentMonthData) {
            totalReceivedThisMonth = currentMonthData.total_insurance_paid + currentMonthData.total_social_security_paid
            totalLeftThisMonth = currentMonthData.total_insurance_unpaid + currentMonthData.total_social_security_unpaid
        }

        if (metricsByMonth.length) {
            total = metricsByMonth[0].total_paid_cumulative
        }

        return {
            totalReceivedThisMonth,
            totalLeftThisMonth,
            total,
            metricsByMonth,
        }
    }
}
