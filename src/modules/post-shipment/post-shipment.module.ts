import { Module } from '@nestjs/common';
import { PostShipmentController } from './post-shipment.controller';
import { PostShipmentService } from './post-shipment.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [PostShipmentController],
    providers: [PostShipmentService],
    exports: [PostShipmentService],
})
export class PostShipmentModule { }
