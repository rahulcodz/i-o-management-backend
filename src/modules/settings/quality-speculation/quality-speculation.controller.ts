import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { QualitySpeculationService } from './quality-speculation.service';
import { CreateQualitySpeculationDto } from './dto/create-quality-speculation.dto';
import { UpdateQualitySpeculationDto } from './dto/update-quality-speculation.dto';
import { QueryQualitySpeculationDto } from './dto/query-quality-speculation.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { AdminGuard } from '../../auth/admin.guard';

@ApiTags('Settings/Quality Speculations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('settings/quality-speculations')
export class QualitySpeculationController {
    constructor(private readonly qualitySpeculationService: QualitySpeculationService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new quality speculation' })
    create(@Body() createQualitySpeculationDto: CreateQualitySpeculationDto) {
        return this.qualitySpeculationService.create(createQualitySpeculationDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all quality speculations with search and pagination' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
    @ApiQuery({ name: 'search', required: false, type: String, description: 'Search by name or specification content' })
    findAll(@Query() query: QueryQualitySpeculationDto) {
        return this.qualitySpeculationService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get quality speculation by ID' })
    findOne(@Param('id') id: string) {
        return this.qualitySpeculationService.findOne(+id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update quality speculation by ID' })
    update(@Param('id') id: string, @Body() updateQualitySpeculationDto: UpdateQualitySpeculationDto) {
        return this.qualitySpeculationService.update(+id, updateQualitySpeculationDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Soft delete quality speculation by ID' })
    remove(@Param('id') id: string) {
        return this.qualitySpeculationService.remove(+id);
    }
}
