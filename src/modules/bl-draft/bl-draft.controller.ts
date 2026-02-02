import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { BLDraftService } from './bl-draft.service';
import { CreateBLDraftDto } from './dto/create-bl-draft.dto';
import { UpdateBLDraftDto } from './dto/update-bl-draft.dto';
import { QueryBLDraftDto } from './dto/query-bl-draft.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';

@ApiTags('BL Draft')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('bl-draft')
export class BLDraftController {
    constructor(private readonly blDraftService: BLDraftService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new BL draft' })
    create(@Body() createBLDraftDto: CreateBLDraftDto) {
        return this.blDraftService.create(createBLDraftDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all BL drafts with search, filters and pagination' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
    @ApiQuery({ name: 'search', required: false, type: String, description: 'Search by shipping line, booking number, or vessel number' })
    @ApiQuery({ name: 'invoiceId', required: false, type: Number, description: 'Filter by Invoice ID' })
    @ApiQuery({ name: 'consigneeId', required: false, type: Number, description: 'Filter by Consignee ID (Customer ID)' })
    @ApiQuery({ name: 'notifyBuyerId', required: false, type: Number, description: 'Filter by Notify Buyer ID (Customer ID)' })
    @ApiQuery({ name: 'notifyOtherPartyId', required: false, type: Number, description: 'Filter by Notify Other Party ID (Customer ID)' })
    findAll(@Query() query: QueryBLDraftDto) {
        return this.blDraftService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get BL draft by ID' })
    findOne(@Param('id') id: string) {
        return this.blDraftService.findOne(+id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update BL draft by ID' })
    update(@Param('id') id: string, @Body() updateBLDraftDto: UpdateBLDraftDto) {
        return this.blDraftService.update(+id, updateBLDraftDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Soft delete BL draft by ID' })
    remove(@Param('id') id: string) {
        return this.blDraftService.remove(+id);
    }
}
