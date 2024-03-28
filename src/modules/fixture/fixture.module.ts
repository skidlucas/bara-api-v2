import { Module } from '@nestjs/common';
import { FixtureController } from './fixture.controller';
import { FixtureService } from './fixture.service';

@Module({
  controllers: [FixtureController],
  providers: [FixtureService],
})
export class FixtureModule {}
