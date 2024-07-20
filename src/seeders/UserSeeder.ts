import type { EntityManager } from '@mikro-orm/core'
import { Seeder } from '@mikro-orm/seeder'
import { User } from '../entities/user.entity'

export class UserSeeder extends Seeder {
    async run(em: EntityManager): Promise<void> {
        em.create(User, {
            id: 1,
            clerkId: 'user_2ePTOYPUIRhg9RgAD1tln3M8Aeb',
        })

        em.create(User, {
            id: 2,
            clerkId: 'xxx',
        })

        em.create(User, {
            id: 3,
            clerkId: 'yyy',
        })
    }
}
