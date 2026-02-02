import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { PreShipmentService } from './pre-shipment.service';
import { CreatePreShipmentDto } from './dto/create-pre-shipment.dto';
import { UpdatePreShipmentDto } from './dto/update-pre-shipment.dto';
import { QueryPreShipmentDto } from './dto/query-pre-shipment.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';

@ApiTags('Pre-Shipment')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('pre-shipment')
export class PreShipmentController {
    constructor(private readonly preShipmentService: PreShipmentService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new pre-shipment' })
    create(@Body() createPreShipmentDto: CreatePreShipmentDto) {
        return this.preShipmentService.create(createPreShipmentDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all pre-shipments with search, filters and pagination' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
    @ApiQuery({ name: 'search', required: false, type: String, description: 'Search by description, country of origin, or storage' })
    @ApiQuery({ name: 'invoiceId', required: false, type: Number, description: 'Filter by Invoice ID' })
    @ApiQuery({ name: 'documentTemplateId', required: false, type: Number, description: 'Filter by Document Template ID' })
    @ApiQuery({ name: 'productId', required: false, type: Number, description: 'Filter by Product ID' })
    @ApiQuery({ name: 'vendorId', required: false, type: Number, description: 'Filter by Vendor ID (User ID)' })
    findAll(@Query() query: QueryPreShipmentDto) {
        return this.preShipmentService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get pre-shipment by ID' })
    findOne(@Param('id') id: string) {
        return this.preShipmentService.findOne(+id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update pre-shipment by ID' })
    update(@Param('id') id: string, @Body() updatePreShipmentDto: UpdatePreShipmentDto) {
        return this.preShipmentService.update(+id, updatePreShipmentDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Soft delete pre-shipment by ID' })
    remove(@Param('id') id: string) {
        return this.preShipmentService.remove(+id);
    }
}
