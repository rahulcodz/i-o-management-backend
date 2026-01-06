import { Module } from '@nestjs/common';
import { ShipmentTermController } from './shipment-term.controller';
import { ShipmentTermService } from './shipment-term.service';
import { PrismaModule } from '../../../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [ShipmentTermController],
    providers: [ShipmentTermService],
    exports: [ShipmentTermService],
})
export class ShipmentTermModule { }
