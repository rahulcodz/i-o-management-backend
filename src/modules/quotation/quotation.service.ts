import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateQuotationDto } from './dto/create-quotation.dto';
import { UpdateQuotationDto } from './dto/update-quotation.dto';
import { QueryQuotationDto } from './dto/query-quotation.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class QuotationService {
    constructor(private prisma: PrismaService) { }

    /**
     * Generate auto-incrementing quotation number
     */
    private async generateQuotationNo(): Promise<string> {
        const year = new Date().getFullYear();
        const count = await this.prisma.quotation.count({
            where: {
                quotationNo: {
                    startsWith: `QT-${year}-`,
                },
            },
        });
        const nextNumber = count + 1;
        return `QT-${year}-${String(nextNumber).padStart(4, '0')}`;
    }

    /**
     * Validate and prepare consignee details
     */
    private async validateConsigneeDetails(consigneeDetails: any) {
        if (consigneeDetails.consigneeId) {
            const customer = await this.prisma.customer.findFirst({
                where: { id: consigneeDetails.consigneeId, deletedAt: null },
            });
            if (!customer) {
                throw new BadRequestException('Consignee customer not found');
            }
        }

        if (consigneeDetails.notifyPartyId) {
            const customer = await this.prisma.customer.findFirst({
                where: { id: consigneeDetails.notifyPartyId, deletedAt: null },
            });
            if (!customer) {
                throw new BadRequestException('Notify Party customer not found');
            }
        }

        if (consigneeDetails.otherNotifyPartyId) {
            const customer = await this.prisma.customer.findFirst({
                where: { id: consigneeDetails.otherNotifyPartyId, deletedAt: null },
            });
            if (!customer) {
                throw new BadRequestException('Other Notify Party customer not found');
            }
        }

        if (consigneeDetails.portId) {
            const port = await this.prisma.port.findFirst({
                where: { id: consigneeDetails.portId, deletedAt: null },
            });
            if (!port) {
                throw new BadRequestException('Port not found');
            }
        }
    }

    /**
     * Validate and prepare shipment details
     */
    private async validateShipmentDetails(shipmentDetails: any, salesBroker: boolean) {
        if (!salesBroker) {
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
        } else {
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

        if (shipmentDetails.salespersonId) {
            const user = await this.prisma.user.findUnique({
                where: { id: shipmentDetails.salespersonId },
            });
            if (!user) {
                throw new BadRequestException('Salesperson not found');
            }
        }
    }

    /**
     * Validate and prepare product details
     */
    private async validateProductDetails(productDetails: any[]) {
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

    async create(createQuotationDto: CreateQuotationDto) {
        // Validate quotation number uniqueness
        const existing = await this.prisma.quotation.findUnique({
            where: { quotationNo: createQuotationDto.quotationNumber },
        });
        if (existing) {
            throw new BadRequestException(`Quotation number "${createQuotationDto.quotationNumber}" already exists`);
        }

        // Validate consignee details
        await this.validateConsigneeDetails(createQuotationDto.consigneeDetails);

        // Validate shipment details
        const salesBroker = createQuotationDto.salesBroker || false;
        await this.validateShipmentDetails(createQuotationDto.shipmentDetails, salesBroker);

        // Validate product details
        await this.validateProductDetails(createQuotationDto.productDetails);

        // Create quotation with transaction
        return this.prisma.$transaction(async (tx) => {
            // Create quotation
            const quotation = await tx.quotation.create({
                data: {
                    quotationNo: createQuotationDto.quotationNumber,
                    date: createQuotationDto.date ? new Date(createQuotationDto.date) : null,
                    consigneeDetails: createQuotationDto.consigneeDetails as any,
                    shipmentDetails: createQuotationDto.shipmentDetails as any,
                    salesBroker,
                    remark: createQuotationDto.remark,
                },
            });

            // Create quotation products
            const productData = createQuotationDto.productDetails.map((product) => ({
                quotationId: quotation.id,
                productId: product.productId,
                unitId: product.unitId,
                quantity: product.quantity,
                price: product.price,
                total: product.total,
                package: product.package,
                productDescription: product.productDescription,
                netWeight: product.netWeight,
                grossWeight: product.grossWeight,
                totalPackages: product.totalPackages,
                packageTypeId: product.packageTypeId,
                qualitySpec: product.qualitySpec,
                materialId: product.materialId,
                marking: product.marking,
                markingFile: product.markingFile,
                totalNetWeight: product.totalNetWeight,
                totalGrossWeight: product.totalGrossWeight,
            }));

            await tx.quotationProduct.createMany({
                data: productData,
            });

            // Return quotation with products
            return tx.quotation.findUnique({
                where: { id: quotation.id },
                include: {
                    quotationProducts: {
                        include: {
                            product: true,
                            unit: true,
                            packageType: true,
                            material: true,
                        },
                    },
                },
            });
        });
    }

    async findAll(query: QueryQuotationDto) {
        const { page = 1, limit = 10, search } = query;
        const skip = (page - 1) * limit;

        // Build where clause
        const where: Prisma.QuotationWhereInput = {
            deletedAt: null, // Only get non-deleted quotations
        };

        // Add search filter if provided
        if (search) {
            where.quotationNo = {
                contains: search,
                mode: 'insensitive',
            };
        }

        // Get total count for pagination
        const total = await this.prisma.quotation.count({ where });

        // Get paginated results
        const quotations = await this.prisma.quotation.findMany({
            where,
            include: {
                quotationProducts: {
                    include: {
                        product: true,
                        unit: true,
                        packageType: true,
                        material: true,
                    },
                },
            },
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
        });

        return {
            data: quotations,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: number) {
        const quotation = await this.prisma.quotation.findFirst({
            where: {
                id,
                deletedAt: null, // Only get non-deleted quotation
            },
            include: {
                quotationProducts: {
                    include: {
                        product: true,
                        unit: true,
                        packageType: true,
                        material: true,
                    },
                },
            },
        });

        if (!quotation) {
            throw new NotFoundException('Quotation not found');
        }

        return quotation;
    }

    async update(id: number, updateQuotationDto: UpdateQuotationDto) {
        // Check if quotation exists
        const existingQuotation = await this.findOne(id);
        if (!existingQuotation) {
            throw new NotFoundException('Quotation not found');
        }

        // Validate if consignee details are being updated
        if (updateQuotationDto.consigneeDetails) {
            await this.validateConsigneeDetails(updateQuotationDto.consigneeDetails);
        }

        // Validate if shipment details are being updated
        const salesBroker = updateQuotationDto.salesBroker !== undefined
            ? updateQuotationDto.salesBroker
            : existingQuotation.salesBroker;

        if (updateQuotationDto.shipmentDetails) {
            await this.validateShipmentDetails(updateQuotationDto.shipmentDetails, salesBroker);
        }

        // Validate if product details are being updated
        if (updateQuotationDto.productDetails) {
            await this.validateProductDetails(updateQuotationDto.productDetails);
        }

        // Validate quotation number uniqueness if being updated
        if (updateQuotationDto.quotationNumber) {
            if (updateQuotationDto.quotationNumber !== existingQuotation.quotationNo) {
                const existing = await this.prisma.quotation.findUnique({
                    where: { quotationNo: updateQuotationDto.quotationNumber },
                });
                if (existing) {
                    throw new BadRequestException(`Quotation number "${updateQuotationDto.quotationNumber}" already exists`);
                }
            }
        }

        // Update quotation with transaction
        return this.prisma.$transaction(async (tx) => {
            // Prepare update data
            const updateData: any = {};

            if (updateQuotationDto.quotationNumber !== undefined) {
                updateData.quotationNo = updateQuotationDto.quotationNumber;
            }

            if (updateQuotationDto.date !== undefined) {
                updateData.date = updateQuotationDto.date ? new Date(updateQuotationDto.date) : null;
            }

            if (updateQuotationDto.consigneeDetails !== undefined) {
                updateData.consigneeDetails = updateQuotationDto.consigneeDetails as any;
            }

            if (updateQuotationDto.shipmentDetails !== undefined) {
                updateData.shipmentDetails = updateQuotationDto.shipmentDetails as any;
            }

            if (updateQuotationDto.salesBroker !== undefined) {
                updateData.salesBroker = updateQuotationDto.salesBroker;
            }

            if (updateQuotationDto.remark !== undefined) {
                updateData.remark = updateQuotationDto.remark;
            }

            // Update quotation
            const quotation = await tx.quotation.update({
                where: { id },
                data: updateData,
            });

            // Update product details if provided
            if (updateQuotationDto.productDetails) {
                // Delete existing products
                await tx.quotationProduct.deleteMany({
                    where: { quotationId: id },
                });

                // Create new products
                const productData = updateQuotationDto.productDetails.map((product) => ({
                    quotationId: id,
                    productId: product.productId,
                    unitId: product.unitId,
                    quantity: product.quantity,
                    price: product.price,
                    total: product.total,
                    package: product.package,
                    productDescription: product.productDescription,
                    netWeight: product.netWeight,
                    grossWeight: product.grossWeight,
                    totalPackages: product.totalPackages,
                    packageTypeId: product.packageTypeId,
                    qualitySpec: product.qualitySpec,
                    materialId: product.materialId,
                    marking: product.marking,
                    markingFile: product.markingFile,
                    totalNetWeight: product.totalNetWeight,
                    totalGrossWeight: product.totalGrossWeight,
                }));

                await tx.quotationProduct.createMany({
                    data: productData,
                });
            }

            // Return updated quotation with products
            return tx.quotation.findUnique({
                where: { id },
                include: {
                    quotationProducts: {
                        include: {
                            product: true,
                            unit: true,
                            packageType: true,
                            material: true,
                        },
                    },
                },
            });
        });
    }

    async remove(id: number) {
        // Check if quotation exists
        const existingQuotation = await this.findOne(id);
        if (!existingQuotation) {
            throw new NotFoundException('Quotation not found');
        }

        // Soft delete by setting deletedAt
        return this.prisma.quotation.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            },
        });
    }
}
