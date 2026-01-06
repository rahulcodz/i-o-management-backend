import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreatePortDto } from './dto/create-port.dto';
import { UpdatePortDto } from './dto/update-port.dto';
import { QueryPortDto } from './dto/query-port.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PortService {
    constructor(private prisma: PrismaService) { }

    async create(createPortDto: CreatePortDto) {
        return this.prisma.port.create({
            data: createPortDto,
        });
    }

    async findAll(query: QueryPortDto) {
        const { page = 1, limit = 10, search } = query;
        const skip = (page - 1) * limit;

        // Build where clause
        const where: Prisma.PortWhereInput = {
            deletedAt: null, // Only get non-deleted ports
        };

        // Add search filter if provided
        if (search) {
            where.OR = [
                { country: { contains: search, mode: 'insensitive' } },
                { portName: { contains: search, mode: 'insensitive' } },
                { portCode: { contains: search, mode: 'insensitive' } },
            ];
        }

        // Get total count for pagination
        const total = await this.prisma.port.count({ where });

        // Get paginated results
        const ports = await this.prisma.port.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
        });

        return {
            data: ports,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: number) {
        const port = await this.prisma.port.findFirst({
            where: {
                id,
                deletedAt: null, // Only get non-deleted port
            },
        });

        if (!port) {
            throw new NotFoundException('Port not found');
        }

        return port;
    }

    async update(id: number, updatePortDto: UpdatePortDto) {
        // Check if port exists
        const existingPort = await this.findOne(id);
        if (!existingPort) {
            throw new NotFoundException('Port not found');
        }

        return this.prisma.port.update({
            where: { id },
            data: updatePortDto,
        });
    }

    async remove(id: number) {
        // Check if port exists
        const existingPort = await this.findOne(id);
        if (!existingPort) {
            throw new NotFoundException('Port not found');
        }

        // Soft delete by setting deletedAt
        return this.prisma.port.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            },
        });
    }
}
