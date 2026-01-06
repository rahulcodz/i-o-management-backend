import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Query, Request } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { QueryCustomerDto } from './dto/query-customer.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { AdminGuard } from '../../auth/admin.guard';

@ApiTags('Settings/Customers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('settings/customers')
export class CustomersController {
    constructor(private readonly customersService: CustomersService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new customer' })
    create(@Body() createCustomerDto: CreateCustomerDto, @Request() req) {
        return this.customersService.create(createCustomerDto, req.user);
    }

    @Get()
    @ApiOperation({ summary: 'Get all customers with search and pagination' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
    @ApiQuery({ name: 'search', required: false, type: String, description: 'Search by customer name, email, or company' })
    findAll(@Query() query: QueryCustomerDto, @Request() req) {
        return this.customersService.findAll(query, req.user);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get customer by ID' })
    findOne(@Param('id') id: string, @Request() req) {
        return this.customersService.findOne(+id, req.user);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update customer by ID' })
    update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto, @Request() req) {
        return this.customersService.update(+id, updateCustomerDto, req.user);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Soft delete customer by ID' })
    remove(@Param('id') id: string, @Request() req) {
        return this.customersService.remove(+id, req.user);
    }
}
