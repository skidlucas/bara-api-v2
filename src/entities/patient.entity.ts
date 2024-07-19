import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    RelationId,
    UpdateDateColumn,
} from 'typeorm'
import { User } from './user.entity'
import { Invoice } from './invoice.entity'
import { Insurance } from './insurance.entity'

@Entity()
export class Patient {
    constructor(init?: Partial<Patient>) {
        Object.assign(this, init)
    }

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    lastname: string

    @Column()
    firstname: string

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @ManyToOne(() => User, (user) => user.patients)
    @JoinColumn()
    healthProfessional: User

    @Column()
    @RelationId((patient: Patient) => patient.healthProfessional)
    healthProfessionalId: number

    @OneToMany(() => Invoice, (invoice) => invoice.patient)
    @JoinColumn()
    invoices: Invoice[]

    @ManyToOne(() => Insurance, (insurance) => insurance.patients)
    @JoinColumn()
    insurance?: Insurance

    @Column({ nullable: true })
    @RelationId((patient: Patient) => patient.insurance)
    insuranceId?: number
}
