import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { QueryOrganizationDto } from './dto/query-organization.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { SuperAdminGuard } from '../../auth/super-admin.guard';

@ApiTags('Admin/Organizations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, SuperAdminGuard)
@Controller('admin/organizations')
export class OrganizationController {
    constructor(private readonly organizationService: OrganizationService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new organization (Super Admin only)' })
    create(@Body() createOrganizationDto: CreateOrganizationDto) {
        return this.organizationService.create(createOrganizationDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all organizations with search and pagination (Super Admin only)' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
    @ApiQuery({ name: 'search', required: false, type: String, description: 'Search by organization name, email, or phone' })
    findAll(@Query() query: QueryOrganizationDto) {
        return this.organizationService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get organization by ID (Super Admin only)' })
    findOne(@Param('id') id: string) {
        return this.organizationService.findOne(+id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update organization by ID (Super Admin only)' })
    update(@Param('id') id: string, @Body() updateOrganizationDto: UpdateOrganizationDto) {
        return this.organizationService.update(+id, updateOrganizationDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete organization by ID (Super Admin only)' })
    remove(@Param('id') id: string) {
        return this.organizationService.remove(+id);
    }
}
