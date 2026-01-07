import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { PackageService } from './package.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { QueryPackageDto } from './dto/query-package.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { AdminGuard } from '../../auth/admin.guard';

@ApiTags('Settings/Packages')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('settings/packages')
export class PackageController {
    constructor(private readonly packageService: PackageService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new package' })
    create(@Body() createPackageDto: CreatePackageDto) {
        return this.packageService.create(createPackageDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all packages with search and pagination' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
    @ApiQuery({ name: 'search', required: false, type: String, description: 'Search by unit order unit' })
    findAll(@Query() query: QueryPackageDto) {
        return this.packageService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get package by ID' })
    findOne(@Param('id') id: string) {
        return this.packageService.findOne(+id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update package by ID' })
    update(@Param('id') id: string, @Body() updatePackageDto: UpdatePackageDto) {
        return this.packageService.update(+id, updatePackageDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Soft delete package by ID' })
    remove(@Param('id') id: string) {
        return this.packageService.remove(+id);
    }
}
