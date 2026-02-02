import { Module } from '@nestjs/common';
import { DocumentTemplateController } from './document-template.controller';
import { DocumentTemplateService } from './document-template.service';
import { PrismaModule } from '../../../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [DocumentTemplateController],
    providers: [DocumentTemplateService],
    exports: [DocumentTemplateService],
})
export class DocumentTemplateModule { }
