import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductService {
    constructor(private prisma: PrismaService) { }

    async create(createProductDto: CreateProductDto) {
        // Verify unit exists and is not deleted
        const unit = await this.prisma.unit.findFirst({
            where: {
                id: createProductDto.unitId,
                deletedAt: null,
            },
        });

        if (!unit) {
            throw new BadRequestException('Unit not found or has been deleted');
        }

        // Prepare data for Prisma
        const data: any = {
            name: createProductDto.name,
            hsnSac: createProductDto.hsnSac,
            unitId: createProductDto.unitId,
            gst: createProductDto.gst ?? 0,
            description: createProductDto.description,
            image: createProductDto.image,
            inventoryType: createProductDto.inventoryType ?? 'Finished Goods',
            productTag: createProductDto.productTag,
            netWeight: createProductDto.netWeight,
            grossWeight: createProductDto.grossWeight,
            dimensionLength: createProductDto.dimensionLength,
            dimensionWidth: createProductDto.dimensionWidth,
            dimensionHeight: createProductDto.dimensionHeight,
            sellPrice: createProductDto.sellPrice,
        };

        // Convert arrays to JSON for Prisma
        if (createProductDto.variants && createProductDto.variants.length > 0) {
            data.variants = createProductDto.variants;
        }

        if (createProductDto.customFields && createProductDto.customFields.length > 0) {
            data.customFields = createProductDto.customFields;
        }

        if (createProductDto.schemes && createProductDto.schemes.length > 0) {
            data.schemes = createProductDto.schemes;
        }

        return this.prisma.product.create({
            data,
            include: {
                unit: true,
            },
        });
    }

    async findAll(query: QueryProductDto) {
        const { page = 1, limit = 10, search } = query;
        const skip = (page - 1) * limit;

        // Build where clause
        const where: Prisma.ProductWhereInput = {
            deletedAt: null, // Only get non-deleted products
            unit: {
                deletedAt: null, // Only get products with non-deleted units
            },
        };

        // Add search filter if provided
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { hsnSac: { contains: search, mode: 'insensitive' } },
                { productTag: { contains: search, mode: 'insensitive' } },
            ];
        }

        // Get total count for pagination
        const total = await this.prisma.product.count({ where });

        // Get paginated results
        const products = await this.prisma.product.findMany({
            where,
            include: {
                unit: true,
            },
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
        });

        return {
            data: products,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: number) {
        const product = await this.prisma.product.findFirst({
            where: {
                id,
                deletedAt: null, // Only get non-deleted product
                unit: {
                    deletedAt: null, // Only get product with non-deleted unit
                },
            },
            include: {
                unit: true,
            },
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        return product;
    }

    async update(id: number, updateProductDto: UpdateProductDto) {
        // Check if product exists
        const existingProduct = await this.findOne(id);
        if (!existingProduct) {
            throw new NotFoundException('Product not found');
        }

        // If unitId is being updated, verify the new unit exists
        if (updateProductDto.unitId) {
            const unit = await this.prisma.unit.findFirst({
                where: {
                    id: updateProductDto.unitId,
                    deletedAt: null,
                },
            });

            if (!unit) {
                throw new BadRequestException('Unit not found or has been deleted');
            }
        }

        // Prepare data for Prisma
        const data: any = {};

        // Update only provided fields
        if (updateProductDto.name !== undefined) data.name = updateProductDto.name;
        if (updateProductDto.gst !== undefined) data.gst = updateProductDto.gst;
        if (updateProductDto.description !== undefined) data.description = updateProductDto.description;
        if (updateProductDto.hsnSac !== undefined) data.hsnSac = updateProductDto.hsnSac;
        if (updateProductDto.image !== undefined) data.image = updateProductDto.image;
        if (updateProductDto.inventoryType !== undefined) data.inventoryType = updateProductDto.inventoryType;
        if (updateProductDto.productTag !== undefined) data.productTag = updateProductDto.productTag;
        if (updateProductDto.unitId !== undefined) data.unitId = updateProductDto.unitId;
        if (updateProductDto.netWeight !== undefined) data.netWeight = updateProductDto.netWeight;
        if (updateProductDto.grossWeight !== undefined) data.grossWeight = updateProductDto.grossWeight;
        if (updateProductDto.dimensionLength !== undefined) data.dimensionLength = updateProductDto.dimensionLength;
        if (updateProductDto.dimensionWidth !== undefined) data.dimensionWidth = updateProductDto.dimensionWidth;
        if (updateProductDto.dimensionHeight !== undefined) data.dimensionHeight = updateProductDto.dimensionHeight;
        if (updateProductDto.sellPrice !== undefined) data.sellPrice = updateProductDto.sellPrice;

        // Convert arrays to JSON for Prisma
        if (updateProductDto.variants !== undefined) {
            data.variants = updateProductDto.variants;
        }

        if (updateProductDto.customFields !== undefined) {
            data.customFields = updateProductDto.customFields;
        }

        if (updateProductDto.schemes !== undefined) {
            data.schemes = updateProductDto.schemes;
        }

        return this.prisma.product.update({
            where: { id },
            data,
            include: {
                unit: true,
            },
        });
    }

    async remove(id: number) {
        // Check if product exists
        const existingProduct = await this.findOne(id);
        if (!existingProduct) {
            throw new NotFoundException('Product not found');
        }

        // Soft delete by setting deletedAt
        return this.prisma.product.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            },
        });
    }
}
