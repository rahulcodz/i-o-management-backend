import { Module } from '@nestjs/common';
import { PackageTypeController } from './package-type.controller';
import { PackageTypeService } from './package-type.service';
import { PrismaModule } from '../../../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [PackageTypeController],
    providers: [PackageTypeService],
    exports: [PackageTypeService],
})
export class PackageTypeModule { }
