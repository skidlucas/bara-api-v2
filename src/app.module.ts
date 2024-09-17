import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import { FixtureModule } from './modules/fixture/fixture.module'
import { UserModule } from './modules/user/user.module'
import { AuthModule } from './modules/auth/auth.module'
import { APP_GUARD } from '@nestjs/core'
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard'
import { InvoiceModule } from './modules/invoice/invoice.module'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { InsuranceModule } from './modules/insurance/insurance.module'
import { PatientModule } from './modules/patient/patient.module'
import { StatisticsModule } from './modules/statistics/statistics.module'
import { ScheduleModule } from '@nestjs/schedule'

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        MikroOrmModule.forRoot(),
        ScheduleModule.forRoot(),
        FixtureModule,
        UserModule,
        AuthModule,
        InvoiceModule,
        InsuranceModule,
        PatientModule,
        StatisticsModule,
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
