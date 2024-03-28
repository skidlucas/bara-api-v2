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
// import * as bcrypt from 'bcryptjs';
import { Patient } from './patient.entity'
import { AccessToken } from './access-token.entity'

@Entity()
@Unique(['email'])
export class Physiotherapist {
    constructor(init?: Partial<Physiotherapist>) {
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

    @Column({ nullable: true })
    resetPasswordToken: string

    @Column({ nullable: true })
    resetPasswordTokenExpiresAt: Date

    @Column({ default: 'enabled' })
    status: string

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @OneToMany(() => AccessToken, (accessToken) => accessToken.physiotherapist, {
        cascade: true,
    })
    accessTokens: AccessToken[]

    @OneToMany(() => Patient, (patient) => patient.physiotherapist)
    @JoinColumn()
    patients: Patient[]

    async validatePassword(password: string): Promise<boolean> {
        return true
        // return bcrypt.compare(password, this.password);
    }
}
