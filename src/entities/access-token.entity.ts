import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, RelationId } from 'typeorm'
import { User } from './user.entity'

@Entity()
export class AccessToken {
    constructor(init?: Partial<AccessToken>) {
        Object.assign(this, init)
    }

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ default: 86400 })
    ttl: number

    @CreateDateColumn()
    createdAt: Date

    @ManyToOne(() => User, (user) => user.accessTokens)
    user: User

    @Column()
    @RelationId((accessToken: AccessToken) => accessToken.user)
    userId: number
}
