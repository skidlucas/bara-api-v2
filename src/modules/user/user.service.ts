import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '../../entities/user.entity'
import { Repository } from 'typeorm'
import { UserSignUpDto } from './dto/user.dto'
import { hashPassword } from '../../utils/utils'

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async findByEmail(email: string): Promise<User> {
        const user = await this.userRepository.findOneBy({ email })

        if (!user) {
            throw new NotFoundException(`User email '${email}' not found`)
        }

        return user
    }

    async findEnrichedUserById(id: number): Promise<User> {
        const user = await this.userRepository
            .createQueryBuilder('user')
            .leftJoin('user.patients', 'patients')
            .where('user.id = :id', { id })
            .select(['user', 'patients.id'])
            .getOne()

        if (!user) {
            throw new NotFoundException(`User ID '${id}' not found`)
        }

        return user
    }

    async signUp(userDto: UserSignUpDto) {
        const { email, password, firstname } = userDto

        const user = new User({
            email,
            firstname,
            password: hashPassword(password),
        })

        try {
            await this.userRepository.save(user)
        } catch (error) {
            if (error.code === '23505') {
                // duplicate email
                throw new ConflictException('Email already exists')
            } else {
                throw new InternalServerErrorException()
            }
        }
    }
}
