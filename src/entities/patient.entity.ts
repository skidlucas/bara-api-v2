import { User } from './user.entity'
import { Invoice } from './invoice.entity'
import { Insurance } from './insurance.entity'
import { Collection, Entity, ManyToOne, OneToMany, Property } from '@mikro-orm/postgresql'
import { BaseEntity } from './base.entity'

@Entity()
export class Patient extends BaseEntity {
    constructor(init?: Partial<Patient>) {
        super()
        Object.assign(this, init)
    }

    @Property()
    lastname!: string

    @Property()
    firstname!: string

    @ManyToOne()
    healthProfessional!: User

    @OneToMany(() => Invoice, (invoice) => invoice.patient)
    invoices = new Collection<Invoice>(this)

    @ManyToOne()
    insurance?: Insurance
}
