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

        return this.prisma.product.create({
            data: createProductDto,
            include: {
                unit: false,
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

        // Add search filter if provided (search by unit's orderUnit)
        if (search) {
            where.unit = {
                ...where.unit,
                orderUnit: {
                    contains: search,
                    mode: 'insensitive',
                } as any, // Fix for Prisma filter type mismatch; orderUnit is a string field
            };
        }

        // Get total count for pagination
        const total = await this.prisma.product.count({ where });

        // Get paginated results
        const products = await this.prisma.product.findMany({
            where,
            include: {
                unit: false,
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

        return this.prisma.product.update({
            where: { id },
            data: updateProductDto,
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
