import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { MaterialService } from './material.service';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { QueryMaterialDto } from './dto/query-material.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { AdminGuard } from '../../auth/admin.guard';

@ApiTags('Settings/Materials')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('settings/materials')
export class MaterialController {
    constructor(private readonly materialService: MaterialService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new material' })
    create(@Body() createMaterialDto: CreateMaterialDto) {
        return this.materialService.create(createMaterialDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all materials with search and pagination' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
    @ApiQuery({ name: 'search', required: false, type: String, description: 'Search by material name' })
    findAll(@Query() query: QueryMaterialDto) {
        return this.materialService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get material by ID' })
    findOne(@Param('id') id: string) {
        return this.materialService.findOne(+id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update material by ID' })
    update(@Param('id') id: string, @Body() updateMaterialDto: UpdateMaterialDto) {
        return this.materialService.update(+id, updateMaterialDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Soft delete material by ID' })
    remove(@Param('id') id: string) {
        return this.materialService.remove(+id);
    }
}
