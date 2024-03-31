import { Injectable } from '@nestjs/common'
import { UserService } from '../user/user.service'
import { JwtService } from '@nestjs/jwt'
import { compareSync } from 'bcryptjs'
import { User } from '../../entities/user.entity'

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
    ) {}

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.userService.findByEmail(email)

        if (user && compareSync(password, user.password)) {
            delete user.password
            return user
        }

        return null
    }

    async login(user: User) {
        return {
            access_token: this.jwtService.sign({ email: user.email, id: user.id }),
        }
    }
}