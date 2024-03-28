import { IsString, Matches } from 'class-validator'
import { emailPattern, passwordPattern } from '../../../utils/patterns'

export class PhysiotherapistSignUpDto {
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
