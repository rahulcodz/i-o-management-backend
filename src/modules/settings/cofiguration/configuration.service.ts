import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateInternationalInvoiceConfigurationDto } from './dto/create-international-invoice-configuration.dto';
import { UpdateInternationalInvoiceConfigurationDto } from './dto/update-international-invoice-configuration.dto';
import { CreateDomesticInvoiceConfigurationDto } from './dto/create-domestic-invoice-configuration.dto';
import { UpdateDomesticInvoiceConfigurationDto } from './dto/update-domestic-invoice-configuration.dto';

@Injectable()
export class ConfigurationService {
    constructor(private prisma: PrismaService) { }

    async create(createConfigurationDto: CreateInternationalInvoiceConfigurationDto) {
        // Check if a configuration already exists
        const existing = await this.prisma.internationalInvoiceConfiguration.findFirst({
            where: { deletedAt: null },
        });

        if (existing) {
            throw new BadRequestException('International invoice configuration already exists. Use update endpoint to modify it.');
        }

        return this.prisma.internationalInvoiceConfiguration.create({
            data: {
                pinCode: createConfigurationDto.pinCode,
                declarationExport: createConfigurationDto.declarationExport,
                declarationDomestic: createConfigurationDto.declarationDomestic,
                invoiceSeriesSettingBasedOn: createConfigurationDto.invoiceSeriesSettingBasedOn || 'General Setting For All Invoice',
                piSeriesSettingBasedOn: createConfigurationDto.piSeriesSettingBasedOn || 'General Setting For All PI',
                invoicePrefix: createConfigurationDto.invoicePrefix,
                invoiceStartFrom: createConfigurationDto.invoiceStartFrom ?? 0,
                invoiceSuffix: createConfigurationDto.invoiceSuffix,
                piPrefix: createConfigurationDto.piPrefix,
                piStartFrom: createConfigurationDto.piStartFrom ?? 0,
                piSuffix: createConfigurationDto.piSuffix,
                quotationPrefix: createConfigurationDto.quotationPrefix,
                quotationStartFrom: createConfigurationDto.quotationStartFrom ?? 0,
                quotationSuffix: createConfigurationDto.quotationSuffix,
                poPrefix: createConfigurationDto.poPrefix,
                poStartFrom: createConfigurationDto.poStartFrom ?? 0,
                poSuffix: createConfigurationDto.poSuffix,
                servicePoPrefix: createConfigurationDto.servicePoPrefix,
                servicePoStartFrom: createConfigurationDto.servicePoStartFrom ?? 0,
                servicePoSuffix: createConfigurationDto.servicePoSuffix,
                piInvoiceNoEditing: createConfigurationDto.piInvoiceNoEditing ?? true,
            },
        });
    }

    async findOne() {
        const configuration = await this.prisma.internationalInvoiceConfiguration.findFirst({
            where: {
                deletedAt: null, // Only get non-deleted configuration
            },
            orderBy: {
                createdAt: 'desc', // Get the most recent one
            },
        });

        if (!configuration) {
            throw new NotFoundException('International invoice configuration not found');
        }

        return configuration;
    }

