import { Module } from '@nestjs/common';
import { COAParameterController } from './coa-parameter.controller';
import { COASettingController } from './coa-setting.controller';
import { COAParameterService } from './coa-parameter.service';
import { COASettingService } from './coa-setting.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [COAParameterController, COASettingController],
    providers: [COAParameterService, COASettingService],
    exports: [COAParameterService, COASettingService],
})
export class COASettingModule { }
