import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ShipmentTermService } from './shipment-term.service';
import { CreateShipmentTermDto } from './dto/create-shipment-term.dto';
import { UpdateShipmentTermDto } from './dto/update-shipment-term.dto';
import { QueryShipmentTermDto } from './dto/query-shipment-term.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { AdminGuard } from '../../auth/admin.guard';

@ApiTags('Settings/Shipment Terms')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('settings/shipment-terms')
export class ShipmentTermController {
    constructor(private readonly shipmentTermService: ShipmentTermService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new shipment term' })
    create(@Body() createShipmentTermDto: CreateShipmentTermDto) {
        return this.shipmentTermService.create(createShipmentTermDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all shipment terms with search and pagination' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
    @ApiQuery({ name: 'search', required: false, type: String, description: 'Search by name or term' })
    findAll(@Query() query: QueryShipmentTermDto) {
        return this.shipmentTermService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get shipment term by ID' })
    findOne(@Param('id') id: string) {
        return this.shipmentTermService.findOne(+id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update shipment term by ID' })
    update(@Param('id') id: string, @Body() updateShipmentTermDto: UpdateShipmentTermDto) {
        return this.shipmentTermService.update(+id, updateShipmentTermDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Soft delete shipment term by ID' })
    remove(@Param('id') id: string) {
        return this.shipmentTermService.remove(+id);
    }
}
