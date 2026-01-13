import { Controller, Get, Post, Body, Put, UseGuards } from '@nestjs/common';
import { ConfigurationService } from './configuration.service';
import { CreateInternationalInvoiceConfigurationDto } from './dto/create-international-invoice-configuration.dto';
import { UpdateInternationalInvoiceConfigurationDto } from './dto/update-international-invoice-configuration.dto';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { AdminGuard } from '../../auth/admin.guard';

@ApiTags('Settings/International Invoice Configuration')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('settings/international-invoice-configuration')
export class ConfigurationController {
    constructor(private readonly configurationService: ConfigurationService) { }

    @Post()
    @ApiOperation({ summary: 'Create international invoice configuration' })
    create(@Body() createConfigurationDto: CreateInternationalInvoiceConfigurationDto) {
        return this.configurationService.create(createConfigurationDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get international invoice configuration' })
    findOne() {
        return this.configurationService.findOne();
    }

    @Put()
    @ApiOperation({ summary: 'Update international invoice configuration (updates the first/only configuration)' })
    update(@Body() updateConfigurationDto: UpdateInternationalInvoiceConfigurationDto) {
        return this.configurationService.update(null, updateConfigurationDto);
    }
}
