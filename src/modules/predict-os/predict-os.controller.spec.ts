import { Test, TestingModule } from '@nestjs/testing';
import { PredictOsController } from './predict-os.controller';

describe('PredictOsController', () => {
  let controller: PredictOsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PredictOsController],
    }).compile();

    controller = module.get<PredictOsController>(PredictOsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
