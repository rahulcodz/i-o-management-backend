import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { PackageTypeService } from './package-type.service';
import { CreatePackageTypeDto } from './dto/create-package-type.dto';
import { UpdatePackageTypeDto } from './dto/update-package-type.dto';
import { QueryPackageTypeDto } from './dto/query-package-type.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { AdminGuard } from '../../auth/admin.guard';

@ApiTags('Package Types')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('package-type')
export class PackageTypeController {
    constructor(private readonly packageTypeService: PackageTypeService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new package type' })
    create(@Body() createPackageTypeDto: CreatePackageTypeDto) {
        return this.packageTypeService.create(createPackageTypeDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all package types with search and pagination' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
    @ApiQuery({ name: 'search', required: false, type: String, description: 'Search by package type' })
    findAll(@Query() query: QueryPackageTypeDto) {
        return this.packageTypeService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get package type by ID' })
    findOne(@Param('id') id: string) {
        return this.packageTypeService.findOne(+id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update package type by ID' })
    update(@Param('id') id: string, @Body() updatePackageTypeDto: UpdatePackageTypeDto) {
        return this.packageTypeService.update(+id, updatePackageTypeDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Soft delete package type by ID' })
    remove(@Param('id') id: string) {
        return this.packageTypeService.remove(+id);
    }
}
