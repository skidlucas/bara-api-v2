import { Module } from '@nestjs/common';
import { PhysiotherapistController } from './physiotherapist.controller';
import { PhysiotherapistService } from './physiotherapist.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Physiotherapist } from '../../entities/physiotherapist.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Physiotherapist])],
  controllers: [PhysiotherapistController],
  providers: [PhysiotherapistService],
})
export class PhysiotherapistModule {}
