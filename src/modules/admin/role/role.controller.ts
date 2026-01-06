import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { QueryRoleDto } from './dto/query-role.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Admin/Roles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('admin/role') // Path 'admin/role' as requested
export class RoleController {
    constructor(private readonly roleService: RoleService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new role' })
    create(@Body() createRoleDto: CreateRoleDto) {
        return this.roleService.create(createRoleDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all roles with search and pagination' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
    @ApiQuery({ name: 'search', required: false, type: String, description: 'Search by role name' })
    findAll(@Query() query: QueryRoleDto) {
        return this.roleService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get role by ID' })
    findOne(@Param('id') id: string) {
        return this.roleService.findOne(+id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update role by ID' })
    update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
        return this.roleService.update(+id, updateRoleDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete role by ID' })
    remove(@Param('id') id: string) {
        return this.roleService.remove(+id);
    }
}
