import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { PaymentTermService } from './payment-term.service';
import { CreatePaymentTermDto } from './dto/create-payment-term.dto';
import { UpdatePaymentTermDto } from './dto/update-payment-term.dto';
import { QueryPaymentTermDto } from './dto/query-payment-term.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { AdminGuard } from '../../auth/admin.guard';

@ApiTags('Settings/Payment Terms')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('settings/payment-terms')
export class PaymentTermController {
    constructor(private readonly paymentTermService: PaymentTermService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new payment term' })
    create(@Body() createPaymentTermDto: CreatePaymentTermDto) {
        return this.paymentTermService.create(createPaymentTermDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all payment terms with search and pagination' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
    @ApiQuery({ name: 'search', required: false, type: String, description: 'Search by name or term' })
    findAll(@Query() query: QueryPaymentTermDto) {
        return this.paymentTermService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get payment term by ID' })
    findOne(@Param('id') id: string) {
        return this.paymentTermService.findOne(+id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update payment term by ID' })
    update(@Param('id') id: string, @Body() updatePaymentTermDto: UpdatePaymentTermDto) {
        return this.paymentTermService.update(+id, updatePaymentTermDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Soft delete payment term by ID' })
    remove(@Param('id') id: string) {
        return this.paymentTermService.remove(+id);
    }
}
