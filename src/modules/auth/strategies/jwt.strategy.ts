import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: process.env.ENVIRONMENT === 'local', // ignore expiration for local purposes
            secretOrKey: process.env.JWT_SECRET,
        })
    }

    async validate(payload: any) {
        console.log(payload)
        // todo lookup user and enrich the returned object directly here like get the list of patients etc.
        return { userId: payload.id, email: payload.email }
    }
}
