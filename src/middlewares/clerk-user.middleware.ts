import { Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Response } from 'express'
import { UserService } from 'src/modules/user/user.service'

@Injectable()
export class ClerkUserMiddleware implements NestMiddleware {
    constructor(private readonly userService: UserService) {}

    async use(req: any, res: Response, next: NextFunction) {
        const publicRoutesRegexes = ['^/$']
        const isPublicRoute = publicRoutesRegexes.some((route) => new RegExp(route).test(req.url))
        if (isPublicRoute) return next()

        const user = await this.userService.findEnrichedUserByClerkId(req.auth.userId)
        if (!user) return res.status(401).send('Unauthorized: You must provide a valid Clerk token.')

        req.user = user
        next()
    }
}
