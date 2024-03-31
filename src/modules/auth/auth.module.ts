import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { UserModule } from '../user/user.module'
import { PassportModule } from '@nestjs/passport'
import { LocalStrategy } from './strategies/local.strategy'
import { AuthController } from './auth.controller'
import { JwtModule } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { JwtStrategy } from './strategies/jwt.strategy'

@Module({
    imports: [
        UserModule,
        PassportModule,
        JwtModule.registerAsync({
            useFactory: (configService: ConfigService) => {
                return {
                    secret: configService.get<string>('JWT_SECRET'),
                    signOptions: { expiresIn: '60s' },
                }
            },
            inject: [ConfigService],
        }),
    ],
    providers: [AuthService, LocalStrategy, JwtStrategy],
    controllers: [AuthController],
})
export class AuthModule {}
