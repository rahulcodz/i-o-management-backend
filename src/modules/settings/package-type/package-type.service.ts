import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreatePackageTypeDto } from './dto/create-package-type.dto';
import { UpdatePackageTypeDto } from './dto/update-package-type.dto';
import { QueryPackageTypeDto } from './dto/query-package-type.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PackageTypeService {
    constructor(private prisma: PrismaService) { }

    async create(createPackageTypeDto: CreatePackageTypeDto) {
        // Bootstrap: if no default exists, force this one to be default
        const existingDefault = await this.prisma.packageType.findFirst({
            where: { is_default: true, deletedAt: null },
            select: { id: true },
        });

        let is_default = !!createPackageTypeDto.is_default;
        if (!existingDefault) {
            is_default = true;
        }

        // If setting as default, unset other defaults
        if (is_default) {
            await this.prisma.packageType.updateMany({
                where: {
                    is_default: true,
                    deletedAt: null,
                },
                data: {
                    is_default: false,
                },
            });
        }

        return this.prisma.packageType.create({
            data: {
                code: createPackageTypeDto.code,
                unitName: createPackageTypeDto.unitName,
                is_default,
            },
        });
    }

    async findAll(query: QueryPackageTypeDto) {
        const { page = 1, limit = 10, search } = query;
        const skip = (page - 1) * limit;

        // Build where clause
        const where: Prisma.PackageTypeWhereInput = {
            deletedAt: null, // Only get non-deleted package types
        };

        // Add search filter if provided
        if (search) {
            where.unitName = {
                contains: search,
                mode: 'insensitive',
            };
        }

        // Get total count for pagination
        const total = await this.prisma.packageType.count({ where });

        // Get paginated results
        const packageTypes = await this.prisma.packageType.findMany({
            where,
            skip,
            take: limit,
            orderBy: [
                { is_default: 'desc' }, // Default package types first
                { createdAt: 'desc' },
            ],
        });

        return {
            data: packageTypes,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: number) {
        const packageType = await this.prisma.packageType.findFirst({
            where: {
                id,
                deletedAt: null, // Only get non-deleted package type
            },
        });

        if (!packageType) {
            throw new NotFoundException('Package type not found');
        }

        return packageType;
    }

    async update(id: number, updatePackageTypeDto: UpdatePackageTypeDto) {
        // Check if package type exists
        const existingPackageType = await this.findOne(id);
        if (!existingPackageType) {
            throw new NotFoundException('Package type not found');
        }

        // If setting as default, unset other defaults
        if (updatePackageTypeDto.is_default === true) {
            await this.prisma.packageType.updateMany({
                where: {
                    is_default: true,
                    deletedAt: null,
                    id: { not: id }, // Exclude current package type
                },
                data: {
                    is_default: false,
                },
            });
        }

        // Prevent removing the only default
        if (updatePackageTypeDto.is_default === false && existingPackageType.is_default === true) {
            const otherDefault = await this.prisma.packageType.findFirst({
                where: { is_default: true, deletedAt: null, id: { not: id } },
                select: { id: true },
            });
            if (!otherDefault) {
                throw new NotFoundException('Cannot unset the only default package type — mark another as default first');
            }
        }

        return this.prisma.packageType.update({
            where: { id },
            data: updatePackageTypeDto,
        });
    }

    async remove(id: number) {
        // Check if package type exists
        const existingPackageType = await this.findOne(id);
        if (!existingPackageType) {
            throw new NotFoundException('Package type not found');
        }

        // Soft delete by setting deletedAt
        return this.prisma.packageType.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            },
        });
    }
}
