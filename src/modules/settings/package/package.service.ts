import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { QueryPackageDto } from './dto/query-package.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PackageService {
    constructor(private prisma: PrismaService) { }

    async create(createPackageDto: CreatePackageDto) {
        // Verify unit exists and is not deleted
        const unit = await this.prisma.unit.findFirst({
            where: {
                id: createPackageDto.unitId,
                deletedAt: null,
            },
        });

        if (!unit) {
            throw new BadRequestException('Unit not found or has been deleted');
        }

        // Create package with only the required fields
        const packageItem = await this.prisma.product.create({
            data: {
                unitId: createPackageDto.unitId,
                netWeight: createPackageDto.netWeight,
                grossWeight: createPackageDto.grossWeight,
            },
            include: {
                unit: true,
            },
        });

        // Return only the relevant fields
        return {
            success: true,
            message: 'Package created successfully',
            data: {
                id: packageItem.id,
                unitId: packageItem.unitId,
                netWeight: packageItem.netWeight,
                grossWeight: packageItem.grossWeight,
                unit: packageItem.unit,
                createdAt: packageItem.createdAt,
                updatedAt: packageItem.updatedAt,
            },
        };
    }

    async findAll(query: QueryPackageDto) {
        const { page = 1, limit = 10, search } = query;
        const skip = (page - 1) * limit;

        // Build where clause
        const where: Prisma.ProductWhereInput = {
            deletedAt: null, // Only get non-deleted packages
            unit: {
                deletedAt: null, // Only get packages with non-deleted units
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
        const packages = await this.prisma.product.findMany({
            where,
            include: {
                unit: true,
            },
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
        });

        // Map packages to return only relevant fields
        const mappedPackages = packages.map((pkg) => ({
            id: pkg.id,
            unitId: pkg.unitId,
            netWeight: pkg.netWeight,
            grossWeight: pkg.grossWeight,
            unit: pkg.unit,
            createdAt: pkg.createdAt,
            updatedAt: pkg.updatedAt,
        }));

        return {
            success: true,
            data: mappedPackages,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: number) {
        const packageItem = await this.prisma.product.findFirst({
            where: {
                id,
                deletedAt: null, // Only get non-deleted package
                unit: {
                    deletedAt: null, // Only get package with non-deleted unit
                },
            },
            include: {
                unit: true,
            },
        });

        if (!packageItem) {
            throw new NotFoundException('Package not found');
        }

        // Return only the relevant fields
        return {
            success: true,
            data: {
                id: packageItem.id,
                unitId: packageItem.unitId,
                netWeight: packageItem.netWeight,
                grossWeight: packageItem.grossWeight,
                unit: packageItem.unit,
                createdAt: packageItem.createdAt,
                updatedAt: packageItem.updatedAt,
            },
        };
    }

    async update(id: number, updatePackageDto: UpdatePackageDto) {
        // Check if package exists
        const existingPackage = await this.prisma.product.findFirst({
            where: {
                id,
                deletedAt: null,
            },
        });

        if (!existingPackage) {
            throw new NotFoundException('Package not found');
        }

        // If unitId is being updated, verify the new unit exists
        if (updatePackageDto.unitId) {
            const unit = await this.prisma.unit.findFirst({
                where: {
                    id: updatePackageDto.unitId,
                    deletedAt: null,
                },
            });

            if (!unit) {
                throw new BadRequestException('Unit not found or has been deleted');
            }
        }

        // Build update data object with only provided fields
        const updateData: any = {};
        if (updatePackageDto.unitId !== undefined) {
            updateData.unitId = updatePackageDto.unitId;
        }
        if (updatePackageDto.netWeight !== undefined) {
            updateData.netWeight = updatePackageDto.netWeight;
        }
        if (updatePackageDto.grossWeight !== undefined) {
            updateData.grossWeight = updatePackageDto.grossWeight;
        }

        // Update only the allowed fields
        const updatedPackage = await this.prisma.product.update({
            where: { id },
            data: updateData,
            include: {
                unit: true,
            },
        });

        // Return only the relevant fields
        return {
            success: true,
            message: 'Package updated successfully',
            data: {
                id: updatedPackage.id,
                unitId: updatedPackage.unitId,
                netWeight: updatedPackage.netWeight,
                grossWeight: updatedPackage.grossWeight,
                unit: updatedPackage.unit,
                createdAt: updatedPackage.createdAt,
                updatedAt: updatedPackage.updatedAt,
            },
        };
    }

    async remove(id: number) {
        // Check if package exists
        const existingPackage = await this.prisma.product.findFirst({
            where: {
                id,
                deletedAt: null,
            },
        });

        if (!existingPackage) {
            throw new NotFoundException('Package not found');
        }

        // Soft delete by setting deletedAt
        await this.prisma.product.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            },
        });

        return {
            success: true,
            message: 'Package deleted successfully',
        };
    }
}
