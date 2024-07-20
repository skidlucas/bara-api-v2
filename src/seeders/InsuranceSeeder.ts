import type { EntityManager } from '@mikro-orm/core'
import { Seeder } from '@mikro-orm/seeder'
import { Insurance } from '../entities/insurance.entity'

export class InsuranceSeeder extends Seeder {
    async run(em: EntityManager): Promise<void> {
        em.create(Insurance, {
            id: 1,
            name: 'Alan',
            amcNumber: '123',
        })

        em.create(Insurance, {
            id: 2,
            name: 'Harmonie Mutuelle',
            amcNumber: '456',
        })

        em.create(Insurance, {
            id: 3,
            name: 'Henner',
            amcNumber: '789',
        })
    }
}
