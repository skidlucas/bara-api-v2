import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FixtureModule } from './modules/fixture/fixture.module';
import { PhysiotherapistModule } from './modules/physiotherapist/physiotherapist.module';

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
    PhysiotherapistModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
