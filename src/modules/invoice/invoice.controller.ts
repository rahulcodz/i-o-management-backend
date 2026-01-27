import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { QueryInvoiceDto } from './dto/query-invoice.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';

@ApiTags('Invoice')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('invoice')
export class InvoiceController {
    constructor(private readonly invoiceService: InvoiceService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new invoice' })
    create(@Body() createInvoiceDto: CreateInvoiceDto) {
        return this.invoiceService.create(createInvoiceDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all invoices with search, filters and pagination' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
    @ApiQuery({ name: 'search', required: false, type: String, description: 'Search by PI No' })
    @ApiQuery({ name: 'quotationId', required: false, type: Number, description: 'Filter by Quotation ID' })
    @ApiQuery({ name: 'salesBroker', required: false, type: Boolean, description: 'Filter by Sales Broker' })
    @ApiQuery({ name: 'isProformaInvoice', required: false, type: Boolean, description: 'Filter by Is Proforma Invoice' })
    @ApiQuery({ name: 'dateFrom', required: false, type: String, description: 'Filter by date from (YYYY-MM-DD)' })
    @ApiQuery({ name: 'dateTo', required: false, type: String, description: 'Filter by date to (YYYY-MM-DD)' })
    findAll(@Query() query: QueryInvoiceDto) {
        return this.invoiceService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get invoice by ID' })
    findOne(@Param('id') id: string) {
        return this.invoiceService.findOne(+id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update invoice by ID' })
    update(@Param('id') id: string, @Body() updateInvoiceDto: UpdateInvoiceDto) {
        return this.invoiceService.update(+id, updateInvoiceDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Soft delete invoice by ID' })
    remove(@Param('id') id: string) {
        return this.invoiceService.remove(+id);
    }
}
