import { Module } from '@nestjs/common';
import { ProductLabelParameterController } from './product-label-parameter.controller';
import { ProductLabelParameterService } from './product-label-parameter.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [ProductLabelParameterController],
    providers: [ProductLabelParameterService],
    exports: [ProductLabelParameterService],
})
export class ProductLabelParameterModule { }
