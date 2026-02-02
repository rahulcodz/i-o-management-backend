import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCOASettingDto } from './dto/setting/create-coa-setting.dto';
import { UpdateCOASettingDto } from './dto/setting/update-coa-setting.dto';
import { QueryCOASettingDto } from './dto/setting/query-coa-setting.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class COASettingService {
    constructor(private prisma: PrismaService) { }

    async create(createCOASettingDto: CreateCOASettingDto) {
        // Validate product exists
        const product = await this.prisma.product.findFirst({
            where: { id: createCOASettingDto.productId, deletedAt: null },
        });
        if (!product) {
            throw new BadRequestException('Product not found');
        }

        return this.prisma.cOASetting.create({
            data: {
                productId: createCOASettingDto.productId,
                group: createCOASettingDto.group as any,
            },
            include: {
                product: true,
            },
        });
    }

    async findAll(query: QueryCOASettingDto) {
        const { page = 1, limit = 10, productId } = query;
        const skip = (page - 1) * limit;

        // Build where clause
        const where: Prisma.COASettingWhereInput = {
            deletedAt: null, // Only get non-deleted settings
        };

        // Add product filter if provided
        if (productId) {
            where.productId = productId;
        }

        // Get total count for pagination
        const total = await this.prisma.cOASetting.count({ where });

        // Get paginated results
        const settings = await this.prisma.cOASetting.findMany({
            where,
            include: {
                product: true,
            },
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
        });

        return {
            data: settings,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: number) {
        const setting = await this.prisma.cOASetting.findFirst({
            where: {
                id,
                deletedAt: null, // Only get non-deleted setting
            },
            include: {
                product: true,
            },
        });

        if (!setting) {
            throw new NotFoundException('COA setting not found');
        }

        return setting;
    }

    async update(id: number, updateCOASettingDto: UpdateCOASettingDto) {
        // Check if setting exists
        const existingSetting = await this.findOne(id);
        if (!existingSetting) {
            throw new NotFoundException('COA setting not found');
        }

        // Validate product if being updated
        if (updateCOASettingDto.productId) {
            const product = await this.prisma.product.findFirst({
                where: { id: updateCOASettingDto.productId, deletedAt: null },
            });
            if (!product) {
                throw new BadRequestException('Product not found');
            }
        }

        // Prepare update data
        const updateData: any = {};

        if (updateCOASettingDto.productId !== undefined) {
            updateData.productId = updateCOASettingDto.productId;
        }

        if (updateCOASettingDto.group !== undefined) {
            updateData.group = updateCOASettingDto.group as any;
        }

        return this.prisma.cOASetting.update({
            where: { id },
            data: updateData,
            include: {
                product: true,
            },
        });
    }

    async remove(id: number) {
        // Check if setting exists
        const existingSetting = await this.findOne(id);
        if (!existingSetting) {
            throw new NotFoundException('COA setting not found');
        }

        // Soft delete by setting deletedAt
        return this.prisma.cOASetting.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            },
        });
    }
}
