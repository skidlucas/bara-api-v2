import { Patient } from './patient.entity'
import { Invoice } from './invoice.entity'
import { Collection, Entity, OneToMany, Property } from '@mikro-orm/postgresql'
import { BaseEntity } from './base.entity'

@Entity()
export class Insurance extends BaseEntity {
    constructor(init?: Partial<Insurance>) {
        super()
        Object.assign(this, init)
    }

    @Property()
    name!: string

    @Property({ nullable: true })
    amcNumber?: string

    @OneToMany(() => Patient, (patient) => patient.insurance)
    patients = new Collection<Patient>(this)

    @OneToMany(() => Invoice, (invoice) => invoice.insurance)
    invoices = new Collection<Invoice>(this)
}
