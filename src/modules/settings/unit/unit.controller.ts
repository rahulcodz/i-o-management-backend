import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { UnitService } from './unit.service';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { QueryUnitDto } from './dto/query-unit.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { AdminGuard } from '../../auth/admin.guard';

@ApiTags('Settings/Units')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('settings/units')
export class UnitController {
    constructor(private readonly unitService: UnitService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new unit' })
    create(@Body() createUnitDto: CreateUnitDto) {
        return this.unitService.create(createUnitDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all units with search and pagination' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
    @ApiQuery({ name: 'search', required: false, type: String, description: 'Search by order unit' })
    findAll(@Query() query: QueryUnitDto) {
        return this.unitService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get unit by ID' })
    findOne(@Param('id') id: string) {
        return this.unitService.findOne(+id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update unit by ID' })
    update(@Param('id') id: string, @Body() updateUnitDto: UpdateUnitDto) {
        return this.unitService.update(+id, updateUnitDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Soft delete unit by ID' })
    remove(@Param('id') id: string) {
        return this.unitService.remove(+id);
    }
}
