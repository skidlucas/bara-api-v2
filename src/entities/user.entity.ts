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

    // @Column()
    // firstname: string
    //
    // @Column()
    // password: string
    //
    // @Column({ nullable: true, select: false })
    // resetPasswordToken: string
    //
    // @Column({ nullable: true, select: false })
    // resetPasswordTokenExpiresAt: Date
    //
    // @Column({ default: 'enabled' })
    // status: string
    //
    // @CreateDateColumn()
    // createdAt: Date
    //
    // @UpdateDateColumn()
    // updatedAt: Date

    @OneToMany(() => Patient, (patient) => patient.physiotherapist)
    @JoinColumn()
    patients: Patient[]
}
