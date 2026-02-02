import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBLDraftDto } from './dto/create-bl-draft.dto';
import { UpdateBLDraftDto } from './dto/update-bl-draft.dto';
import { QueryBLDraftDto } from './dto/query-bl-draft.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class BLDraftService {
    constructor(private prisma: PrismaService) { }

    async create(createBLDraftDto: CreateBLDraftDto) {
        // Validate invoice exists
        const invoice = await this.prisma.invoice.findFirst({
            where: { id: createBLDraftDto.invoiceId, deletedAt: null },
        });
        if (!invoice) {
            throw new BadRequestException('Invoice not found');
        }

        // Validate consignee customer exists
        const consignee = await this.prisma.customer.findFirst({
            where: { id: createBLDraftDto.consigneeId, deletedAt: null },
        });
        if (!consignee) {
            throw new BadRequestException('Consignee customer not found');
        }

        // Validate notify buyer if provided
        if (createBLDraftDto.notifyBuyerId) {
            const notifyBuyer = await this.prisma.customer.findFirst({
                where: { id: createBLDraftDto.notifyBuyerId, deletedAt: null },
            });
            if (!notifyBuyer) {
                throw new BadRequestException('Notify buyer customer not found');
            }
        }

        // Validate notify other party if provided
        if (createBLDraftDto.notifyOtherPartyId) {
            const notifyOtherParty = await this.prisma.customer.findFirst({
                where: { id: createBLDraftDto.notifyOtherPartyId, deletedAt: null },
            });
            if (!notifyOtherParty) {
                throw new BadRequestException('Notify other party customer not found');
            }
        }

        return this.prisma.bLDraft.create({
            data: {
                invoiceId: createBLDraftDto.invoiceId,
                invoiceDate: new Date(createBLDraftDto.invoiceDate),
                shippingLine: createBLDraftDto.shippingLine,
                bookingNumber: createBLDraftDto.bookingNumber,
                blType: createBLDraftDto.blType,
                vesselNumber: createBLDraftDto.vesselNumber,
                freight: createBLDraftDto.freight,
                consigneeId: createBLDraftDto.consigneeId,
                notifyBuyerId: createBLDraftDto.notifyBuyerId || null,
                notifyOtherPartyId: createBLDraftDto.notifyOtherPartyId || null,
                otherDetail: createBLDraftDto.otherDetail,
            },
            include: {
                invoice: true,
                consignee: true,
                notifyBuyer: true,
                notifyOtherParty: true,
            },
        });
    }

    async findAll(query: QueryBLDraftDto) {
        const { page = 1, limit = 10, search, invoiceId, consigneeId, notifyBuyerId, notifyOtherPartyId } = query;
        const skip = (page - 1) * limit;

        // Build where clause
        const where: Prisma.BLDraftWhereInput = {
            deletedAt: null, // Only get non-deleted BL drafts
        };

        // Add search filter if provided
        if (search) {
            where.OR = [
                { shippingLine: { contains: search, mode: 'insensitive' } },
                { bookingNumber: { contains: search, mode: 'insensitive' } },
                { vesselNumber: { contains: search, mode: 'insensitive' } },
            ];
        }

        // Add filters if provided
        if (invoiceId) {
            where.invoiceId = invoiceId;
        }

        if (consigneeId) {
            where.consigneeId = consigneeId;
        }

        if (notifyBuyerId) {
            where.notifyBuyerId = notifyBuyerId;
        }

        if (notifyOtherPartyId) {
            where.notifyOtherPartyId = notifyOtherPartyId;
        }

        // Get total count for pagination
        const total = await this.prisma.bLDraft.count({ where });

        // Get paginated results
        const blDrafts = await this.prisma.bLDraft.findMany({
            where,
            include: {
                invoice: true,
                consignee: true,
                notifyBuyer: true,
                notifyOtherParty: true,
            },
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
        });

        return {
            data: blDrafts,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: number) {
        const blDraft = await this.prisma.bLDraft.findFirst({
            where: {
                id,
                deletedAt: null, // Only get non-deleted BL draft
            },
            include: {
                invoice: true,
                consignee: true,
                notifyBuyer: true,
                notifyOtherParty: true,
            },
        });

        if (!blDraft) {
            throw new NotFoundException('BL draft not found');
        }

        return blDraft;
    }

    async update(id: number, updateBLDraftDto: UpdateBLDraftDto) {
        // Check if BL draft exists
        const existingBLDraft = await this.findOne(id);
        if (!existingBLDraft) {
            throw new NotFoundException('BL draft not found');
        }

        // Validate invoice if being updated
        if (updateBLDraftDto.invoiceId) {
            const invoice = await this.prisma.invoice.findFirst({
                where: { id: updateBLDraftDto.invoiceId, deletedAt: null },
            });
            if (!invoice) {
                throw new BadRequestException('Invoice not found');
            }
        }

        // Validate consignee if being updated
        if (updateBLDraftDto.consigneeId) {
            const consignee = await this.prisma.customer.findFirst({
                where: { id: updateBLDraftDto.consigneeId, deletedAt: null },
            });
            if (!consignee) {
                throw new BadRequestException('Consignee customer not found');
            }
        }

        // Validate notify buyer if being updated
        if (updateBLDraftDto.notifyBuyerId) {
            const notifyBuyer = await this.prisma.customer.findFirst({
                where: { id: updateBLDraftDto.notifyBuyerId, deletedAt: null },
            });
            if (!notifyBuyer) {
                throw new BadRequestException('Notify buyer customer not found');
            }
        }

        // Validate notify other party if being updated
        if (updateBLDraftDto.notifyOtherPartyId) {
            const notifyOtherParty = await this.prisma.customer.findFirst({
                where: { id: updateBLDraftDto.notifyOtherPartyId, deletedAt: null },
            });
            if (!notifyOtherParty) {
                throw new BadRequestException('Notify other party customer not found');
            }
        }

        // Prepare update data
        const updateData: any = {};

        if (updateBLDraftDto.invoiceId !== undefined) {
            updateData.invoiceId = updateBLDraftDto.invoiceId;
        }

        if (updateBLDraftDto.invoiceDate !== undefined) {
            updateData.invoiceDate = new Date(updateBLDraftDto.invoiceDate);
        }

        if (updateBLDraftDto.shippingLine !== undefined) {
            updateData.shippingLine = updateBLDraftDto.shippingLine;
        }

        if (updateBLDraftDto.bookingNumber !== undefined) {
            updateData.bookingNumber = updateBLDraftDto.bookingNumber;
        }

        if (updateBLDraftDto.blType !== undefined) {
            updateData.blType = updateBLDraftDto.blType;
        }

        if (updateBLDraftDto.vesselNumber !== undefined) {
            updateData.vesselNumber = updateBLDraftDto.vesselNumber;
        }

        if (updateBLDraftDto.freight !== undefined) {
            updateData.freight = updateBLDraftDto.freight;
        }

        if (updateBLDraftDto.consigneeId !== undefined) {
            updateData.consigneeId = updateBLDraftDto.consigneeId;
        }

        if (updateBLDraftDto.notifyBuyerId !== undefined) {
            updateData.notifyBuyerId = updateBLDraftDto.notifyBuyerId;
        }

        if (updateBLDraftDto.notifyOtherPartyId !== undefined) {
            updateData.notifyOtherPartyId = updateBLDraftDto.notifyOtherPartyId;
        }

        if (updateBLDraftDto.otherDetail !== undefined) {
            updateData.otherDetail = updateBLDraftDto.otherDetail;
        }

        return this.prisma.bLDraft.update({
            where: { id },
            data: updateData,
            include: {
                invoice: true,
                consignee: true,
                notifyBuyer: true,
                notifyOtherParty: true,
            },
        });
    }

    async remove(id: number) {
        // Check if BL draft exists
        const existingBLDraft = await this.findOne(id);
        if (!existingBLDraft) {
            throw new NotFoundException('BL draft not found');
        }

        // Soft delete by setting deletedAt
        return this.prisma.bLDraft.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            },
        });
    }
}
