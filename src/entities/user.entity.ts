import { Collection, Entity, OneToMany, Property } from '@mikro-orm/postgresql'
import { Patient } from './patient.entity'
import { BaseEntity } from './base.entity'

@Entity()
export class User extends BaseEntity {
    constructor(init?: Partial<User>) {
        super()
        Object.assign(this, init)
    }

    @Property({ unique: true })
    clerkId?: string

    @OneToMany(() => Patient, (patient) => patient.healthProfessional)
    patients = new Collection<Patient>(this)
}
