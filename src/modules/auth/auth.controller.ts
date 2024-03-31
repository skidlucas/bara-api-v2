import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common'
import { LocalAuthGuard } from './guards/local-auth.guard'
import { AuthService } from './auth.service'
import { Public } from './public.decorator'

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Public()
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req: any) {
        return this.authService.login(req.user)
    }

    @Get('me')
    getProfile(@Request() req) {
        return req.user
    }
}
