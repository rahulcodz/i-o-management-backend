import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { COASettingService } from './coa-setting.service';
import { CreateCOASettingDto } from './dto/setting/create-coa-setting.dto';
import { UpdateCOASettingDto } from './dto/setting/update-coa-setting.dto';
import { QueryCOASettingDto } from './dto/setting/query-coa-setting.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';

@ApiTags('COA Setting/Setting')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('coa-setting/setting')
export class COASettingController {
    constructor(private readonly coaSettingService: COASettingService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new COA setting' })
    create(@Body() createCOASettingDto: CreateCOASettingDto) {
        return this.coaSettingService.create(createCOASettingDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all COA settings with filters and pagination' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
    @ApiQuery({ name: 'productId', required: false, type: Number, description: 'Filter by Product ID' })
    findAll(@Query() query: QueryCOASettingDto) {
        return this.coaSettingService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get COA setting by ID' })
    findOne(@Param('id') id: string) {
        return this.coaSettingService.findOne(+id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update COA setting by ID' })
    update(@Param('id') id: string, @Body() updateCOASettingDto: UpdateCOASettingDto) {
        return this.coaSettingService.update(+id, updateCOASettingDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Soft delete COA setting by ID' })
    remove(@Param('id') id: string) {
        return this.coaSettingService.remove(+id);
    }
}
