import { Body, Controller, Post } from '@nestjs/common'
import { UserService } from './user.service'
import { UserSignUpDto } from './dto/user.dto'

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('sign-up')
    async signUp(@Body() userDto: UserSignUpDto) {
        return this.userService.signUp(userDto)
    }
}
