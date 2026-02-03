import { Module } from '@nestjs/common';
import { PackagingListController } from './packaging-list.controller';
import { PackagingListService } from './packaging-list.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [PackagingListController],
    providers: [PackagingListService],
    exports: [PackagingListService],
})
export class PackagingListModule { }
