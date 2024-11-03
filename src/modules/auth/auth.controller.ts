import { Controller, Get, Post, Request } from '@nestjs/common'
import { UserService } from '../user/user.service'

@Controller('auth')
export class AuthController {
    constructor(private readonly userService: UserService) {}

    @Get('me')
    getProfile(@Request() req) {
        return req.user
    }

    // this route is marked as public but we will have a token in the request, and we will use it to create a user
    @Post('sign-up')
    signUp(@Request() req) {
        return this.userService.createUser(req.auth.userId)
    }
}
