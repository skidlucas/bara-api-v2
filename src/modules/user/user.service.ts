import { CreateRequestContext, EntityManager, MikroORM } from '@mikro-orm/postgresql'
import { Injectable } from '@nestjs/common'
import { User } from '../../entities/user.entity'
import { EmojiLogger } from '../logger/emoji-logger.service'

@Injectable()
export class UserService {
    constructor(
        private readonly orm: MikroORM,
        private readonly em: EntityManager,
        private readonly logger: EmojiLogger,
    ) {}

    @CreateRequestContext()
    async findEnrichedUserByClerkId(clerkId: string): Promise<User> {
        this.logger.log('findEnrichedUserByClerkId', { clerkId })

        return await this.em.findOne(User, { clerkId }, { populate: ['patients'] })
    }

    @CreateRequestContext()
    async createUser(clerkId: string): Promise<User> {
        this.logger.log('createUser', { clerkId })
        const user = new User({ clerkId })
        await this.em.persistAndFlush(user)

        return user
    }
}
