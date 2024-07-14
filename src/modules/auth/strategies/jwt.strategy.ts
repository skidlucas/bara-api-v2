import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { passportJwtSecret } from 'jwks-rsa'
import { UserService } from '../../user/user.service'

export class JwtPayload {
    sub: string
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private userService: UserService) {
        super({
            secretOrKeyProvider: passportJwtSecret({
                cache: true,
                rateLimit: true,
                jwksRequestsPerMinute: 5,
                jwksUri: `${process.env.CLERK_ISSUER_URL}/.well-known/jwks.json`,
            }),

            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: process.env.ENVIRONMENT === 'local', // ignore expiration for local purposes
            issuer: process.env.CLERK_ISSUER_URL,
            algorithms: ['RS256'],
        })
    }

    async validate(payload: JwtPayload) {
        return await this.userService.findEnrichedUserByClerkId(payload.sub)
    }
}
