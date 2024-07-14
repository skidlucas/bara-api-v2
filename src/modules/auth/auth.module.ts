import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { JwtStrategy } from './strategies/jwt.strategy'
import { UserModule } from '../user/user.module'

@Module({
    imports: [UserModule],
    providers: [JwtStrategy],
    controllers: [AuthController],
})
export class AuthModule {}
