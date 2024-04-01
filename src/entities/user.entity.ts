import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToMany,
    PrimaryGeneratedColumn,
    Unique,
    UpdateDateColumn,
} from 'typeorm'
import { Patient } from './patient.entity'

@Entity()
@Unique(['email'])
export class User {
    constructor(init?: Partial<User>) {
        Object.assign(this, init)
    }

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    email: string

    @Column()
    firstname: string

    @Column()
    password: string

    @Column({ nullable: true, select: false })
    resetPasswordToken: string

    @Column({ nullable: true, select: false })
    resetPasswordTokenExpiresAt: Date

    @Column({ default: 'enabled' })
    status: string

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @OneToMany(() => Patient, (patient) => patient.physiotherapist)
    @JoinColumn()
    patients: Patient[]
}
