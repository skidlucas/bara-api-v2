import { IsString, Matches } from 'class-validator'
import { emailPattern, passwordPattern } from '../../../utils/patterns'
import { OmitType } from '@nestjs/mapped-types'

export class UserSignUpDto {
    @IsString()
    @Matches(emailPattern, {
        message: 'email address is incorrect',
    })
    email: string

    @IsString()
    @Matches(passwordPattern, {
        message: 'password too weak',
    })
    password: string

    @IsString()
    firstname: string
}

export class UserLoginDto extends OmitType(UserSignUpDto, ['firstname'] as const) {}
