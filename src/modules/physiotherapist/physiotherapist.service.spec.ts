import { Test, TestingModule } from '@nestjs/testing';
import { PhysiotherapistService } from './physiotherapist.service';

describe('PhysiotherapistService', () => {
  let service: PhysiotherapistService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PhysiotherapistService],
    }).compile();

    service = module.get<PhysiotherapistService>(PhysiotherapistService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
