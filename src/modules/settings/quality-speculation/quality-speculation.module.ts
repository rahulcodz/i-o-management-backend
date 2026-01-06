import { Module } from '@nestjs/common';
import { QualitySpeculationController } from './quality-speculation.controller';
import { QualitySpeculationService } from './quality-speculation.service';
import { PrismaModule } from '../../../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [QualitySpeculationController],
    providers: [QualitySpeculationService],
    exports: [QualitySpeculationService],
})
export class QualitySpeculationModule { }
