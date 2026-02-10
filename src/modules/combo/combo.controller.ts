import { Controller, Get, UseGuards, Request, Query } from '@nestjs/common';
import { ComboService } from './combo.service';
import { QueryRoleComboDto } from './dto/query-role-combo.dto';
import { QueryUserComboDto } from './dto/query-user-combo.dto';
import { QueryOrganizationComboDto } from './dto/query-organization-combo.dto';
import { QueryCountryComboDto } from './dto/query-country-combo.dto';
import { QueryQuotationComboDto } from './dto/query-quotation-combo.dto';
import { QueryInvoiceComboDto } from './dto/query-invoice-combo.dto';
import { QueryCustomerComboDto } from './dto/query-customer-combo.dto';
import { QueryProductComboDto } from './dto/query-product-combo.dto';
import { QueryVendorComboDto } from './dto/query-vendor-combo.dto';
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

    @Get('quotations')
    @ApiOperation({ summary: 'Get quotations combo - returns quotations with id and quotation number' })
    @ApiQuery({ name: 'search', required: false, type: String, description: 'Search quotations by quotation number' })
    getQuotationsCombo(@Query() query: QueryQuotationComboDto) {
        return this.comboService.getQuotationsCombo(query);
    }

    @Get('invoices')
    @ApiOperation({ summary: 'Get invoices combo - returns invoices with id and PI No' })
    @ApiQuery({ name: 'search', required: false, type: String, description: 'Search invoices by PI No' })
    @ApiQuery({ name: 'invoice', required: false, type: Boolean, description: 'Filter by invoice type: true for proforma invoices, false for regular invoices' })
    getInvoicesCombo(@Query() query: QueryInvoiceComboDto) {
        return this.comboService.getInvoicesCombo(query);
    }

    @Get('customers')
    @ApiOperation({ summary: 'Get customers combo - returns active customers with id and customer name' })
    @ApiQuery({ name: 'search', required: false, type: String, description: 'Search customers by customer name' })
    getCustomersCombo(@Query() query: QueryCustomerComboDto) {
        return this.comboService.getCustomersCombo(query);
    }

    @Get('products')
    @ApiOperation({ summary: 'Get products combo - returns products with id and name' })
    @ApiQuery({ name: 'search', required: false, type: String, description: 'Search products by name' })
    getProductsCombo(@Query() query: QueryProductComboDto) {
        return this.comboService.getProductsCombo(query);
    }

    @Get('vendors')
    @ApiOperation({ summary: 'Get vendors combo - returns vendors with id and name' })
    @ApiQuery({ name: 'search', required: false, type: String, description: 'Search vendors by name, category, GSTIN, or state' })
    getVendorsCombo(@Query() query: QueryVendorComboDto) {
        return this.comboService.getVendorsCombo(query);
    }
}
