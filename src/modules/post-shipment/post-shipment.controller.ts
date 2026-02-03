import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { PostShipmentService } from './post-shipment.service';
import { CreatePostShipmentDto } from './dto/create-post-shipment.dto';
import { UpdatePostShipmentDto } from './dto/update-post-shipment.dto';
import { QueryPostShipmentDto } from './dto/query-post-shipment.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';

@ApiTags('Post-Shipment')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('post-shipment')
export class PostShipmentController {
    constructor(private readonly postShipmentService: PostShipmentService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new post-shipment' })
    create(@Body() createPostShipmentDto: CreatePostShipmentDto) {
        return this.postShipmentService.create(createPostShipmentDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all post-shipments with search, filters and pagination' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
    @ApiQuery({ name: 'search', required: false, type: String, description: 'Search by invoice PI number, grade, or raw material' })
    @ApiQuery({ name: 'invoiceId', required: false, type: Number, description: 'Filter by Invoice ID' })
    @ApiQuery({ name: 'productId', required: false, type: Number, description: 'Filter by Product ID' })
    findAll(@Query() query: QueryPostShipmentDto) {
        return this.postShipmentService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get post-shipment by ID' })
    findOne(@Param('id') id: string) {
        return this.postShipmentService.findOne(+id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update post-shipment by ID' })
    update(@Param('id') id: string, @Body() updatePostShipmentDto: UpdatePostShipmentDto) {
        return this.postShipmentService.update(+id, updatePostShipmentDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Soft delete post-shipment by ID' })
    remove(@Param('id') id: string) {
        return this.postShipmentService.remove(+id);
    }
}
