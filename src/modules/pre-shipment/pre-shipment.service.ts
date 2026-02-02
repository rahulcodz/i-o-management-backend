import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePreShipmentDto } from './dto/create-pre-shipment.dto';
import { UpdatePreShipmentDto } from './dto/update-pre-shipment.dto';
import { QueryPreShipmentDto } from './dto/query-pre-shipment.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PreShipmentService {
    constructor(private prisma: PrismaService) { }

    async create(createPreShipmentDto: CreatePreShipmentDto) {
        // Validate invoice exists
        const invoice = await this.prisma.invoice.findFirst({
            where: { id: createPreShipmentDto.invoiceId, deletedAt: null },
        });
        if (!invoice) {
            throw new BadRequestException('Invoice not found');
        }

        // Validate document template exists
        const documentTemplate = await this.prisma.documentTemplate.findFirst({
            where: { id: createPreShipmentDto.documentTemplateId, deletedAt: null },
        });
        if (!documentTemplate) {
            throw new BadRequestException('Document template not found');
        }

        // Validate product exists
        const product = await this.prisma.product.findFirst({
            where: { id: createPreShipmentDto.productId, deletedAt: null },
        });
        if (!product) {
            throw new BadRequestException('Product not found');
        }

        // Validate vendor if provided
        if (createPreShipmentDto.vendorId) {
            const vendor = await this.prisma.user.findUnique({
                where: { id: createPreShipmentDto.vendorId },
            });
            if (!vendor) {
                throw new BadRequestException('Vendor (User) not found');
            }
        }

        return this.prisma.preShipment.create({
            data: {
                invoiceId: createPreShipmentDto.invoiceId,
                documentTemplateId: createPreShipmentDto.documentTemplateId,
                numberOfContainer: createPreShipmentDto.numberOfContainer,
                productId: createPreShipmentDto.productId,
                vendorId: createPreShipmentDto.vendorId || null,
                grossWeight: createPreShipmentDto.grossWeight,
                netWeight: createPreShipmentDto.netWeight,
                tareWeight: createPreShipmentDto.tareWeight,
                countryOfOrigin: createPreShipmentDto.countryOfOrigin,
                storage: createPreShipmentDto.storage,
                description: createPreShipmentDto.description,
            },
            include: {
                invoice: true,
                documentTemplate: {
                    include: {
                        user: true,
                    },
                },
                product: true,
                vendor: true,
            },
        });
    }

    async findAll(query: QueryPreShipmentDto) {
        const { page = 1, limit = 10, search, invoiceId, documentTemplateId, productId, vendorId } = query;
        const skip = (page - 1) * limit;

        // Build where clause
        const where: Prisma.PreShipmentWhereInput = {
            deletedAt: null, // Only get non-deleted pre-shipments
        };

        // Add search filter if provided
        if (search) {
            where.OR = [
                { description: { contains: search, mode: 'insensitive' } },
                { countryOfOrigin: { contains: search, mode: 'insensitive' } },
                { storage: { contains: search, mode: 'insensitive' } },
            ];
        }

        // Add filters if provided
        if (invoiceId) {
            where.invoiceId = invoiceId;
        }

        if (documentTemplateId) {
            where.documentTemplateId = documentTemplateId;
        }

        if (productId) {
            where.productId = productId;
        }

        if (vendorId) {
            where.vendorId = vendorId;
        }

        // Get total count for pagination
        const total = await this.prisma.preShipment.count({ where });

        // Get paginated results
        const preShipments = await this.prisma.preShipment.findMany({
            where,
            include: {
                invoice: true,
                documentTemplate: {
                    include: {
                        user: true,
                    },
                },
                product: true,
                vendor: true,
            },
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
        });

        return {
            data: preShipments,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: number) {
        const preShipment = await this.prisma.preShipment.findFirst({
            where: {
                id,
                deletedAt: null, // Only get non-deleted pre-shipment
            },
            include: {
                invoice: true,
                documentTemplate: {
                    include: {
                        user: true,
                    },
                },
                product: true,
                vendor: true,
            },
        });

        if (!preShipment) {
            throw new NotFoundException('Pre-shipment not found');
        }

        return preShipment;
    }

    async update(id: number, updatePreShipmentDto: UpdatePreShipmentDto) {
        // Check if pre-shipment exists
        const existingPreShipment = await this.findOne(id);
        if (!existingPreShipment) {
            throw new NotFoundException('Pre-shipment not found');
        }

        // Validate invoice if being updated
        if (updatePreShipmentDto.invoiceId) {
            const invoice = await this.prisma.invoice.findFirst({
                where: { id: updatePreShipmentDto.invoiceId, deletedAt: null },
            });
            if (!invoice) {
                throw new BadRequestException('Invoice not found');
            }
        }

        // Validate document template if being updated
        if (updatePreShipmentDto.documentTemplateId) {
            const documentTemplate = await this.prisma.documentTemplate.findFirst({
                where: { id: updatePreShipmentDto.documentTemplateId, deletedAt: null },
            });
            if (!documentTemplate) {
                throw new BadRequestException('Document template not found');
            }
        }

        // Validate product if being updated
        if (updatePreShipmentDto.productId) {
            const product = await this.prisma.product.findFirst({
                where: { id: updatePreShipmentDto.productId, deletedAt: null },
            });
            if (!product) {
                throw new BadRequestException('Product not found');
            }
        }

        // Validate vendor if being updated
        if (updatePreShipmentDto.vendorId) {
            const vendor = await this.prisma.user.findUnique({
                where: { id: updatePreShipmentDto.vendorId },
            });
            if (!vendor) {
                throw new BadRequestException('Vendor (User) not found');
            }
        }

        return this.prisma.preShipment.update({
            where: { id },
            data: updatePreShipmentDto,
            include: {
                invoice: true,
                documentTemplate: {
                    include: {
                        user: true,
                    },
                },
                product: true,
                vendor: true,
            },
        });
    }

    async remove(id: number) {
        // Check if pre-shipment exists
        const existingPreShipment = await this.findOne(id);
        if (!existingPreShipment) {
            throw new NotFoundException('Pre-shipment not found');
        }

        // Soft delete by setting deletedAt
        return this.prisma.preShipment.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            },
        });
    }
}
