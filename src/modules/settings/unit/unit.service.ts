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
        // Bootstrap: if no default unit exists yet, force this one to be default
        const existingDefault = await this.prisma.unit.findFirst({
            where: { is_default: true, deletedAt: null },
            select: { id: true },
        });

        let is_default = !!createUnitDto.is_default;
        if (!existingDefault) {
            is_default = true;
        }

        // If setting as default, unset other defaults
        if (is_default) {
            await this.prisma.unit.updateMany({
                where: {
                    is_default: true,
                    deletedAt: null,
                },
                data: {
                    is_default: false,
                },
            });
        }

        const createData: any = {
            code: createUnitDto.code,
            unitName: createUnitDto.unitName,
            is_default,
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
            where.unitName = {
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
                { is_default: 'desc' }, // Default units first
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
        if (updateUnitDto.is_default === true) {
            await this.prisma.unit.updateMany({
                where: {
                    is_default: true,
                    deletedAt: null,
                    id: { not: id }, // Exclude current unit
                },
                data: {
                    is_default: false,
                },
            });
        }

        // Prevent removing the only default: if unsetting default on the sole default, ignore
        if (updateUnitDto.is_default === false && existingUnit.is_default === true) {
            const otherDefault = await this.prisma.unit.findFirst({
                where: { is_default: true, deletedAt: null, id: { not: id } },
                select: { id: true },
            });
            if (!otherDefault) {
                throw new NotFoundException('Cannot unset the only default unit — mark another as default first');
            }
        }

        const updateData: any = {};

        if (updateUnitDto.code !== undefined) {
            updateData.code = updateUnitDto.code;
        }

        if (updateUnitDto.unitName !== undefined) {
            updateData.unitName = updateUnitDto.unitName;
        }

        if (updateUnitDto.is_default !== undefined) {
            updateData.is_default = updateUnitDto.is_default;
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
