import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { QueryInvoiceDto } from './dto/query-invoice.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class InvoiceService {
    constructor(private prisma: PrismaService) { }

    /**
     * Validate consignee details
     */
    private async validateConsigneeDetails(consigneeDetails: any) {
        if (!consigneeDetails) return;

        if (consigneeDetails.consigneeId) {
            const customer = await this.prisma.customer.findFirst({
                where: { id: consigneeDetails.consigneeId, deletedAt: null },
            });
            if (!customer) {
                throw new BadRequestException('Consignee customer not found');
            }
        }

        if (consigneeDetails.finalDestinationPortId) {
            const port = await this.prisma.port.findFirst({
                where: { id: consigneeDetails.finalDestinationPortId, deletedAt: null },
            });
            if (!port) {
                throw new BadRequestException('Final destination port not found');
            }
        }
    }

    /**
     * Validate shipment details
     */
    private async validateShipmentDetails(shipmentDetails: any) {
        if (!shipmentDetails) return;

        if (shipmentDetails.currencyId) {
            const currency = await this.prisma.currency.findFirst({
                where: { id: shipmentDetails.currencyId, deletedAt: null },
            });
            if (!currency) {
                throw new BadRequestException('Currency not found');
            }
        }

        if (shipmentDetails.bankId) {
            const bank = await this.prisma.bankDetail.findFirst({
                where: { id: shipmentDetails.bankId, deletedAt: null },
            });
            if (!bank) {
                throw new BadRequestException('Bank Detail not found');
            }
        }

        if (shipmentDetails.shipmentTermId) {
            const shipmentTerm = await this.prisma.shipmentTerm.findFirst({
                where: { id: shipmentDetails.shipmentTermId, deletedAt: null },
            });
            if (!shipmentTerm) {
                throw new BadRequestException('Shipment Term not found');
            }
        }

        if (shipmentDetails.paymentTermId) {
            const paymentTerm = await this.prisma.paymentTerm.findFirst({
                where: { id: shipmentDetails.paymentTermId, deletedAt: null },
            });
            if (!paymentTerm) {
                throw new BadRequestException('Payment Term not found');
            }
        }
    }

    /**
     * Validate product details
     */
    private async validateProductDetails(productDetails: any[]) {
        if (!productDetails || productDetails.length === 0) return;

        for (const product of productDetails) {
            if (product.productId) {
                const prod = await this.prisma.product.findFirst({
                    where: { id: product.productId, deletedAt: null },
                });
                if (!prod) {
                    throw new BadRequestException(`Product with ID ${product.productId} not found`);
                }
            }

            if (product.unitId) {
                const unit = await this.prisma.unit.findFirst({
                    where: { id: product.unitId, deletedAt: null },
                });
                if (!unit) {
                    throw new BadRequestException(`Unit with ID ${product.unitId} not found`);
                }
            }

            if (product.packageTypeId) {
                const packageType = await this.prisma.packageType.findFirst({
                    where: { id: product.packageTypeId, deletedAt: null },
                });
                if (!packageType) {
                    throw new BadRequestException(`Package Type with ID ${product.packageTypeId} not found`);
                }
            }

            if (product.materialId) {
                const material = await this.prisma.material.findFirst({
                    where: { id: product.materialId, deletedAt: null },
                });
                if (!material) {
                    throw new BadRequestException(`Material with ID ${product.materialId} not found`);
                }
            }

            // Calculate total if quantity and price are provided
            if (product.quantity !== undefined && product.price !== undefined) {
                product.total = product.quantity * product.price;
            }
        }
    }

    async create(createInvoiceDto: CreateInvoiceDto) {
        // Validate PI No uniqueness
        const existing = await this.prisma.invoice.findUnique({
            where: { piNo: createInvoiceDto.piNo },
        });
        if (existing) {
            throw new BadRequestException(`PI No "${createInvoiceDto.piNo}" already exists`);
        }

        // Validate quotation if provided
        if (createInvoiceDto.quotationId) {
            const quotation = await this.prisma.quotation.findFirst({
                where: { id: createInvoiceDto.quotationId, deletedAt: null },
            });
            if (!quotation) {
                throw new BadRequestException('Quotation not found');
            }
        }

        // Validate consignee details
        await this.validateConsigneeDetails(createInvoiceDto.consigneeDetails);

        // Validate shipment details
        await this.validateShipmentDetails(createInvoiceDto.shipmentDetails);

        // Validate product details
        if (createInvoiceDto.productDetails) {
            await this.validateProductDetails(createInvoiceDto.productDetails);
        }

        // Create invoice with transaction
        return this.prisma.$transaction(async (tx) => {
            // Create invoice
            const invoice = await tx.invoice.create({
                data: {
                    quotationId: createInvoiceDto.quotationId || null,
                    piNo: createInvoiceDto.piNo,
                    date: createInvoiceDto.date ? new Date(createInvoiceDto.date) : null,
                    isProformaInvoice: createInvoiceDto.isProformaInvoice || false,
                    consigneeDetails: createInvoiceDto.consigneeDetails as any,
                    shipmentDetails: createInvoiceDto.shipmentDetails as any,
                    shipmentModel: createInvoiceDto.shipmentModel as any,
                    remarks: createInvoiceDto.remarks,
                    internalNote: createInvoiceDto.internalNote,
                    productionDate: createInvoiceDto.productionDate ? new Date(createInvoiceDto.productionDate) : null,
                    productionExpiryDate: createInvoiceDto.productionExpiryDate ? new Date(createInvoiceDto.productionExpiryDate) : null,
                    placeOfReceiptByPreCarrier: createInvoiceDto.placeOfReceiptByPreCarrier,
                    vesselFlightNo: createInvoiceDto.vesselFlightNo,
                    salesBroker: createInvoiceDto.salesBroker || false,
                    palletised: createInvoiceDto.palletised || false,
                    brokerage: createInvoiceDto.brokerage,
                    brokeragePercentage: createInvoiceDto.brokeragePercentage,
                    soldBy: createInvoiceDto.soldBy,
                },
            });

            // Create product details if provided
            if (createInvoiceDto.productDetails && createInvoiceDto.productDetails.length > 0) {
                const productData = createInvoiceDto.productDetails.map((product) => ({
                    invoiceId: invoice.id,
                    productId: product.productId || null,
                    unitId: product.unitId || null,
                    quantity: product.quantity,
                    price: product.price,
                    total: product.total,
                    package: product.package,
                    productDescription: product.productDescription,
                    netWeight: product.netWeight,
                    grossWeight: product.grossWeight,
                    totalPackages: product.totalPackages,
                    packageTypeId: product.packageTypeId || null,
                    qualitySpec: product.qualitySpec,
                    materialId: product.materialId || null,
                    marking: product.marking,
                    markingFile: product.markingFile,
                }));

                await tx.invoiceProduct.createMany({
                    data: productData,
                });
            }

            // Create container details if provided
            if (createInvoiceDto.containerDetails && createInvoiceDto.containerDetails.length > 0) {
                const containerData = createInvoiceDto.containerDetails.map((container) => ({
                    invoiceId: invoice.id,
                    containerNo: container.containerNo,
                    lineSealNo: container.lineSealNo,
                    rfidSealNo: container.rfidSealNo,
                    sizeType: container.sizeType,
                    boxes: container.boxes,
                    lotNo: container.lotNo,
                    netWeight: container.netWeight,
                    grossWeight: container.grossWeight,
                }));

                await tx.invoiceContainer.createMany({
                    data: containerData,
                });
            }

            // Return invoice with relations
            return tx.invoice.findUnique({
                where: { id: invoice.id },
                include: {
                    quotation: true,
                    invoiceProducts: {
                        include: {
                            product: true,
                            unit: true,
                            packageType: true,
                            material: true,
                        },
                    },
                    invoiceContainers: true,
                },
            });
        });
    }

    async findAll(query: QueryInvoiceDto) {
        const { page = 1, limit = 10, search, quotationId, salesBroker, isProformaInvoice, dateFrom, dateTo } = query;
        const skip = (page - 1) * limit;

        // Build where clause
        const where: Prisma.InvoiceWhereInput = {
            deletedAt: null, // Only get non-deleted invoices
        };

        // Add search filter if provided
        if (search) {
            where.piNo = {
                contains: search,
                mode: 'insensitive',
            };
        }

        // Add quotation filter if provided
        if (quotationId) {
            where.quotationId = quotationId;
        }

        // Add sales broker filter if provided
        if (salesBroker !== undefined) {
            where.salesBroker = salesBroker;
        }

        // Add isProformaInvoice filter if provided
        if (isProformaInvoice !== undefined) {
            where.isProformaInvoice = isProformaInvoice;
        }

        // Add date range filter if provided
        if (dateFrom || dateTo) {
            where.date = {};
            if (dateFrom) {
                where.date.gte = new Date(dateFrom);
            }
            if (dateTo) {
                where.date.lte = new Date(dateTo);
            }
        }

        // Get total count for pagination
        const total = await this.prisma.invoice.count({ where });

        // Get paginated results
        const invoices = await this.prisma.invoice.findMany({
            where,
            include: {
                quotation: true,
                invoiceProducts: {
                    include: {
                        product: true,
                        unit: true,
                        packageType: true,
                        material: true,
                    },
                },
                invoiceContainers: true,
            },
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
        });

        return {
            data: invoices,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: number) {
        const invoice = await this.prisma.invoice.findFirst({
            where: {
                id,
                deletedAt: null, // Only get non-deleted invoice
            },
            include: {
                quotation: true,
                invoiceProducts: {
                    include: {
                        product: true,
                        unit: true,
                        packageType: true,
                        material: true,
                    },
                },
                invoiceContainers: true,
            },
        });

        if (!invoice) {
            throw new NotFoundException('Invoice not found');
        }

        return invoice;
    }

    async update(id: number, updateInvoiceDto: UpdateInvoiceDto) {
        // Check if invoice exists
        const existingInvoice = await this.findOne(id);
        if (!existingInvoice) {
            throw new NotFoundException('Invoice not found');
        }

        // Validate PI No uniqueness if being updated
        if (updateInvoiceDto.piNo) {
            if (updateInvoiceDto.piNo !== existingInvoice.piNo) {
                const existing = await this.prisma.invoice.findUnique({
                    where: { piNo: updateInvoiceDto.piNo },
                });
                if (existing) {
                    throw new BadRequestException(`PI No "${updateInvoiceDto.piNo}" already exists`);
                }
            }
        }

        // Validate quotation if being updated
        if (updateInvoiceDto.quotationId) {
            const quotation = await this.prisma.quotation.findFirst({
                where: { id: updateInvoiceDto.quotationId, deletedAt: null },
            });
            if (!quotation) {
                throw new BadRequestException('Quotation not found');
            }
        }

        // Validate consignee details if being updated
        if (updateInvoiceDto.consigneeDetails) {
            await this.validateConsigneeDetails(updateInvoiceDto.consigneeDetails);
        }

        // Validate shipment details if being updated
        if (updateInvoiceDto.shipmentDetails) {
            await this.validateShipmentDetails(updateInvoiceDto.shipmentDetails);
        }

        // Validate product details if being updated
        if (updateInvoiceDto.productDetails) {
            await this.validateProductDetails(updateInvoiceDto.productDetails);
        }

        // Update invoice with transaction
        return this.prisma.$transaction(async (tx) => {
            // Prepare update data
            const updateData: any = {};

            if (updateInvoiceDto.quotationId !== undefined) {
                updateData.quotationId = updateInvoiceDto.quotationId;
            }

            if (updateInvoiceDto.piNo !== undefined) {
                updateData.piNo = updateInvoiceDto.piNo;
            }

            if (updateInvoiceDto.date !== undefined) {
                updateData.date = updateInvoiceDto.date ? new Date(updateInvoiceDto.date) : null;
            }

            if (updateInvoiceDto.isProformaInvoice !== undefined) {
                updateData.isProformaInvoice = updateInvoiceDto.isProformaInvoice;
            }

            if (updateInvoiceDto.consigneeDetails !== undefined) {
                updateData.consigneeDetails = updateInvoiceDto.consigneeDetails as any;
            }

            if (updateInvoiceDto.shipmentDetails !== undefined) {
                updateData.shipmentDetails = updateInvoiceDto.shipmentDetails as any;
            }

            if (updateInvoiceDto.shipmentModel !== undefined) {
                updateData.shipmentModel = updateInvoiceDto.shipmentModel as any;
            }

            if (updateInvoiceDto.remarks !== undefined) {
                updateData.remarks = updateInvoiceDto.remarks;
            }

            if (updateInvoiceDto.internalNote !== undefined) {
                updateData.internalNote = updateInvoiceDto.internalNote;
            }

            if (updateInvoiceDto.productionDate !== undefined) {
                updateData.productionDate = updateInvoiceDto.productionDate ? new Date(updateInvoiceDto.productionDate) : null;
            }

            if (updateInvoiceDto.productionExpiryDate !== undefined) {
                updateData.productionExpiryDate = updateInvoiceDto.productionExpiryDate ? new Date(updateInvoiceDto.productionExpiryDate) : null;
            }

            if (updateInvoiceDto.placeOfReceiptByPreCarrier !== undefined) {
                updateData.placeOfReceiptByPreCarrier = updateInvoiceDto.placeOfReceiptByPreCarrier;
            }

            if (updateInvoiceDto.vesselFlightNo !== undefined) {
                updateData.vesselFlightNo = updateInvoiceDto.vesselFlightNo;
            }

            if (updateInvoiceDto.salesBroker !== undefined) {
                updateData.salesBroker = updateInvoiceDto.salesBroker;
            }

            if (updateInvoiceDto.palletised !== undefined) {
                updateData.palletised = updateInvoiceDto.palletised;
            }

            if (updateInvoiceDto.brokerage !== undefined) {
                updateData.brokerage = updateInvoiceDto.brokerage;
            }

            if (updateInvoiceDto.brokeragePercentage !== undefined) {
                updateData.brokeragePercentage = updateInvoiceDto.brokeragePercentage;
            }

            if (updateInvoiceDto.soldBy !== undefined) {
                updateData.soldBy = updateInvoiceDto.soldBy;
            }

            // Update invoice
            await tx.invoice.update({
                where: { id },
                data: updateData,
            });

            // Update product details if provided
            if (updateInvoiceDto.productDetails) {
                // Delete existing products
                await tx.invoiceProduct.deleteMany({
                    where: { invoiceId: id },
                });

                // Create new products
                if (updateInvoiceDto.productDetails.length > 0) {
                    const productData = updateInvoiceDto.productDetails.map((product) => ({
                        invoiceId: id,
                        productId: product.productId || null,
                        unitId: product.unitId || null,
                        quantity: product.quantity,
                        price: product.price,
                        total: product.total,
                        package: product.package,
                        productDescription: product.productDescription,
                        netWeight: product.netWeight,
                        grossWeight: product.grossWeight,
                        totalPackages: product.totalPackages,
                        packageTypeId: product.packageTypeId || null,
                        qualitySpec: product.qualitySpec,
                        materialId: product.materialId || null,
                        marking: product.marking,
                        markingFile: product.markingFile,
                    }));

                    await tx.invoiceProduct.createMany({
                        data: productData,
                    });
                }
            }

            // Update container details if provided
            if (updateInvoiceDto.containerDetails) {
                // Delete existing containers
                await tx.invoiceContainer.deleteMany({
                    where: { invoiceId: id },
                });

                // Create new containers
                if (updateInvoiceDto.containerDetails.length > 0) {
                    const containerData = updateInvoiceDto.containerDetails.map((container) => ({
                        invoiceId: id,
                        containerNo: container.containerNo,
                        lineSealNo: container.lineSealNo,
                        rfidSealNo: container.rfidSealNo,
                        sizeType: container.sizeType,
                        boxes: container.boxes,
                        lotNo: container.lotNo,
                        netWeight: container.netWeight,
                        grossWeight: container.grossWeight,
                    }));

                    await tx.invoiceContainer.createMany({
                        data: containerData,
                    });
                }
            }

            // Return updated invoice with relations
            return tx.invoice.findUnique({
                where: { id },
                include: {
                    quotation: true,
                    invoiceProducts: {
                        include: {
                            product: true,
                            unit: true,
                            packageType: true,
                            material: true,
                        },
                    },
                    invoiceContainers: true,
                },
            });
        });
    }

    async remove(id: number) {
        // Check if invoice exists
        const existingInvoice = await this.findOne(id);
        if (!existingInvoice) {
            throw new NotFoundException('Invoice not found');
        }

        // Soft delete by setting deletedAt
        return this.prisma.invoice.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            },
        });
    }
}
