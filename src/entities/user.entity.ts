import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm'
import { Patient } from './patient.entity'

@Entity()
@Unique(['clerkId'])
export class User {
    constructor(init?: Partial<User>) {
        Object.assign(this, init)
    }

    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: true })
    clerkId: string

    @OneToMany(() => Patient, (patient) => patient.healthProfessional)
    @JoinColumn()
    patients: Patient[]
}
