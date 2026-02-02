import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductLabelParameterDto } from './dto/create-product-label-parameter.dto';
import { UpdateProductLabelParameterDto } from './dto/update-product-label-parameter.dto';
import { QueryProductLabelParameterDto } from './dto/query-product-label-parameter.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductLabelParameterService {
    constructor(private prisma: PrismaService) { }

    async create(createProductLabelParameterDto: CreateProductLabelParameterDto) {
        return this.prisma.productLabelParameter.create({
            data: createProductLabelParameterDto,
        });
    }

    async findAll(query: QueryProductLabelParameterDto) {
        const { page = 1, limit = 10, search } = query;
        const skip = (page - 1) * limit;

        // Build where clause
        const where: Prisma.ProductLabelParameterWhereInput = {
            deletedAt: null, // Only get non-deleted parameters
        };

        // Add search filter if provided
        if (search) {
            where.parameterName = {
                contains: search,
                mode: 'insensitive',
            };
        }

        // Get total count for pagination
        const total = await this.prisma.productLabelParameter.count({ where });

        // Get paginated results
        const parameters = await this.prisma.productLabelParameter.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
        });

        return {
            data: parameters,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: number) {
        const parameter = await this.prisma.productLabelParameter.findFirst({
            where: {
                id,
                deletedAt: null, // Only get non-deleted parameter
            },
        });

        if (!parameter) {
            throw new NotFoundException('Product label parameter not found');
        }

        return parameter;
    }

    async update(id: number, updateProductLabelParameterDto: UpdateProductLabelParameterDto) {
        // Check if parameter exists
        const existingParameter = await this.findOne(id);
        if (!existingParameter) {
            throw new NotFoundException('Product label parameter not found');
        }

        return this.prisma.productLabelParameter.update({
            where: { id },
            data: updateProductLabelParameterDto,
        });
    }

    async remove(id: number) {
        // Check if parameter exists
        const existingParameter = await this.findOne(id);
        if (!existingParameter) {
            throw new NotFoundException('Product label parameter not found');
        }

        // Soft delete by setting deletedAt
        return this.prisma.productLabelParameter.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            },
        });
    }
}
