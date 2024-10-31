import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { User } from '../../entities/user.entity'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { LoggerModule } from '../logger/logger.module'

@Module({
    imports: [MikroOrmModule.forFeature({ entities: [User] }), LoggerModule],
    controllers: [],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
