import { Module } from '@nestjs/common';
import { PortController } from './port.controller';
import { PortService } from './port.service';
import { PrismaModule } from '../../../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [PortController],
    providers: [PortService],
    exports: [PortService],
})
export class PortModule { }
