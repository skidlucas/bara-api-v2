import { Injectable } from '@nestjs/common'
import { User } from '../../entities/user.entity'
import { InjectRepository } from '@mikro-orm/nestjs'
import { CreateRequestContext, EntityRepository, MikroORM } from '@mikro-orm/postgresql'
import { EmojiLogger } from '../logger/emoji-logger.service'

@Injectable()
export class UserService {
    constructor(
        private readonly orm: MikroORM,
        @InjectRepository(User)
        private userRepository: EntityRepository<User>,
        private readonly logger: EmojiLogger,
    ) {}

    @CreateRequestContext()
    async findEnrichedUserByClerkId(clerkId: string): Promise<User> {
        this.logger.log('findEnrichedUserByClerkId', { clerkId })
        return await this.userRepository.findOne({ clerkId }, { populate: ['patients'] })
    }
}
