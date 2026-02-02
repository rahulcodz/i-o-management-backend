import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCOAParameterDto } from './dto/parameter/create-coa-parameter.dto';
import { UpdateCOAParameterDto } from './dto/parameter/update-coa-parameter.dto';
import { QueryCOAParameterDto } from './dto/parameter/query-coa-parameter.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class COAParameterService {
    constructor(private prisma: PrismaService) { }

    async create(createCOAParameterDto: CreateCOAParameterDto) {
        return this.prisma.cOAParameter.create({
            data: createCOAParameterDto,
        });
    }

    async findAll(query: QueryCOAParameterDto) {
        const { page = 1, limit = 10, search } = query;
        const skip = (page - 1) * limit;

        // Build where clause
        const where: Prisma.COAParameterWhereInput = {
            deletedAt: null, // Only get non-deleted parameters
        };

        // Add search filter if provided
        if (search) {
            where.name = {
                contains: search,
                mode: 'insensitive',
            };
        }

        // Get total count for pagination
        const total = await this.prisma.cOAParameter.count({ where });

        // Get paginated results
        const parameters = await this.prisma.cOAParameter.findMany({
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
        const parameter = await this.prisma.cOAParameter.findFirst({
            where: {
                id,
                deletedAt: null, // Only get non-deleted parameter
            },
        });

        if (!parameter) {
            throw new NotFoundException('COA parameter not found');
        }

        return parameter;
    }

    async update(id: number, updateCOAParameterDto: UpdateCOAParameterDto) {
        // Check if parameter exists
        const existingParameter = await this.findOne(id);
        if (!existingParameter) {
            throw new NotFoundException('COA parameter not found');
        }

        return this.prisma.cOAParameter.update({
            where: { id },
            data: updateCOAParameterDto,
        });
    }

    async remove(id: number) {
        // Check if parameter exists
        const existingParameter = await this.findOne(id);
        if (!existingParameter) {
            throw new NotFoundException('COA parameter not found');
        }

        // Soft delete by setting deletedAt
        return this.prisma.cOAParameter.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            },
        });
    }
}
