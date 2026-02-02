import { Module } from '@nestjs/common';
import { PreShipmentController } from './pre-shipment.controller';
import { PreShipmentService } from './pre-shipment.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [PreShipmentController],
    providers: [PreShipmentService],
    exports: [PreShipmentService],
})
export class PreShipmentModule { }
