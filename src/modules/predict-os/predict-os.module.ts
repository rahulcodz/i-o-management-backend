import { Module } from '@nestjs/common';
import { PredictOsController } from './predict-os.controller';
import { PredictOsService } from './predict-os.service';

@Module({
  controllers: [PredictOsController],
  providers: [PredictOsService]
})
export class PredictOsModule {}
