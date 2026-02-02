import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateDocumentTemplateDto } from './dto/create-document-template.dto';
import { UpdateDocumentTemplateDto } from './dto/update-document-template.dto';
import { QueryDocumentTemplateDto } from './dto/query-document-template.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class DocumentTemplateService {
    constructor(private prisma: PrismaService) { }

    async create(createDocumentTemplateDto: CreateDocumentTemplateDto) {
        // Validate user exists
        const user = await this.prisma.user.findUnique({
            where: { id: createDocumentTemplateDto.userId },
        });
        if (!user) {
            throw new BadRequestException('User not found');
        }

        return this.prisma.documentTemplate.create({
            data: {
                documentName: createDocumentTemplateDto.documentName,
                documentContent: createDocumentTemplateDto.documentContent,
                userId: createDocumentTemplateDto.userId,
            },
            include: {
                user: true,
            },
        });
    }

    async findAll(query: QueryDocumentTemplateDto) {
        const { page = 1, limit = 10, search, userId } = query;
        const skip = (page - 1) * limit;

        // Build where clause
        const where: Prisma.DocumentTemplateWhereInput = {
            deletedAt: null, // Only get non-deleted document templates
        };

        // Add search filter if provided
        if (search) {
            where.documentName = {
                contains: search,
                mode: 'insensitive',
            };
        }

        // Add user filter if provided
        if (userId) {
            where.userId = userId;
        }

        // Get total count for pagination
        const total = await this.prisma.documentTemplate.count({ where });

        // Get paginated results
        const documentTemplates = await this.prisma.documentTemplate.findMany({
            where,
            include: {
                user: true,
            },
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
        });

        return {
            data: documentTemplates,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: number) {
        const documentTemplate = await this.prisma.documentTemplate.findFirst({
            where: {
                id,
                deletedAt: null, // Only get non-deleted document template
            },
            include: {
                user: true,
            },
        });

        if (!documentTemplate) {
            throw new NotFoundException('Document template not found');
        }

        return documentTemplate;
    }

    async update(id: number, updateDocumentTemplateDto: UpdateDocumentTemplateDto) {
        // Check if document template exists
        const existingDocumentTemplate = await this.findOne(id);
        if (!existingDocumentTemplate) {
            throw new NotFoundException('Document template not found');
        }

        // Validate user if being updated
        if (updateDocumentTemplateDto.userId) {
            const user = await this.prisma.user.findUnique({
                where: { id: updateDocumentTemplateDto.userId },
            });
            if (!user) {
                throw new BadRequestException('User not found');
            }
        }

        return this.prisma.documentTemplate.update({
            where: { id },
            data: updateDocumentTemplateDto,
            include: {
                user: true,
            },
        });
    }

    async remove(id: number) {
        // Check if document template exists
        const existingDocumentTemplate = await this.findOne(id);
        if (!existingDocumentTemplate) {
            throw new NotFoundException('Document template not found');
        }

        // Soft delete by setting deletedAt
        return this.prisma.documentTemplate.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            },
        });
    }
}
