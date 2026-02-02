import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { DocumentTemplateService } from './document-template.service';
import { CreateDocumentTemplateDto } from './dto/create-document-template.dto';
import { UpdateDocumentTemplateDto } from './dto/update-document-template.dto';
import { QueryDocumentTemplateDto } from './dto/query-document-template.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { AdminGuard } from '../../auth/admin.guard';

@ApiTags('Settings/Document Templates')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('settings/document-templates')
export class DocumentTemplateController {
    constructor(private readonly documentTemplateService: DocumentTemplateService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new document template' })
    create(@Body() createDocumentTemplateDto: CreateDocumentTemplateDto) {
        return this.documentTemplateService.create(createDocumentTemplateDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all document templates with search, filters and pagination' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
    @ApiQuery({ name: 'search', required: false, type: String, description: 'Search by document name' })
    @ApiQuery({ name: 'userId', required: false, type: Number, description: 'Filter by User ID' })
    findAll(@Query() query: QueryDocumentTemplateDto) {
        return this.documentTemplateService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get document template by ID' })
    findOne(@Param('id') id: string) {
        return this.documentTemplateService.findOne(+id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update document template by ID' })
    update(@Param('id') id: string, @Body() updateDocumentTemplateDto: UpdateDocumentTemplateDto) {
        return this.documentTemplateService.update(+id, updateDocumentTemplateDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Soft delete document template by ID' })
    remove(@Param('id') id: string) {
        return this.documentTemplateService.remove(+id);
    }
}
