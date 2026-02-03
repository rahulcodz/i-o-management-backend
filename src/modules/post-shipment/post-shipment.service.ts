import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePostShipmentDto } from './dto/create-post-shipment.dto';
import { UpdatePostShipmentDto } from './dto/update-post-shipment.dto';
import { QueryPostShipmentDto } from './dto/query-post-shipment.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PostShipmentService {
    constructor(private prisma: PrismaService) { }

    async create(createPostShipmentDto: CreatePostShipmentDto) {
        // Validate invoice exists
        const invoice = await this.prisma.invoice.findFirst({
            where: { id: createPostShipmentDto.invoiceId, deletedAt: null },
        });
        if (!invoice) {
            throw new BadRequestException('Invoice not found');
        }

        // Validate product exists
        const product = await this.prisma.product.findFirst({
            where: { id: createPostShipmentDto.productId, deletedAt: null },
        });
        if (!product) {
            throw new BadRequestException('Product not found');
        }

        // Validate units in list if provided
        if (createPostShipmentDto.list) {
            for (const listItem of createPostShipmentDto.list) {
                if (listItem.unitId) {
                    const unit = await this.prisma.unit.findFirst({
                        where: { id: listItem.unitId, deletedAt: null },
                    });
                    if (!unit) {
                        throw new BadRequestException(`Unit with ID ${listItem.unitId} not found`);
                    }
                }
            }
        }

        return this.prisma.postShipment.create({
            data: {
                invoiceId: createPostShipmentDto.invoiceId,
                productId: createPostShipmentDto.productId,
                grade: createPostShipmentDto.grade || null,
                rawMaterial: createPostShipmentDto.rawMaterial || null,
                list: (createPostShipmentDto.list as any) || Prisma.JsonNull,
            },
            include: {
                invoice: true,
                product: true,
            },
        });
    }

    async findAll(query: QueryPostShipmentDto) {
        const { page = 1, limit = 10, search, invoiceId, productId } = query;
        const skip = (page - 1) * limit;

        // Build where clause
        const where: Prisma.PostShipmentWhereInput = {
            deletedAt: null, // Only get non-deleted post-shipments
        };

        // Add search filter if provided
        if (search) {
            where.OR = [
                { grade: { contains: search, mode: 'insensitive' } },
                { rawMaterial: { contains: search, mode: 'insensitive' } },
                {
                    invoice: {
                        piNo: { contains: search, mode: 'insensitive' },
                    },
                },
            ];
        }

        // Add invoice filter if provided
        if (invoiceId) {
            where.invoiceId = invoiceId;
        }

        // Add product filter if provided
        if (productId) {
            where.productId = productId;
        }

        // Get total count for pagination
        const total = await this.prisma.postShipment.count({ where });

        // Get paginated results
        const postShipments = await this.prisma.postShipment.findMany({
            where,
            include: {
                invoice: true,
                product: true,
            },
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
        });

        return {
            data: postShipments,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: number) {
        const postShipment = await this.prisma.postShipment.findFirst({
            where: {
                id,
                deletedAt: null, // Only get non-deleted post-shipment
            },
            include: {
                invoice: true,
                product: true,
            },
        });

        if (!postShipment) {
            throw new NotFoundException('Post-shipment not found');
        }

        return postShipment;
    }

    async update(id: number, updatePostShipmentDto: UpdatePostShipmentDto) {
        // Check if post-shipment exists
        const existingPostShipment = await this.findOne(id);
        if (!existingPostShipment) {
            throw new NotFoundException('Post-shipment not found');
        }

        // Validate invoice if being updated
        if (updatePostShipmentDto.invoiceId) {
            const invoice = await this.prisma.invoice.findFirst({
                where: { id: updatePostShipmentDto.invoiceId, deletedAt: null },
            });
            if (!invoice) {
                throw new BadRequestException('Invoice not found');
            }
        }

        // Validate product if being updated
        if (updatePostShipmentDto.productId) {
            const product = await this.prisma.product.findFirst({
                where: { id: updatePostShipmentDto.productId, deletedAt: null },
            });
            if (!product) {
                throw new BadRequestException('Product not found');
            }
        }

        // Validate units in list if provided
        if (updatePostShipmentDto.list) {
            for (const listItem of updatePostShipmentDto.list) {
                if (listItem.unitId) {
                    const unit = await this.prisma.unit.findFirst({
                        where: { id: listItem.unitId, deletedAt: null },
                    });
                    if (!unit) {
                        throw new BadRequestException(`Unit with ID ${listItem.unitId} not found`);
                    }
                }
            }
        }

        const { invoiceId, productId, ...updateData } = updatePostShipmentDto;

        return this.prisma.postShipment.update({
            where: { id },
            data: {
                ...updateData,
                list: updatePostShipmentDto.list !== undefined ? (updatePostShipmentDto.list as any) : undefined,
                invoice: updatePostShipmentDto.invoiceId ? { connect: { id: updatePostShipmentDto.invoiceId } } : undefined,
                product: updatePostShipmentDto.productId ? { connect: { id: updatePostShipmentDto.productId } } : undefined,
            },
            include: {
                invoice: true,
                product: true,
            },
        });
    }

    async remove(id: number) {
        // Check if post-shipment exists
        const existingPostShipment = await this.findOne(id);
        if (!existingPostShipment) {
            throw new NotFoundException('Post-shipment not found');
        }

        // Soft delete by setting deletedAt
        return this.prisma.postShipment.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            },
        });
    }
}
