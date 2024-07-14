import { Controller, Get, Request } from '@nestjs/common'

@Controller('auth')
export class AuthController {
    constructor() {}

    @Get('me')
    getProfile(@Request() req) {
        return req.user
    }
}
