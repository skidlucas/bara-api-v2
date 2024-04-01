import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { UserService } from '../../user/user.service'

export class JwtPayload {
    sub: number
    email: string
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private userService: UserService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: process.env.ENVIRONMENT === 'local', // ignore expiration for local purposes
            secretOrKey: process.env.JWT_SECRET,
        })
    }

    async validate(payload: JwtPayload) {
        const user = await this.userService.findEnrichedUserById(payload.sub)
        delete user.password

        return user
    }
}
