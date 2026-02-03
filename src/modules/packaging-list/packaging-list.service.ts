import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePackagingListDto } from './dto/create-packaging-list.dto';
import { UpdatePackagingListDto } from './dto/update-packaging-list.dto';
import { QueryPackagingListDto } from './dto/query-packaging-list.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PackagingListService {
    constructor(private prisma: PrismaService) { }

    async create(createPackagingListDto: CreatePackagingListDto) {
        // Validate invoice exists
        const invoice = await this.prisma.invoice.findFirst({
            where: { id: createPackagingListDto.invoiceId, deletedAt: null },
        });
        if (!invoice) {
            throw new BadRequestException('Invoice not found');
        }

        // Validate products in group if provided
        if (createPackagingListDto.group) {
            for (const groupItem of createPackagingListDto.group) {
                if (groupItem.productId) {
                    const product = await this.prisma.product.findFirst({
                        where: { id: groupItem.productId, deletedAt: null },
                    });
                    if (!product) {
                        throw new BadRequestException(`Product with ID ${groupItem.productId} not found`);
                    }
                }
                if (groupItem.packageTypeId) {
                    const packageType = await this.prisma.packageType.findFirst({
                        where: { id: groupItem.packageTypeId, deletedAt: null },
                    });
                    if (!packageType) {
                        throw new BadRequestException(`Package Type with ID ${groupItem.packageTypeId} not found`);
                    }
                }
            }
        }

        return this.prisma.packagingList.create({
            data: {
                invoiceId: createPackagingListDto.invoiceId,
                cartonCount: createPackagingListDto.cartonCount,
                cartonInfo: createPackagingListDto.cartonInfo || null,
                group: createPackagingListDto.group || null,
                isWoodenbox: createPackagingListDto.isWoodenbox,
                woodenBoxCount: createPackagingListDto.woodenBoxCount || null,
                woodenBoxList: createPackagingListDto.woodenBoxList || null,
                boxLocationList: createPackagingListDto.boxLocationList || null,
            },
            include: {
                invoice: true,
            },
        });
    }

    async findAll(query: QueryPackagingListDto) {
        const { page = 1, limit = 10, search, invoiceId } = query;
        const skip = (page - 1) * limit;

        // Build where clause
        const where: Prisma.PackagingListWhereInput = {
            deletedAt: null, // Only get non-deleted packaging lists
        };

        // Add search filter if provided
        if (search) {
            where.OR = [
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

        // Get total count for pagination
        const total = await this.prisma.packagingList.count({ where });

        // Get paginated results
        const packagingLists = await this.prisma.packagingList.findMany({
            where,
            include: {
                invoice: true,
            },
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
        });

        return {
            data: packagingLists,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: number) {
        const packagingList = await this.prisma.packagingList.findFirst({
            where: {
                id,
                deletedAt: null, // Only get non-deleted packaging list
            },
            include: {
                invoice: true,
            },
        });

        if (!packagingList) {
            throw new NotFoundException('Packaging list not found');
        }

        return packagingList;
    }

    async update(id: number, updatePackagingListDto: UpdatePackagingListDto) {
        // Check if packaging list exists
        const existingPackagingList = await this.findOne(id);
        if (!existingPackagingList) {
            throw new NotFoundException('Packaging list not found');
        }

        // Validate invoice if being updated
        if (updatePackagingListDto.invoiceId) {
            const invoice = await this.prisma.invoice.findFirst({
                where: { id: updatePackagingListDto.invoiceId, deletedAt: null },
            });
            if (!invoice) {
                throw new BadRequestException('Invoice not found');
            }
        }

        // Validate products in group if provided
        if (updatePackagingListDto.group) {
            for (const groupItem of updatePackagingListDto.group) {
                if (groupItem.productId) {
                    const product = await this.prisma.product.findFirst({
                        where: { id: groupItem.productId, deletedAt: null },
                    });
                    if (!product) {
                        throw new BadRequestException(`Product with ID ${groupItem.productId} not found`);
                    }
                }
                if (groupItem.packageTypeId) {
                    const packageType = await this.prisma.packageType.findFirst({
                        where: { id: groupItem.packageTypeId, deletedAt: null },
                    });
                    if (!packageType) {
                        throw new BadRequestException(`Package Type with ID ${groupItem.packageTypeId} not found`);
                    }
                }
            }
        }

        return this.prisma.packagingList.update({
            where: { id },
            data: updatePackagingListDto,
            include: {
                invoice: true,
            },
        });
    }

    async remove(id: number) {
        // Check if packaging list exists
        const existingPackagingList = await this.findOne(id);
        if (!existingPackagingList) {
            throw new NotFoundException('Packaging list not found');
        }

        // Soft delete by setting deletedAt
        return this.prisma.packagingList.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            },
        });
    }
}
