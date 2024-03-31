import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common'
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
        // todo improve this ? 404 if not found?
        return this.userRepository.findOne({ where: { email } })
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
