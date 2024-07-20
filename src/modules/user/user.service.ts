import { Injectable } from '@nestjs/common'
import { User } from '../../entities/user.entity'
import { InjectRepository } from '@mikro-orm/nestjs'
import { CreateRequestContext, EntityRepository, MikroORM } from '@mikro-orm/postgresql'

@Injectable()
export class UserService {
    constructor(
        private readonly orm: MikroORM,
        @InjectRepository(User)
        private userRepository: EntityRepository<User>,
    ) {}

    @CreateRequestContext()
    async findEnrichedUserByClerkId(clerkId: string): Promise<User> {
        return await this.userRepository.findOneOrFail({ clerkId }, { populate: ['patients'] })
    }
}
