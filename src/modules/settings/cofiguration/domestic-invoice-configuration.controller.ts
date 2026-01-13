import { Controller, Get, Post, Body, Put, UseGuards } from '@nestjs/common';
import { ConfigurationService } from './configuration.service';
import { CreateDomesticInvoiceConfigurationDto } from './dto/create-domestic-invoice-configuration.dto';
import { UpdateDomesticInvoiceConfigurationDto } from './dto/update-domestic-invoice-configuration.dto';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { AdminGuard } from '../../auth/admin.guard';

@ApiTags('Settings/Domestic Invoice Configuration')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('settings/domestic-invoice-configuration')
export class DomesticInvoiceConfigurationController {
    constructor(private readonly configurationService: ConfigurationService) { }

    @Post()
    @ApiOperation({ summary: 'Create domestic invoice configuration' })
    create(@Body() createConfigurationDto: CreateDomesticInvoiceConfigurationDto) {
        return this.configurationService.createDomesticInvoice(createConfigurationDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get domestic invoice configuration' })
    findOne() {
        return this.configurationService.findOneDomesticInvoice();
    }

    @Put()
    @ApiOperation({ summary: 'Update domestic invoice configuration (updates the first/only configuration)' })
    update(@Body() updateConfigurationDto: UpdateDomesticInvoiceConfigurationDto) {
        return this.configurationService.updateDomesticInvoice(null, updateConfigurationDto);
    }
}
