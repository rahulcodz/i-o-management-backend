import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { QuotationService } from './quotation.service';
import { CreateQuotationDto } from './dto/create-quotation.dto';
import { UpdateQuotationDto } from './dto/update-quotation.dto';
import { QueryQuotationDto } from './dto/query-quotation.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';

@ApiTags('Quotations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('quotations')
export class QuotationController {
    constructor(private readonly quotationService: QuotationService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new quotation' })
    create(@Body() createQuotationDto: CreateQuotationDto) {
        return this.quotationService.create(createQuotationDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all quotations with search and pagination' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
    @ApiQuery({ name: 'search', required: false, type: String, description: 'Search by quotation number' })
    findAll(@Query() query: QueryQuotationDto) {
        return this.quotationService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get quotation by ID' })
    findOne(@Param('id') id: string) {
        return this.quotationService.findOne(+id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update quotation by ID' })
    update(@Param('id') id: string, @Body() updateQuotationDto: UpdateQuotationDto) {
        return this.quotationService.update(+id, updateQuotationDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Soft delete quotation by ID' })
    remove(@Param('id') id: string) {
        return this.quotationService.remove(+id);
    }
}
