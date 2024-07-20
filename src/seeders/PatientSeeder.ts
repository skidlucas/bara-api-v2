import type { EntityManager } from '@mikro-orm/core'
import { Seeder } from '@mikro-orm/seeder'
import { User } from '../entities/user.entity'
import { Patient } from '../entities/patient.entity'
import { Insurance } from '../entities/insurance.entity'

export class PatientSeeder extends Seeder {
    async run(em: EntityManager): Promise<void> {
        em.create(Patient, {
            id: 1,
            firstname: 'Lucas',
            lastname: 'Martinez',
            healthProfessional: em.getReference(User, 1),
            insurance: em.getReference(Insurance, 1),
        })

        em.create(Patient, {
            id: 2,
            firstname: 'Hugo',
            lastname: 'Martinez',
            healthProfessional: em.getReference(User, 1),
            insurance: em.getReference(Insurance, 1),
        })

        em.create(Patient, {
            id: 3,
            firstname: 'Denis',
            lastname: 'Tellenne',
            healthProfessional: em.getReference(User, 1),
            insurance: em.getReference(Insurance, 2),
        })

        em.create(Patient, {
            id: 4,
            firstname: 'Bernard',
            lastname: 'Tellenne',
            healthProfessional: em.getReference(User, 2),
        })
    }
}
