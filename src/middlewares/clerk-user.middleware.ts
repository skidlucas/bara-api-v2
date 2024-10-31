import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common'
import { NextFunction, Response } from 'express'
import { UserService } from 'src/modules/user/user.service'

@Injectable()
export class ClerkUserMiddleware implements NestMiddleware {
    constructor(private readonly userService: UserService) {}

    async use(req: any, res: Response, next: NextFunction) {
        const publicRoutesRegexes = ['^/$', '^$', '^/favicon.ico$']
        const isPublicRoute = publicRoutesRegexes.some((route) => new RegExp(route).test(req.url))
        if (isPublicRoute) return next()

        const user = await this.userService.findEnrichedUserByClerkId(req.auth.userId)
        if (!user) throw new UnauthorizedException('User not found')

        req.user = user
        next()
    }
}
