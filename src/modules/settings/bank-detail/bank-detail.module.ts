import { Module } from '@nestjs/common';
import { BankDetailController } from './bank-detail.controller';
import { BankDetailService } from './bank-detail.service';
import { PrismaModule } from '../../../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [BankDetailController],
    providers: [BankDetailService],
    exports: [BankDetailService],
})
export class BankDetailModule { }
