import { Test, TestingModule } from '@nestjs/testing';
import { PhysiotherapistController } from './physiotherapist.controller';

describe('PhysiotherapistController', () => {
  let controller: PhysiotherapistController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PhysiotherapistController],
    }).compile();

    controller = module.get<PhysiotherapistController>(PhysiotherapistController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
