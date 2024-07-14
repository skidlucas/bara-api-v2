import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '../../entities/user.entity'
import { Repository } from 'typeorm'

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async findEnrichedUserByClerkId(clerkId: string): Promise<User> {
        const user = await this.userRepository
            .createQueryBuilder('user')
            .leftJoin('user.patients', 'patients')
            .where('user.clerkId = :clerkId', { clerkId })
            .select(['user', 'patients.id'])
            .getOne()

        if (!user) {
            throw new NotFoundException(`User with Clerk ID '${clerkId}' not found`)
        }

        return user
    }
}
