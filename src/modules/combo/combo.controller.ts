import { Controller, Get, UseGuards, Request, Query } from '@nestjs/common';
import { ComboService } from './combo.service';
import { QueryRoleComboDto } from './dto/query-role-combo.dto';
import { QueryUserComboDto } from './dto/query-user-combo.dto';
import { QueryOrganizationComboDto } from './dto/query-organization-combo.dto';
import { QueryCountryComboDto } from './dto/query-country-combo.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Combo')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('combo')
export class ComboController {
    constructor(private readonly comboService: ComboService) { }

    @Get('users')
    @ApiOperation({ summary: 'Get users combo - returns users in same organization' })
    @ApiQuery({ name: 'search', required: false, type: String, description: 'Search users by name' })
    getUsersCombo(@Request() req, @Query() query: QueryUserComboDto) {
        return this.comboService.getUsersCombo(req.user, query);
    }

    @Get('roles')
    @ApiOperation({ summary: 'Get roles combo - returns available roles with roleId and roleName' })
    @ApiQuery({ name: 'search', required: false, type: String, description: 'Search roles by name' })
    getRolesCombo(@Query() query: QueryRoleComboDto) {
        return this.comboService.getRolesCombo(query);
    }

    @Get('organizations')
    @ApiOperation({ summary: 'Get organizations combo - returns organizations (Super Admin sees all, others see only their organization)' })
    @ApiQuery({ name: 'search', required: false, type: String, description: 'Search organizations by name' })
    getOrganizationsCombo(@Request() req, @Query() query: QueryOrganizationComboDto) {
        return this.comboService.getOrganizationsCombo(req.user, query);
    }

    @Get('countries')
    @ApiOperation({ summary: 'Get countries combo - returns list of all countries' })
    @ApiQuery({ name: 'search', required: false, type: String, description: 'Search countries by name or ID' })
    getCountriesCombo(@Query() query: QueryCountryComboDto) {
        return this.comboService.getCountriesCombo(query);
    }
}
