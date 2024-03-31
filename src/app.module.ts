import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { FixtureModule } from './modules/fixture/fixture.module'
import { UserModule } from './modules/user/user.module'
import { AuthModule } from './modules/auth/auth.module'
import { APP_GUARD } from '@nestjs/core'
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard'

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.PGHOST,
            username: process.env.PGUSER,
            password: process.env.PGPASSWORD,
            database: process.env.PGDATABASE,
            ssl: true,
            entities: [__dirname + '/../**/entities/*.entity.js'],
            synchronize: process.env.ENVIRONMENT === 'local',
            logging: 'all', // remove in prod?
        }),
        FixtureModule,
        UserModule,
        AuthModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
    ],
})
export class AppModule {}
