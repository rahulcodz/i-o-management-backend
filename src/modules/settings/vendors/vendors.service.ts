import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { QueryVendorDto } from './dto/query-vendor.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class VendorsService {
    constructor(private prisma: PrismaService) { }

    async create(createVendorDto: CreateVendorDto) {
        return this.prisma.vendor.create({
            data: createVendorDto,
        });
    }

    async findAll(query: QueryVendorDto) {
        const { page = 1, limit = 10, search } = query;
        const skip = (page - 1) * limit;

        // Build where clause
        const where: Prisma.VendorWhereInput = {
            deletedAt: null, // Only get non-deleted vendors
        };

        // Add search filter if provided
        if (search) {
            where.OR = [
                { category: { contains: search, mode: 'insensitive' } },
                { name: { contains: search, mode: 'insensitive' } },
                { gstin: { contains: search, mode: 'insensitive' } },
                { state: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
            ];
        }

        // Get total count for pagination
        const total = await this.prisma.vendor.count({ where });

        // Get paginated results
        const vendors = await this.prisma.vendor.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
        });

        return {
            data: vendors,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: number) {
        const vendor = await this.prisma.vendor.findFirst({
            where: {
                id,
                deletedAt: null, // Only get non-deleted vendor
            },
        });

        if (!vendor) {
            throw new NotFoundException('Vendor not found');
        }

        return vendor;
    }

    async update(id: number, updateVendorDto: UpdateVendorDto) {
        // Check if vendor exists
        const existingVendor = await this.findOne(id);
        if (!existingVendor) {
            throw new NotFoundException('Vendor not found');
        }

        return this.prisma.vendor.update({
            where: { id },
            data: updateVendorDto,
        });
    }

    async remove(id: number) {
        // Check if vendor exists
        const existingVendor = await this.findOne(id);
        if (!existingVendor) {
            throw new NotFoundException('Vendor not found');
        }

        // Soft delete by setting deletedAt
        return this.prisma.vendor.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            },
        });
    }
}
