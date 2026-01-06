import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateShipmentTermDto } from './dto/create-shipment-term.dto';
import { UpdateShipmentTermDto } from './dto/update-shipment-term.dto';
import { QueryShipmentTermDto } from './dto/query-shipment-term.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ShipmentTermService {
    constructor(private prisma: PrismaService) { }

    async create(createShipmentTermDto: CreateShipmentTermDto) {
        // If setting as default, unset other defaults
        if (createShipmentTermDto.markAsDefault) {
            await this.prisma.shipmentTerm.updateMany({
                where: {
                    markAsDefault: true,
                    deletedAt: null,
                },
                data: {
                    markAsDefault: false,
                },
            });
        }

        return this.prisma.shipmentTerm.create({
            data: {
                name: createShipmentTermDto.name,
                term: createShipmentTermDto.term,
                markAsDefault: createShipmentTermDto.markAsDefault || false,
            },
        });
    }

    async findAll(query: QueryShipmentTermDto) {
        const { page = 1, limit = 10, search } = query;
        const skip = (page - 1) * limit;

        // Build where clause
        const where: Prisma.ShipmentTermWhereInput = {
            deletedAt: null, // Only get non-deleted shipment terms
        };

        // Add search filter if provided
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { term: { contains: search, mode: 'insensitive' } },
            ];
        }

        // Get total count for pagination
        const total = await this.prisma.shipmentTerm.count({ where });

        // Get paginated results
        const shipmentTerms = await this.prisma.shipmentTerm.findMany({
            where,
            skip,
            take: limit,
            orderBy: [
                { markAsDefault: 'desc' }, // Default shipment terms first
                { createdAt: 'desc' },
            ],
        });

        return {
            data: shipmentTerms,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: number) {
        const shipmentTerm = await this.prisma.shipmentTerm.findFirst({
            where: {
                id,
                deletedAt: null, // Only get non-deleted shipment term
            },
        });

        if (!shipmentTerm) {
            throw new NotFoundException('Shipment term not found');
        }

        return shipmentTerm;
    }

    async update(id: number, updateShipmentTermDto: UpdateShipmentTermDto) {
        // Check if shipment term exists
        const existingShipmentTerm = await this.findOne(id);
        if (!existingShipmentTerm) {
            throw new NotFoundException('Shipment term not found');
        }

        // If setting as default, unset other defaults
        if (updateShipmentTermDto.markAsDefault === true) {
            await this.prisma.shipmentTerm.updateMany({
                where: {
                    markAsDefault: true,
                    deletedAt: null,
                    id: { not: id }, // Exclude current shipment term
                },
                data: {
                    markAsDefault: false,
                },
            });
        }

        return this.prisma.shipmentTerm.update({
            where: { id },
            data: updateShipmentTermDto,
        });
    }

    async remove(id: number) {
        // Check if shipment term exists
        const existingShipmentTerm = await this.findOne(id);
        if (!existingShipmentTerm) {
            throw new NotFoundException('Shipment term not found');
        }

        // Soft delete by setting deletedAt
        return this.prisma.shipmentTerm.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            },
        });
    }
}
