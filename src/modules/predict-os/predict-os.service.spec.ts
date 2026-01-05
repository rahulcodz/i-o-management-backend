import { Test, TestingModule } from '@nestjs/testing';
import { PredictOsService } from './predict-os.service';

describe('PredictOsService', () => {
  let service: PredictOsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PredictOsService],
    }).compile();

    service = module.get<PredictOsService>(PredictOsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
