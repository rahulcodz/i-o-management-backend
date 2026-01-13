import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ProformaInvoiceService } from './proforma-invoice.service';
import { CreateProformaInvoiceDto } from './dto/create-proforma-invoice.dto';
import { UpdateProformaInvoiceDto } from './dto/update-proforma-invoice.dto';
import { QueryProformaInvoiceDto } from './dto/query-proforma-invoice.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';

@ApiTags('Proforma Invoice')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('proforma-invoice')
export class ProformaInvoiceController {
    constructor(private readonly proformaInvoiceService: ProformaInvoiceService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new proforma invoice' })
    create(@Body() createProformaInvoiceDto: CreateProformaInvoiceDto) {
        return this.proformaInvoiceService.create(createProformaInvoiceDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all proforma invoices with search, filters and pagination' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
    @ApiQuery({ name: 'search', required: false, type: String, description: 'Search by PI No' })
    @ApiQuery({ name: 'quotationId', required: false, type: Number, description: 'Filter by Quotation ID' })
    @ApiQuery({ name: 'salesBroker', required: false, type: Boolean, description: 'Filter by Sales Broker' })
    @ApiQuery({ name: 'dateFrom', required: false, type: String, description: 'Filter by date from (YYYY-MM-DD)' })
    @ApiQuery({ name: 'dateTo', required: false, type: String, description: 'Filter by date to (YYYY-MM-DD)' })
    findAll(@Query() query: QueryProformaInvoiceDto) {
        return this.proformaInvoiceService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get proforma invoice by ID' })
    findOne(@Param('id') id: string) {
        return this.proformaInvoiceService.findOne(+id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update proforma invoice by ID' })
    update(@Param('id') id: string, @Body() updateProformaInvoiceDto: UpdateProformaInvoiceDto) {
        return this.proformaInvoiceService.update(+id, updateProformaInvoiceDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Soft delete proforma invoice by ID' })
    remove(@Param('id') id: string) {
        return this.proformaInvoiceService.remove(+id);
    }
}
