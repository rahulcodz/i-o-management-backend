import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { PackagingListService } from './packaging-list.service';
import { CreatePackagingListDto } from './dto/create-packaging-list.dto';
import { UpdatePackagingListDto } from './dto/update-packaging-list.dto';
import { QueryPackagingListDto } from './dto/query-packaging-list.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';

@ApiTags('Packaging List')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('packaging-list')
export class PackagingListController {
    constructor(private readonly packagingListService: PackagingListService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new packaging list' })
    create(@Body() createPackagingListDto: CreatePackagingListDto) {
        return this.packagingListService.create(createPackagingListDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all packaging lists with search, filters and pagination' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
    @ApiQuery({ name: 'search', required: false, type: String, description: 'Search by invoice PI number' })
    @ApiQuery({ name: 'invoiceId', required: false, type: Number, description: 'Filter by Invoice ID' })
    findAll(@Query() query: QueryPackagingListDto) {
        return this.packagingListService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get packaging list by ID' })
    findOne(@Param('id') id: string) {
        return this.packagingListService.findOne(+id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update packaging list by ID' })
    update(@Param('id') id: string, @Body() updatePackagingListDto: UpdatePackagingListDto) {
        return this.packagingListService.update(+id, updatePackagingListDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Soft delete packaging list by ID' })
    remove(@Param('id') id: string) {
        return this.packagingListService.remove(+id);
    }
}
