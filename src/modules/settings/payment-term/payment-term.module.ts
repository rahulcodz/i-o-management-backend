import { Module } from '@nestjs/common';
import { PaymentTermController } from './payment-term.controller';
import { PaymentTermService } from './payment-term.service';
import { PrismaModule } from '../../../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [PaymentTermController],
    providers: [PaymentTermService],
    exports: [PaymentTermService],
})
export class PaymentTermModule { }
