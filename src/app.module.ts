import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import { UserModule } from './modules/user/user.module'
import { AuthModule } from './modules/auth/auth.module'
import { InvoiceModule } from './modules/invoice/invoice.module'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { InsuranceModule } from './modules/insurance/insurance.module'
import { PatientModule } from './modules/patient/patient.module'
import { StatisticsModule } from './modules/statistics/statistics.module'
import { ClerkUserMiddleware } from './middlewares/clerk-user.middleware'

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        MikroOrmModule.forRoot(),
        UserModule,
        AuthModule,
        InvoiceModule,
        InsuranceModule,
        PatientModule,
        StatisticsModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(ClerkUserMiddleware).forRoutes('*')
    }
}
