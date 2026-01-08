import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { QueryUnitDto } from './dto/query-unit.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class UnitService {
    constructor(private prisma: PrismaService) { }

    async create(createUnitDto: CreateUnitDto) {
        // If setting as default, unset other defaults
        if (createUnitDto.default) {
            await this.prisma.unit.updateMany({
                where: {
                    default: true,
                    deletedAt: null,
                },
                data: {
                    default: false,
                },
            });
        }

        const createData: any = {
            orderUnit: createUnitDto.orderUnit,
            default: createUnitDto.default,
        };
        
        if (createUnitDto.advanced) {
            createData.advanced = createUnitDto.advanced;
        }

        return this.prisma.unit.create({
            data: createData,
        });
    }

    async findAll(query: QueryUnitDto) {
        const { page = 1, limit = 10, search } = query;
        const skip = (page - 1) * limit;

        // Build where clause
        const where: Prisma.UnitWhereInput = {
            deletedAt: null, // Only get non-deleted units
        };

        // Add search filter if provided
        if (search) {
            where.orderUnit = {
                contains: search,
                mode: 'insensitive',
            };
        }

        // Get total count for pagination
        const total = await this.prisma.unit.count({ where });

        // Get paginated results
        const units = await this.prisma.unit.findMany({
            where,
            skip,
            take: limit,
            orderBy: [
                { default: 'desc' }, // Default units first
                { createdAt: 'desc' },
            ],
        });

        return {
            data: units,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: number) {
        const unit = await this.prisma.unit.findFirst({
            where: {
                id,
                deletedAt: null, // Only get non-deleted unit
            },
        });

        if (!unit) {
            throw new NotFoundException('Unit not found');
        }

        return unit;
    }

    async update(id: number, updateUnitDto: UpdateUnitDto) {
        // Check if unit exists
        const existingUnit = await this.findOne(id);
        if (!existingUnit) {
            throw new NotFoundException('Unit not found');
        }

        // If setting as default, unset other defaults
        if (updateUnitDto.default === true) {
            await this.prisma.unit.updateMany({
                where: {
                    default: true,
                    deletedAt: null,
                    id: { not: id }, // Exclude current unit
                },
                data: {
                    default: false,
                },
            });
        }

        const updateData: any = {};
        
        if (updateUnitDto.orderUnit !== undefined) {
            updateData.orderUnit = updateUnitDto.orderUnit;
        }
        
        if (updateUnitDto.default !== undefined) {
            updateData.default = updateUnitDto.default;
        }
        
        if (updateUnitDto.advanced !== undefined) {
            if (updateUnitDto.advanced) {
                updateData.advanced = updateUnitDto.advanced;
            } else {
                updateData.advanced = Prisma.JsonNull;
            }
        }

        return this.prisma.unit.update({
            where: { id },
            data: updateData,
        });
    }

    async remove(id: number) {
        // Check if unit exists
        const existingUnit = await this.findOne(id);
        if (!existingUnit) {
            throw new NotFoundException('Unit not found');
        }

        // Soft delete by setting deletedAt
        return this.prisma.unit.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            },
        });
    }
}
