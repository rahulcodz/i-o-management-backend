import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { QueryOrganizationDto } from './dto/query-organization.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class OrganizationService {
    constructor(private prisma: PrismaService) { }

    async create(createOrganizationDto: CreateOrganizationDto) {
        return this.prisma.organization.create({
            data: createOrganizationDto,
        });
    }

    async findAll(query: QueryOrganizationDto) {
        const { page = 1, limit = 10, search } = query;
        const skip = (page - 1) * limit;

        // Build where clause
        const where: Prisma.OrganizationWhereInput = {};

        // Add search filter if provided
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { phone: { contains: search, mode: 'insensitive' } },
            ];
        }

        // Get total count for pagination
        const total = await this.prisma.organization.count({ where });

        // Get paginated results
        const organizations = await this.prisma.organization.findMany({
            where,
            include: {
                users: {
                    include: {
                        role: true,
                    },
                },
            },
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
        });

        return {
            data: organizations,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: number) {
        return this.prisma.organization.findUnique({
            where: { id },
            include: {
                users: {
                    include: {
                        role: true,
                    },
                },
            },
        });
    }

    async update(id: number, updateOrganizationDto: UpdateOrganizationDto) {
        return this.prisma.organization.update({
            where: { id },
            data: updateOrganizationDto,
        });
    }

    async remove(id: number) {
        return this.prisma.organization.delete({ where: { id } });
    }
}
