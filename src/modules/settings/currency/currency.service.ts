import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';
import { QueryCurrencyDto } from './dto/query-currency.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CurrencyService {
    constructor(private prisma: PrismaService) { }

    async create(createCurrencyDto: CreateCurrencyDto) {
        // If setting as default, unset other defaults
        if (createCurrencyDto.markAsDefault) {
            await this.prisma.currency.updateMany({
                where: {
                    markAsDefault: true,
                    deletedAt: null,
                },
                data: {
                    markAsDefault: false,
                },
            });
        }

        return this.prisma.currency.create({
            data: {
                currencyName: createCurrencyDto.currencyName,
                symbol: createCurrencyDto.symbol,
                words: createCurrencyDto.words,
                markAsDefault: createCurrencyDto.markAsDefault || false,
            },
        });
    }

    async findAll(query: QueryCurrencyDto) {
        const { page = 1, limit = 10, search } = query;
        const skip = (page - 1) * limit;

        // Build where clause
        const where: Prisma.CurrencyWhereInput = {
            deletedAt: null, // Only get non-deleted currencies
        };

        // Add search filter if provided
        if (search) {
            where.OR = [
                { currencyName: { contains: search, mode: 'insensitive' } },
                { symbol: { contains: search, mode: 'insensitive' } },
                { words: { contains: search, mode: 'insensitive' } },
            ];
        }

        // Get total count for pagination
        const total = await this.prisma.currency.count({ where });

        // Get paginated results
        const currencies = await this.prisma.currency.findMany({
            where,
            skip,
            take: limit,
            orderBy: [
                { markAsDefault: 'desc' }, // Default currencies first
                { createdAt: 'desc' },
            ],
        });

        return {
            data: currencies,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: number) {
        const currency = await this.prisma.currency.findFirst({
            where: {
                id,
                deletedAt: null, // Only get non-deleted currency
            },
        });

        if (!currency) {
            throw new NotFoundException('Currency not found');
        }

        return currency;
    }

    async update(id: number, updateCurrencyDto: UpdateCurrencyDto) {
        // Check if currency exists
        const existingCurrency = await this.findOne(id);
        if (!existingCurrency) {
            throw new NotFoundException('Currency not found');
        }

        // If setting as default, unset other defaults
        if (updateCurrencyDto.markAsDefault === true) {
            await this.prisma.currency.updateMany({
                where: {
                    markAsDefault: true,
                    deletedAt: null,
                    id: { not: id }, // Exclude current currency
                },
                data: {
                    markAsDefault: false,
                },
            });
        }

        return this.prisma.currency.update({
            where: { id },
            data: updateCurrencyDto,
        });
    }

    async remove(id: number) {
        // Check if currency exists
        const existingCurrency = await this.findOne(id);
        if (!existingCurrency) {
            throw new NotFoundException('Currency not found');
        }

        // Soft delete by setting deletedAt
        return this.prisma.currency.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            },
        });
    }
}
