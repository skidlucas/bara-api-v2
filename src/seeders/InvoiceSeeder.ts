import type { EntityManager } from '@mikro-orm/core'
import { Seeder } from '@mikro-orm/seeder'
import { Insurance } from '../entities/insurance.entity'
import { Invoice } from '../entities/invoice.entity'
import { Patient } from '../entities/patient.entity'

export class InvoiceSeeder extends Seeder {
    async run(em: EntityManager): Promise<void> {
        em.create(Invoice, {
            id: 1,
            date: '2024-02-23',
            socialSecurityAmount: 5500,
            insuranceAmount: 8500,
            isSocialSecurityPaid: true,
            isInsurancePaid: false,
            patient: em.getReference(Patient, 1),
            insurance: em.getReference(Insurance, 1),
        })

        em.create(Invoice, {
            id: 2,
            date: '2024-02-17',
            socialSecurityAmount: 5500,
            insuranceAmount: 8500,
            isSocialSecurityPaid: true,
            isInsurancePaid: true,
            patient: em.getReference(Patient, 2),
            insurance: em.getReference(Insurance, 1),
        })

        em.create(Invoice, {
            id: 3,
            date: '2024-02-25',
            socialSecurityAmount: 5500,
            insuranceAmount: 0,
            isSocialSecurityPaid: false,
            isInsurancePaid: false,
            patient: em.getReference(Patient, 3),
            insurance: em.getReference(Insurance, 2),
        })
    }
}
