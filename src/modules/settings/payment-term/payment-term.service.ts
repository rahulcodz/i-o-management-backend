import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreatePaymentTermDto } from './dto/create-payment-term.dto';
import { UpdatePaymentTermDto } from './dto/update-payment-term.dto';
import { QueryPaymentTermDto } from './dto/query-payment-term.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PaymentTermService {
    constructor(private prisma: PrismaService) { }

    async create(createPaymentTermDto: CreatePaymentTermDto) {
        // If setting as default, unset other defaults
        if (createPaymentTermDto.markAsDefault) {
            await this.prisma.paymentTerm.updateMany({
                where: {
                    markAsDefault: true,
                    deletedAt: null,
                },
                data: {
                    markAsDefault: false,
                },
            });
        }

        return this.prisma.paymentTerm.create({
            data: {
                name: createPaymentTermDto.name,
                term: createPaymentTermDto.term,
                markAsDefault: createPaymentTermDto.markAsDefault || false,
            },
        });
    }

    async findAll(query: QueryPaymentTermDto) {
        const { page = 1, limit = 10, search } = query;
        const skip = (page - 1) * limit;

        // Build where clause
        const where: Prisma.PaymentTermWhereInput = {
            deletedAt: null, // Only get non-deleted payment terms
        };

        // Add search filter if provided
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { term: { contains: search, mode: 'insensitive' } },
            ];
        }

        // Get total count for pagination
        const total = await this.prisma.paymentTerm.count({ where });

        // Get paginated results
        const paymentTerms = await this.prisma.paymentTerm.findMany({
            where,
            skip,
            take: limit,
            orderBy: [
                { markAsDefault: 'desc' }, // Default payment terms first
                { createdAt: 'desc' },
            ],
        });

        return {
            data: paymentTerms,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: number) {
        const paymentTerm = await this.prisma.paymentTerm.findFirst({
            where: {
                id,
                deletedAt: null, // Only get non-deleted payment term
            },
        });

        if (!paymentTerm) {
            throw new NotFoundException('Payment term not found');
        }

        return paymentTerm;
    }

    async update(id: number, updatePaymentTermDto: UpdatePaymentTermDto) {
        // Check if payment term exists
        const existingPaymentTerm = await this.findOne(id);
        if (!existingPaymentTerm) {
            throw new NotFoundException('Payment term not found');
        }

        // If setting as default, unset other defaults
        if (updatePaymentTermDto.markAsDefault === true) {
            await this.prisma.paymentTerm.updateMany({
                where: {
                    markAsDefault: true,
                    deletedAt: null,
                    id: { not: id }, // Exclude current payment term
                },
                data: {
                    markAsDefault: false,
                },
            });
        }

        return this.prisma.paymentTerm.update({
            where: { id },
            data: updatePaymentTermDto,
        });
    }

    async remove(id: number) {
        // Check if payment term exists
        const existingPaymentTerm = await this.findOne(id);
        if (!existingPaymentTerm) {
            throw new NotFoundException('Payment term not found');
        }

        // Soft delete by setting deletedAt
        return this.prisma.paymentTerm.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            },
        });
    }
}
