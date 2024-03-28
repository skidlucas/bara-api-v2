import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    RelationId,
    UpdateDateColumn,
} from 'typeorm'
import { Patient } from './patient.entity'
import { Insurance } from './insurance.entity'

@Entity()
export class Invoice {
    constructor(init?: Partial<Invoice>) {
        Object.assign(this, init)
    }

    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'date', default: () => 'NOW()' })
    date: Date

    @Column()
    socialSecurityAmount: number

    @Column()
    insuranceAmount: number

    @Column()
    isSocialSecurityPaid: boolean

    @Column()
    isInsurancePaid: boolean

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @ManyToOne(() => Patient, (patient) => patient.invoices)
    @JoinColumn()
    patient: Patient

    @Column()
    @RelationId((invoice: Invoice) => invoice.patient)
    patientId: number

    @ManyToOne(() => Insurance, (insurance) => insurance.invoices)
    @JoinColumn()
    insurance: Insurance

    @Column({ nullable: true })
    @RelationId((invoice: Invoice) => invoice.insurance)
    insuranceId: number
}
