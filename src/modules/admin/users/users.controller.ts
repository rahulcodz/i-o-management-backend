import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Admin/Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('admin/users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new user' })
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all users with search, pagination, and filters' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
    @ApiQuery({ name: 'search', required: false, type: String, description: 'Search by name or email' })
    @ApiQuery({ name: 'roleId', required: false, type: Number, description: 'Filter by role ID' })
    @ApiQuery({ name: 'createdFrom', required: false, type: String, description: 'Filter by created date from (ISO date)' })
    @ApiQuery({ name: 'createdTo', required: false, type: String, description: 'Filter by created date to (ISO date)' })
    findAll(@Query() query: QueryUserDto) {
        return this.usersService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get user by ID' })
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(+id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update user by ID' })
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(+id, updateUserDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete user by ID' })
    remove(@Param('id') id: string) {
        return this.usersService.remove(+id);
    }
}
