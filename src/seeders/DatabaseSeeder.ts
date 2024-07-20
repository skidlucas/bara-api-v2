import type { EntityManager } from '@mikro-orm/core'
import { Seeder } from '@mikro-orm/seeder'
import { InsuranceSeeder } from './InsuranceSeeder'
import { InvoiceSeeder } from './InvoiceSeeder'
import { PatientSeeder } from './PatientSeeder'
import { UserSeeder } from './UserSeeder'

export class DatabaseSeeder extends Seeder {
    async run(em: EntityManager): Promise<void> {
        await this.clearDatabase(em)
        return this.call(em, [InsuranceSeeder, UserSeeder, PatientSeeder, InvoiceSeeder])
    }

    private async clearDatabase(em: EntityManager): Promise<void> {
        await em.getConnection().execute(`TRUNCATE TABLE "invoice" RESTART IDENTITY CASCADE`)
        await em.getConnection().execute(`TRUNCATE TABLE "user" RESTART IDENTITY CASCADE`)
        await em.getConnection().execute(`TRUNCATE TABLE "patient" RESTART IDENTITY CASCADE`)
        await em.getConnection().execute(`TRUNCATE TABLE "insurance" RESTART IDENTITY CASCADE`)
    }
}
