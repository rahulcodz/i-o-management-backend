import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { PortService } from './port.service';
import { CreatePortDto } from './dto/create-port.dto';
import { UpdatePortDto } from './dto/update-port.dto';
import { QueryPortDto } from './dto/query-port.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { AdminGuard } from '../../auth/admin.guard';

@ApiTags('Settings/Ports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('settings/ports')
export class PortController {
    constructor(private readonly portService: PortService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new port' })
    create(@Body() createPortDto: CreatePortDto) {
        return this.portService.create(createPortDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all ports with search and pagination' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
    @ApiQuery({ name: 'search', required: false, type: String, description: 'Search by country, port name, or port code' })
    findAll(@Query() query: QueryPortDto) {
        return this.portService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get port by ID' })
    findOne(@Param('id') id: string) {
        return this.portService.findOne(+id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update port by ID' })
    update(@Param('id') id: string, @Body() updatePortDto: UpdatePortDto) {
        return this.portService.update(+id, updatePortDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Soft delete port by ID' })
    remove(@Param('id') id: string) {
        return this.portService.remove(+id);
    }
}
