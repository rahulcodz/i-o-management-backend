import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { BankDetailService } from './bank-detail.service';
import { CreateBankDetailDto } from './dto/create-bank-detail.dto';
import { UpdateBankDetailDto } from './dto/update-bank-detail.dto';
import { QueryBankDetailDto } from './dto/query-bank-detail.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { AdminGuard } from '../../auth/admin.guard';

@ApiTags('Settings/Bank Details')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('settings/bank-details')
export class BankDetailController {
    constructor(private readonly bankDetailService: BankDetailService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new bank detail' })
    create(@Body() createBankDetailDto: CreateBankDetailDto) {
        return this.bankDetailService.create(createBankDetailDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all bank details with search and pagination' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
    @ApiQuery({ name: 'search', required: false, type: String, description: 'Search by bank name, account number, beneficiary name, or swift code' })
    findAll(@Query() query: QueryBankDetailDto) {
        return this.bankDetailService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get bank detail by ID' })
    findOne(@Param('id') id: string) {
        return this.bankDetailService.findOne(+id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update bank detail by ID' })
    update(@Param('id') id: string, @Body() updateBankDetailDto: UpdateBankDetailDto) {
        return this.bankDetailService.update(+id, updateBankDetailDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Soft delete bank detail by ID' })
    remove(@Param('id') id: string) {
        return this.bankDetailService.remove(+id);
    }
}
