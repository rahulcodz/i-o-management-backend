import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { QueryMaterialDto } from './dto/query-material.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class MaterialService {
    constructor(private prisma: PrismaService) { }

    async create(createMaterialDto: CreateMaterialDto) {
        // If setting as default, unset other defaults
        if (createMaterialDto.markAsDefault) {
            await this.prisma.material.updateMany({
                where: {
                    markAsDefault: true,
                    deletedAt: null,
                },
                data: {
                    markAsDefault: false,
                },
            });
        }

        return this.prisma.material.create({
            data: {
                materialName: createMaterialDto.materialName,
                markAsDefault: createMaterialDto.markAsDefault || false,
            },
        });
    }

    async findAll(query: QueryMaterialDto) {
        const { page = 1, limit = 10, search } = query;
        const skip = (page - 1) * limit;

        // Build where clause
        const where: Prisma.MaterialWhereInput = {
            deletedAt: null, // Only get non-deleted materials
        };

        // Add search filter if provided
        if (search) {
            where.materialName = {
                contains: search,
                mode: 'insensitive',
            };
        }

        // Get total count for pagination
        const total = await this.prisma.material.count({ where });

        // Get paginated results
        const materials = await this.prisma.material.findMany({
            where,
            skip,
            take: limit,
            orderBy: [
                { markAsDefault: 'desc' }, // Default materials first
                { createdAt: 'desc' },
            ],
        });

        return {
            data: materials,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: number) {
        const material = await this.prisma.material.findFirst({
            where: {
                id,
                deletedAt: null, // Only get non-deleted material
            },
        });

        if (!material) {
            throw new NotFoundException('Material not found');
        }

        return material;
    }

    async update(id: number, updateMaterialDto: UpdateMaterialDto) {
        // Check if material exists
        const existingMaterial = await this.findOne(id);
        if (!existingMaterial) {
            throw new NotFoundException('Material not found');
        }

        // If setting as default, unset other defaults
        if (updateMaterialDto.markAsDefault === true) {
            await this.prisma.material.updateMany({
                where: {
                    markAsDefault: true,
                    deletedAt: null,
                    id: { not: id }, // Exclude current material
                },
                data: {
                    markAsDefault: false,
                },
            });
        }

        return this.prisma.material.update({
            where: { id },
            data: updateMaterialDto,
        });
    }

    async remove(id: number) {
        // Check if material exists
        const existingMaterial = await this.findOne(id);
        if (!existingMaterial) {
            throw new NotFoundException('Material not found');
        }

        // Soft delete by setting deletedAt
        return this.prisma.material.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            },
        });
    }
}
