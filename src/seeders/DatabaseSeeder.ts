import type { EntityManager } from '@mikro-orm/core'
import { Seeder } from '@mikro-orm/seeder'
import { InsuranceSeeder } from './InsuranceSeeder'
import { InvoiceSeeder } from './InvoiceSeeder'
import { PatientSeeder } from './PatientSeeder'
import { UserSeeder } from './UserSeeder'

export class DatabaseSeeder extends Seeder {
    async run(em: EntityManager): Promise<void> {
        await this.clearDatabase(em)
        await this.call(em, [InsuranceSeeder, UserSeeder, PatientSeeder, InvoiceSeeder])
        await this.updateIdSequences(em)
    }

    private async clearDatabase(em: EntityManager): Promise<void> {
        await em.getConnection().execute(`TRUNCATE TABLE "invoice" RESTART IDENTITY CASCADE`)
        await em.getConnection().execute(`TRUNCATE TABLE "user" RESTART IDENTITY CASCADE`)
        await em.getConnection().execute(`TRUNCATE TABLE "patient" RESTART IDENTITY CASCADE`)
        await em.getConnection().execute(`TRUNCATE TABLE "insurance" RESTART IDENTITY CASCADE`)
    }

    private async updateIdSequences(em: EntityManager): Promise<void> {
        await em
            .getConnection()
            .execute(`SELECT setval('invoice_id_seq', COALESCE((SELECT MAX(id)+1 FROM "invoice"), 1), false);`)
        await em
            .getConnection()
            .execute(`SELECT setval('user_id_seq', COALESCE((SELECT MAX(id)+1 FROM "user"), 1), false);`)
        await em
            .getConnection()
            .execute(`SELECT setval('patient_id_seq', COALESCE((SELECT MAX(id)+1 FROM "patient"), 1), false);`)
        await em
            .getConnection()
            .execute(`SELECT setval('insurance_id_seq', COALESCE((SELECT MAX(id)+1 FROM "insurance"), 1), false);`)
    }
}
