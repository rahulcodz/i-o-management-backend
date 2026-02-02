import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ProductLabelParameterService } from './product-label-parameter.service';
import { CreateProductLabelParameterDto } from './dto/create-product-label-parameter.dto';
import { UpdateProductLabelParameterDto } from './dto/update-product-label-parameter.dto';
import { QueryProductLabelParameterDto } from './dto/query-product-label-parameter.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';

@ApiTags('Product Label Parameter')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('product-label-parameter')
export class ProductLabelParameterController {
    constructor(private readonly productLabelParameterService: ProductLabelParameterService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new product label parameter' })
    create(@Body() createProductLabelParameterDto: CreateProductLabelParameterDto) {
        return this.productLabelParameterService.create(createProductLabelParameterDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all product label parameters with search and pagination' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
    @ApiQuery({ name: 'search', required: false, type: String, description: 'Search by parameter name' })
    findAll(@Query() query: QueryProductLabelParameterDto) {
        return this.productLabelParameterService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get product label parameter by ID' })
    findOne(@Param('id') id: string) {
        return this.productLabelParameterService.findOne(+id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update product label parameter by ID' })
    update(@Param('id') id: string, @Body() updateProductLabelParameterDto: UpdateProductLabelParameterDto) {
        return this.productLabelParameterService.update(+id, updateProductLabelParameterDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Soft delete product label parameter by ID' })
    remove(@Param('id') id: string) {
        return this.productLabelParameterService.remove(+id);
    }
}
