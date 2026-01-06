import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';
import { QueryCurrencyDto } from './dto/query-currency.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { AdminGuard } from '../../auth/admin.guard';

@ApiTags('Settings/Currencies')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('settings/currencies')
export class CurrencyController {
    constructor(private readonly currencyService: CurrencyService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new currency' })
    create(@Body() createCurrencyDto: CreateCurrencyDto) {
        return this.currencyService.create(createCurrencyDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all currencies with search and pagination' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
    @ApiQuery({ name: 'search', required: false, type: String, description: 'Search by currency name, symbol, or words' })
    findAll(@Query() query: QueryCurrencyDto) {
        return this.currencyService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get currency by ID' })
    findOne(@Param('id') id: string) {
        return this.currencyService.findOne(+id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update currency by ID' })
    update(@Param('id') id: string, @Body() updateCurrencyDto: UpdateCurrencyDto) {
        return this.currencyService.update(+id, updateCurrencyDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Soft delete currency by ID' })
    remove(@Param('id') id: string) {
        return this.currencyService.remove(+id);
    }
}
