import { Module } from '@nestjs/common';
import { BLDraftController } from './bl-draft.controller';
import { BLDraftService } from './bl-draft.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [BLDraftController],
    providers: [BLDraftService],
    exports: [BLDraftService],
})
export class BLDraftModule { }
