import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProformaInvoiceDto } from './dto/create-proforma-invoice.dto';
import { UpdateProformaInvoiceDto } from './dto/update-proforma-invoice.dto';
import { QueryProformaInvoiceDto } from './dto/query-proforma-invoice.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProformaInvoiceService {
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

    async create(createProformaInvoiceDto: CreateProformaInvoiceDto) {
        // Validate PI No uniqueness
        const existing = await this.prisma.proformaInvoice.findUnique({
            where: { piNo: createProformaInvoiceDto.piNo },
        });
        if (existing) {
            throw new BadRequestException(`PI No "${createProformaInvoiceDto.piNo}" already exists`);
        }

        // Validate quotation if provided
        if (createProformaInvoiceDto.quotationId) {
            const quotation = await this.prisma.quotation.findFirst({
                where: { id: createProformaInvoiceDto.quotationId, deletedAt: null },
            });
            if (!quotation) {
                throw new BadRequestException('Quotation not found');
            }
        }

        // Validate consignee details
        await this.validateConsigneeDetails(createProformaInvoiceDto.consigneeDetails);

        // Validate shipment details
        await this.validateShipmentDetails(createProformaInvoiceDto.shipmentDetails);

        // Validate product details
        if (createProformaInvoiceDto.productDetails) {
            await this.validateProductDetails(createProformaInvoiceDto.productDetails);
        }

        // Create proforma invoice with transaction
        return this.prisma.$transaction(async (tx) => {
            // Create proforma invoice
            const proformaInvoice = await tx.proformaInvoice.create({
                data: {
                    quotationId: createProformaInvoiceDto.quotationId || null,
                    piNo: createProformaInvoiceDto.piNo,
                    date: createProformaInvoiceDto.date ? new Date(createProformaInvoiceDto.date) : null,
                    consigneeDetails: createProformaInvoiceDto.consigneeDetails as any,
                    shipmentDetails: createProformaInvoiceDto.shipmentDetails as any,
                    shipmentModel: createProformaInvoiceDto.shipmentModel as any,
                    remarks: createProformaInvoiceDto.remarks,
                    internalNote: createProformaInvoiceDto.internalNote,
                    productionDate: createProformaInvoiceDto.productionDate ? new Date(createProformaInvoiceDto.productionDate) : null,
                    productionExpiryDate: createProformaInvoiceDto.productionExpiryDate ? new Date(createProformaInvoiceDto.productionExpiryDate) : null,
                    placeOfReceiptByPreCarrier: createProformaInvoiceDto.placeOfReceiptByPreCarrier,
                    vesselFlightNo: createProformaInvoiceDto.vesselFlightNo,
                    salesBroker: createProformaInvoiceDto.salesBroker || false,
                    palletised: createProformaInvoiceDto.palletised || false,
                    brokerage: createProformaInvoiceDto.brokerage,
                    brokeragePercentage: createProformaInvoiceDto.brokeragePercentage,
                    soldBy: createProformaInvoiceDto.soldBy,
                },
            });

            // Create product details if provided
            if (createProformaInvoiceDto.productDetails && createProformaInvoiceDto.productDetails.length > 0) {
                const productData = createProformaInvoiceDto.productDetails.map((product) => ({
                    proformaInvoiceId: proformaInvoice.id,
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

                await tx.proformaInvoiceProduct.createMany({
                    data: productData,
                });
            }

            // Create container details if provided
            if (createProformaInvoiceDto.containerDetails && createProformaInvoiceDto.containerDetails.length > 0) {
                const containerData = createProformaInvoiceDto.containerDetails.map((container) => ({
                    proformaInvoiceId: proformaInvoice.id,
                    containerNo: container.containerNo,
                    lineSealNo: container.lineSealNo,
                    rfidSealNo: container.rfidSealNo,
                    sizeType: container.sizeType,
                    boxes: container.boxes,
                    lotNo: container.lotNo,
                    netWeight: container.netWeight,
                    grossWeight: container.grossWeight,
                }));

                await tx.proformaInvoiceContainer.createMany({
                    data: containerData,
                });
            }

            // Return proforma invoice with relations
            return tx.proformaInvoice.findUnique({
                where: { id: proformaInvoice.id },
                include: {
                    quotation: true,
                    proformaInvoiceProducts: {
                        include: {
                            product: true,
                            unit: true,
                            packageType: true,
                            material: true,
                        },
                    },
                    proformaInvoiceContainers: true,
                },
            });
        });
    }

    async findAll(query: QueryProformaInvoiceDto) {
        const { page = 1, limit = 10, search, quotationId, salesBroker, dateFrom, dateTo } = query;
        const skip = (page - 1) * limit;

        // Build where clause
        const where: Prisma.ProformaInvoiceWhereInput = {
            deletedAt: null, // Only get non-deleted proforma invoices
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
        const total = await this.prisma.proformaInvoice.count({ where });

        // Get paginated results
        const proformaInvoices = await this.prisma.proformaInvoice.findMany({
            where,
            include: {
                quotation: true,
                proformaInvoiceProducts: {
                    include: {
                        product: true,
                        unit: true,
                        packageType: true,
                        material: true,
                    },
                },
                proformaInvoiceContainers: true,
            },
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
        });

        return {
            data: proformaInvoices,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: number) {
        const proformaInvoice = await this.prisma.proformaInvoice.findFirst({
            where: {
                id,
                deletedAt: null, // Only get non-deleted proforma invoice
            },
            include: {
                quotation: true,
                proformaInvoiceProducts: {
                    include: {
                        product: true,
                        unit: true,
                        packageType: true,
                        material: true,
                    },
                },
                proformaInvoiceContainers: true,
            },
        });

        if (!proformaInvoice) {
            throw new NotFoundException('Proforma invoice not found');
        }

        return proformaInvoice;
    }

    async update(id: number, updateProformaInvoiceDto: UpdateProformaInvoiceDto) {
        // Check if proforma invoice exists
        const existingProformaInvoice = await this.findOne(id);
        if (!existingProformaInvoice) {
            throw new NotFoundException('Proforma invoice not found');
        }

        // Validate PI No uniqueness if being updated
        if (updateProformaInvoiceDto.piNo) {
            if (updateProformaInvoiceDto.piNo !== existingProformaInvoice.piNo) {
                const existing = await this.prisma.proformaInvoice.findUnique({
                    where: { piNo: updateProformaInvoiceDto.piNo },
                });
                if (existing) {
                    throw new BadRequestException(`PI No "${updateProformaInvoiceDto.piNo}" already exists`);
                }
            }
        }

        // Validate quotation if being updated
        if (updateProformaInvoiceDto.quotationId) {
            const quotation = await this.prisma.quotation.findFirst({
                where: { id: updateProformaInvoiceDto.quotationId, deletedAt: null },
            });
            if (!quotation) {
                throw new BadRequestException('Quotation not found');
            }
        }

        // Validate consignee details if being updated
        if (updateProformaInvoiceDto.consigneeDetails) {
            await this.validateConsigneeDetails(updateProformaInvoiceDto.consigneeDetails);
        }

        // Validate shipment details if being updated
        if (updateProformaInvoiceDto.shipmentDetails) {
            await this.validateShipmentDetails(updateProformaInvoiceDto.shipmentDetails);
        }

        // Validate product details if being updated
        if (updateProformaInvoiceDto.productDetails) {
            await this.validateProductDetails(updateProformaInvoiceDto.productDetails);
        }

        // Update proforma invoice with transaction
        return this.prisma.$transaction(async (tx) => {
            // Prepare update data
            const updateData: any = {};

            if (updateProformaInvoiceDto.quotationId !== undefined) {
                updateData.quotationId = updateProformaInvoiceDto.quotationId;
            }

            if (updateProformaInvoiceDto.piNo !== undefined) {
                updateData.piNo = updateProformaInvoiceDto.piNo;
            }

            if (updateProformaInvoiceDto.date !== undefined) {
                updateData.date = updateProformaInvoiceDto.date ? new Date(updateProformaInvoiceDto.date) : null;
            }

            if (updateProformaInvoiceDto.consigneeDetails !== undefined) {
                updateData.consigneeDetails = updateProformaInvoiceDto.consigneeDetails as any;
            }

            if (updateProformaInvoiceDto.shipmentDetails !== undefined) {
                updateData.shipmentDetails = updateProformaInvoiceDto.shipmentDetails as any;
            }

            if (updateProformaInvoiceDto.shipmentModel !== undefined) {
                updateData.shipmentModel = updateProformaInvoiceDto.shipmentModel as any;
            }

            if (updateProformaInvoiceDto.remarks !== undefined) {
                updateData.remarks = updateProformaInvoiceDto.remarks;
            }

            if (updateProformaInvoiceDto.internalNote !== undefined) {
                updateData.internalNote = updateProformaInvoiceDto.internalNote;
            }

            if (updateProformaInvoiceDto.productionDate !== undefined) {
                updateData.productionDate = updateProformaInvoiceDto.productionDate ? new Date(updateProformaInvoiceDto.productionDate) : null;
            }

            if (updateProformaInvoiceDto.productionExpiryDate !== undefined) {
                updateData.productionExpiryDate = updateProformaInvoiceDto.productionExpiryDate ? new Date(updateProformaInvoiceDto.productionExpiryDate) : null;
            }

            if (updateProformaInvoiceDto.placeOfReceiptByPreCarrier !== undefined) {
                updateData.placeOfReceiptByPreCarrier = updateProformaInvoiceDto.placeOfReceiptByPreCarrier;
            }

            if (updateProformaInvoiceDto.vesselFlightNo !== undefined) {
                updateData.vesselFlightNo = updateProformaInvoiceDto.vesselFlightNo;
            }

            if (updateProformaInvoiceDto.salesBroker !== undefined) {
                updateData.salesBroker = updateProformaInvoiceDto.salesBroker;
            }

            if (updateProformaInvoiceDto.palletised !== undefined) {
                updateData.palletised = updateProformaInvoiceDto.palletised;
            }

            if (updateProformaInvoiceDto.brokerage !== undefined) {
                updateData.brokerage = updateProformaInvoiceDto.brokerage;
            }

            if (updateProformaInvoiceDto.brokeragePercentage !== undefined) {
                updateData.brokeragePercentage = updateProformaInvoiceDto.brokeragePercentage;
            }

            if (updateProformaInvoiceDto.soldBy !== undefined) {
                updateData.soldBy = updateProformaInvoiceDto.soldBy;
            }

            // Update proforma invoice
            await tx.proformaInvoice.update({
                where: { id },
                data: updateData,
            });

            // Update product details if provided
            if (updateProformaInvoiceDto.productDetails) {
                // Delete existing products
                await tx.proformaInvoiceProduct.deleteMany({
                    where: { proformaInvoiceId: id },
                });

                // Create new products
                if (updateProformaInvoiceDto.productDetails.length > 0) {
                    const productData = updateProformaInvoiceDto.productDetails.map((product) => ({
                        proformaInvoiceId: id,
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

                    await tx.proformaInvoiceProduct.createMany({
                        data: productData,
                    });
                }
            }

            // Update container details if provided
            if (updateProformaInvoiceDto.containerDetails) {
                // Delete existing containers
                await tx.proformaInvoiceContainer.deleteMany({
                    where: { proformaInvoiceId: id },
                });

                // Create new containers
                if (updateProformaInvoiceDto.containerDetails.length > 0) {
                    const containerData = updateProformaInvoiceDto.containerDetails.map((container) => ({
                        proformaInvoiceId: id,
                        containerNo: container.containerNo,
                        lineSealNo: container.lineSealNo,
                        rfidSealNo: container.rfidSealNo,
                        sizeType: container.sizeType,
                        boxes: container.boxes,
                        lotNo: container.lotNo,
                        netWeight: container.netWeight,
                        grossWeight: container.grossWeight,
                    }));

                    await tx.proformaInvoiceContainer.createMany({
                        data: containerData,
                    });
                }
            }

            // Return updated proforma invoice with relations
            return tx.proformaInvoice.findUnique({
                where: { id },
                include: {
                    quotation: true,
                    proformaInvoiceProducts: {
                        include: {
                            product: true,
                            unit: true,
                            packageType: true,
                            material: true,
                        },
                    },
                    proformaInvoiceContainers: true,
                },
            });
        });
    }

    async remove(id: number) {
        // Check if proforma invoice exists
        const existingProformaInvoice = await this.findOne(id);
        if (!existingProformaInvoice) {
            throw new NotFoundException('Proforma invoice not found');
        }

        // Soft delete by setting deletedAt
        return this.prisma.proformaInvoice.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            },
        });
    }
}