    async update(id: number | null, updateConfigurationDto: UpdateInternationalInvoiceConfigurationDto) {
        // If no ID provided, find the first configuration
        let existingConfiguration;
        
        if (id) {
            existingConfiguration = await this.prisma.internationalInvoiceConfiguration.findFirst({
                where: {
                    id,
                    deletedAt: null,
                },
            });
        } else {
            existingConfiguration = await this.prisma.internationalInvoiceConfiguration.findFirst({
                where: {
                    deletedAt: null,
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });
        }

        if (!existingConfiguration) {
            throw new NotFoundException('International invoice configuration not found');
        }

        const configurationId = existingConfiguration.id;

        // Prepare update data, only including fields that are provided
        const updateData: any = {};

        if (updateConfigurationDto.pinCode !== undefined) {
            updateData.pinCode = updateConfigurationDto.pinCode;
        }

        if (updateConfigurationDto.declarationExport !== undefined) {
            updateData.declarationExport = updateConfigurationDto.declarationExport;
        }

        if (updateConfigurationDto.declarationDomestic !== undefined) {
            updateData.declarationDomestic = updateConfigurationDto.declarationDomestic;
        }

        if (updateConfigurationDto.invoiceSeriesSettingBasedOn !== undefined) {
            updateData.invoiceSeriesSettingBasedOn = updateConfigurationDto.invoiceSeriesSettingBasedOn;
        }

        if (updateConfigurationDto.piSeriesSettingBasedOn !== undefined) {
            updateData.piSeriesSettingBasedOn = updateConfigurationDto.piSeriesSettingBasedOn;
        }

        if (updateConfigurationDto.invoicePrefix !== undefined) {
            updateData.invoicePrefix = updateConfigurationDto.invoicePrefix;
        }

        if (updateConfigurationDto.invoiceStartFrom !== undefined) {
            updateData.invoiceStartFrom = updateConfigurationDto.invoiceStartFrom;
        }

        if (updateConfigurationDto.invoiceSuffix !== undefined) {
            updateData.invoiceSuffix = updateConfigurationDto.invoiceSuffix;
        }

        if (updateConfigurationDto.piPrefix !== undefined) {
            updateData.piPrefix = updateConfigurationDto.piPrefix;
        }

        if (updateConfigurationDto.piStartFrom !== undefined) {
            updateData.piStartFrom = updateConfigurationDto.piStartFrom;
        }

        if (updateConfigurationDto.piSuffix !== undefined) {
            updateData.piSuffix = updateConfigurationDto.piSuffix;
        }

        if (updateConfigurationDto.quotationPrefix !== undefined) {
            updateData.quotationPrefix = updateConfigurationDto.quotationPrefix;
        }

        if (updateConfigurationDto.quotationStartFrom !== undefined) {
            updateData.quotationStartFrom = updateConfigurationDto.quotationStartFrom;
        }

        if (updateConfigurationDto.quotationSuffix !== undefined) {
            updateData.quotationSuffix = updateConfigurationDto.quotationSuffix;
        }

        if (updateConfigurationDto.poPrefix !== undefined) {
            updateData.poPrefix = updateConfigurationDto.poPrefix;
        }

        if (updateConfigurationDto.poStartFrom !== undefined) {
            updateData.poStartFrom = updateConfigurationDto.poStartFrom;
        }

        if (updateConfigurationDto.poSuffix !== undefined) {
            updateData.poSuffix = updateConfigurationDto.poSuffix;
        }

        if (updateConfigurationDto.servicePoPrefix !== undefined) {
            updateData.servicePoPrefix = updateConfigurationDto.servicePoPrefix;
        }

        if (updateConfigurationDto.servicePoStartFrom !== undefined) {
            updateData.servicePoStartFrom = updateConfigurationDto.servicePoStartFrom;
        }

        if (updateConfigurationDto.servicePoSuffix !== undefined) {
            updateData.servicePoSuffix = updateConfigurationDto.servicePoSuffix;
        }

        if (updateConfigurationDto.piInvoiceNoEditing !== undefined) {
            updateData.piInvoiceNoEditing = updateConfigurationDto.piInvoiceNoEditing;
        }

        return this.prisma.internationalInvoiceConfiguration.update({
            where: { id: configurationId },
            data: updateData,
        });
    }

    async createDomesticInvoice(createConfigurationDto: CreateDomesticInvoiceConfigurationDto) {
        // Check if a configuration already exists
        const existing = await this.prisma.domesticInvoiceConfiguration.findFirst({
            where: { deletedAt: null },
        });

        if (existing) {
            throw new BadRequestException('Domestic invoice configuration already exists. Use update endpoint to modify it.');
        }

        return this.prisma.domesticInvoiceConfiguration.create({
            data: {
                domesticInvoicePrefix: createConfigurationDto.domesticInvoicePrefix,
                domesticInvoiceStartFrom: createConfigurationDto.domesticInvoiceStartFrom ?? 0,
                domesticInvoiceSuffix: createConfigurationDto.domesticInvoiceSuffix,
                domesticPiPrefix: createConfigurationDto.domesticPiPrefix,
                domesticPiStartFrom: createConfigurationDto.domesticPiStartFrom ?? 0,
                domesticPiSuffix: createConfigurationDto.domesticPiSuffix,
            },
        });
    }

    async findOneDomesticInvoice() {
        const configuration = await this.prisma.domesticInvoiceConfiguration.findFirst({
            where: {
                deletedAt: null, // Only get non-deleted configuration
            },
            orderBy: {
                createdAt: 'desc', // Get the most recent one
            },
        });

        if (!configuration) {
            throw new NotFoundException('Domestic invoice configuration not found');
        }

        return configuration;
    }

    async updateDomesticInvoice(id: number | null, updateConfigurationDto: UpdateDomesticInvoiceConfigurationDto) {
        // If no ID provided, find the first configuration
        let existingConfiguration;
        
        if (id) {
            existingConfiguration = await this.prisma.domesticInvoiceConfiguration.findFirst({
                where: {
                    id,
                    deletedAt: null,
                },
            });
        } else {
            existingConfiguration = await this.prisma.domesticInvoiceConfiguration.findFirst({
                where: {
                    deletedAt: null,
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });
        }

        if (!existingConfiguration) {
            throw new NotFoundException('Domestic invoice configuration not found');
        }

        const configurationId = existingConfiguration.id;

        // Prepare update data, only including fields that are provided
        const updateData: any = {};

        if (updateConfigurationDto.domesticInvoicePrefix !== undefined) {
            updateData.domesticInvoicePrefix = updateConfigurationDto.domesticInvoicePrefix;
        }

        if (updateConfigurationDto.domesticInvoiceStartFrom !== undefined) {
            updateData.domesticInvoiceStartFrom = updateConfigurationDto.domesticInvoiceStartFrom;
        }

        if (updateConfigurationDto.domesticInvoiceSuffix !== undefined) {
            updateData.domesticInvoiceSuffix = updateConfigurationDto.domesticInvoiceSuffix;
        }

        if (updateConfigurationDto.domesticPiPrefix !== undefined) {
            updateData.domesticPiPrefix = updateConfigurationDto.domesticPiPrefix;
        }

        if (updateConfigurationDto.domesticPiStartFrom !== undefined) {
            updateData.domesticPiStartFrom = updateConfigurationDto.domesticPiStartFrom;
        }

        if (updateConfigurationDto.domesticPiSuffix !== undefined) {
            updateData.domesticPiSuffix = updateConfigurationDto.domesticPiSuffix;
        }

        return this.prisma.domesticInvoiceConfiguration.update({
            where: { id: configurationId },
            data: updateData,
        });
    }
}
