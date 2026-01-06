import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateQualitySpeculationDto } from './dto/create-quality-speculation.dto';
import { UpdateQualitySpeculationDto } from './dto/update-quality-speculation.dto';
import { QueryQualitySpeculationDto } from './dto/query-quality-speculation.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class QualitySpeculationService {
    constructor(private prisma: PrismaService) { }

    async create(createQualitySpeculationDto: CreateQualitySpeculationDto) {
        return this.prisma.qualitySpeculation.create({
            data: {
                name: createQualitySpeculationDto.name,
                specification: createQualitySpeculationDto.specification,
            },
        });
    }

    async findAll(query: QueryQualitySpeculationDto) {
        const { page = 1, limit = 10, search } = query;
        const skip = (page - 1) * limit;

        // Build where clause
        const where: Prisma.QualitySpeculationWhereInput = {
            deletedAt: null, // Only get non-deleted quality speculations
        };

        // Add search filter if provided
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { specification: { contains: search, mode: 'insensitive' } },
            ];
        }

        // Get total count for pagination
        const total = await this.prisma.qualitySpeculation.count({ where });

        // Get paginated results
        const qualitySpeculations = await this.prisma.qualitySpeculation.findMany({
            where,
            skip,
            take: limit,
            orderBy: {
                createdAt: 'desc',
            },
        });

        return {
            data: qualitySpeculations,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: number) {
        const qualitySpeculation = await this.prisma.qualitySpeculation.findFirst({
            where: {
                id,
                deletedAt: null, // Only get non-deleted quality speculation
            },
        });

        if (!qualitySpeculation) {
            throw new NotFoundException('Quality speculation not found');
        }

        return qualitySpeculation;
    }

    async update(id: number, updateQualitySpeculationDto: UpdateQualitySpeculationDto) {
        // Check if quality speculation exists
        const existingQualitySpeculation = await this.findOne(id);
        if (!existingQualitySpeculation) {
            throw new NotFoundException('Quality speculation not found');
        }

        return this.prisma.qualitySpeculation.update({
            where: { id },
            data: updateQualitySpeculationDto,
        });
    }

    async remove(id: number) {
        // Check if quality speculation exists
        const existingQualitySpeculation = await this.findOne(id);
        if (!existingQualitySpeculation) {
            throw new NotFoundException('Quality speculation not found');
        }

        // Soft delete by setting deletedAt
        return this.prisma.qualitySpeculation.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            },
        });
    }
}
