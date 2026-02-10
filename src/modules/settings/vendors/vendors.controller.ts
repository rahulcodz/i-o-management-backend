import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { VendorsService } from './vendors.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { QueryVendorDto } from './dto/query-vendor.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { AdminGuard } from '../../auth/admin.guard';

@ApiTags('Settings/Vendors')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('settings/vendors')
export class VendorsController {
    constructor(private readonly vendorsService: VendorsService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new vendor' })
    create(@Body() createVendorDto: CreateVendorDto) {
        return this.vendorsService.create(createVendorDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all vendors with search and pagination' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
    @ApiQuery({ name: 'search', required: false, type: String, description: 'Search by category, name, GSTIN, state, or email' })
    findAll(@Query() query: QueryVendorDto) {
        return this.vendorsService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get vendor by ID' })
    findOne(@Param('id') id: string) {
        return this.vendorsService.findOne(+id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update vendor by ID' })
    update(@Param('id') id: string, @Body() updateVendorDto: UpdateVendorDto) {
        return this.vendorsService.update(+id, updateVendorDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Soft delete vendor by ID' })
    remove(@Param('id') id: string) {
        return this.vendorsService.remove(+id);
    }
}
