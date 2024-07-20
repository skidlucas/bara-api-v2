import { Patient } from './patient.entity'
import { Insurance } from './insurance.entity'
import { Entity, ManyToOne, Property } from '@mikro-orm/postgresql'
import { BaseEntity } from './base.entity'

@Entity()
export class Invoice extends BaseEntity {
    constructor(init?: Partial<Invoice>) {
        super()
        Object.assign(this, init)
    }

    @Property()
    date!: Date

    @Property()
    socialSecurityAmount: number = 0

    @Property()
    insuranceAmount: number = 0

    @Property()
    isSocialSecurityPaid: boolean = false

    @Property()
    isInsurancePaid: boolean = false

    @Property()
    deleted: boolean = false

    @ManyToOne()
    patient!: Patient

    @ManyToOne()
    insurance?: Insurance
}
