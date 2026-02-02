import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { COAParameterService } from './coa-parameter.service';
import { CreateCOAParameterDto } from './dto/parameter/create-coa-parameter.dto';
import { UpdateCOAParameterDto } from './dto/parameter/update-coa-parameter.dto';
import { QueryCOAParameterDto } from './dto/parameter/query-coa-parameter.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';

@ApiTags('COA Setting/Parameter')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('coa-setting/parameter')
export class COAParameterController {
    constructor(private readonly coaParameterService: COAParameterService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new COA parameter' })
    create(@Body() createCOAParameterDto: CreateCOAParameterDto) {
        return this.coaParameterService.create(createCOAParameterDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all COA parameters with search and pagination' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
    @ApiQuery({ name: 'search', required: false, type: String, description: 'Search by parameter name' })
    findAll(@Query() query: QueryCOAParameterDto) {
        return this.coaParameterService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get COA parameter by ID' })
    findOne(@Param('id') id: string) {
        return this.coaParameterService.findOne(+id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update COA parameter by ID' })
    update(@Param('id') id: string, @Body() updateCOAParameterDto: UpdateCOAParameterDto) {
        return this.coaParameterService.update(+id, updateCOAParameterDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Soft delete COA parameter by ID' })
    remove(@Param('id') id: string) {
        return this.coaParameterService.remove(+id);
    }
}
