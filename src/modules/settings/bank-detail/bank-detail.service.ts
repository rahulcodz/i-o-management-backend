import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateBankDetailDto } from './dto/create-bank-detail.dto';
import { UpdateBankDetailDto } from './dto/update-bank-detail.dto';
import { QueryBankDetailDto } from './dto/query-bank-detail.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class BankDetailService {
    constructor(private prisma: PrismaService) { }

    async create(createBankDetailDto: CreateBankDetailDto) {
        // If setting as default, unset other defaults
        if (createBankDetailDto.markAsDefault) {
            await this.prisma.bankDetail.updateMany({
                where: {
                    markAsDefault: true,
                    deletedAt: null,
                },
                data: {
                    markAsDefault: false,
                },
            });
        }

        return this.prisma.bankDetail.create({
            data: {
                bankName: createBankDetailDto.bankName,
                accountNo: createBankDetailDto.accountNo,
                swiftCode: createBankDetailDto.swiftCode,
                otherDetails: createBankDetailDto.otherDetails,
                ifscCode: createBankDetailDto.ifscCode,
                isVostroPayment: createBankDetailDto.isVostroPayment || 'N',
                beneficiaryName: createBankDetailDto.beneficiaryName,
                accountType: createBankDetailDto.accountType || 'CURRENT ACCOUNT',
                markAsDefault: createBankDetailDto.markAsDefault || false,
                adCode: createBankDetailDto.adCode,
                vostroType: createBankDetailDto.vostroType,
            },
        });
    }

    async findAll(query: QueryBankDetailDto) {
        const { page = 1, limit = 10, search } = query;
        const skip = (page - 1) * limit;

        // Build where clause
        const where: Prisma.BankDetailWhereInput = {
            deletedAt: null, // Only get non-deleted bank details
        };

        // Add search filter if provided
        if (search) {
            where.OR = [
                { bankName: { contains: search, mode: 'insensitive' } },
                { accountNo: { contains: search, mode: 'insensitive' } },
                { beneficiaryName: { contains: search, mode: 'insensitive' } },
                { swiftCode: { contains: search, mode: 'insensitive' } },
            ];
        }

        // Get total count for pagination
        const total = await this.prisma.bankDetail.count({ where });

        // Get paginated results
        const bankDetails = await this.prisma.bankDetail.findMany({
            where,
            skip,
            take: limit,
            orderBy: [
                { markAsDefault: 'desc' }, // Default bank details first
                { createdAt: 'desc' },
            ],
        });

        return {
            data: bankDetails,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: number) {
        const bankDetail = await this.prisma.bankDetail.findFirst({
            where: {
                id,
                deletedAt: null, // Only get non-deleted bank detail
            },
        });

        if (!bankDetail) {
            throw new NotFoundException('Bank detail not found');
        }

        return bankDetail;
    }

    async update(id: number, updateBankDetailDto: UpdateBankDetailDto) {
        // Check if bank detail exists
        const existingBankDetail = await this.findOne(id);
        if (!existingBankDetail) {
            throw new NotFoundException('Bank detail not found');
        }

        // If setting as default, unset other defaults
        if (updateBankDetailDto.markAsDefault === true) {
            await this.prisma.bankDetail.updateMany({
                where: {
                    markAsDefault: true,
                    deletedAt: null,
                    id: { not: id }, // Exclude current bank detail
                },
                data: {
                    markAsDefault: false,
                },
            });
        }

        return this.prisma.bankDetail.update({
            where: { id },
            data: updateBankDetailDto,
        });
    }

    async remove(id: number) {
        // Check if bank detail exists
        const existingBankDetail = await this.findOne(id);
        if (!existingBankDetail) {
            throw new NotFoundException('Bank detail not found');
        }

        // Soft delete by setting deletedAt
        return this.prisma.bankDetail.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            },
        });
    }
}
