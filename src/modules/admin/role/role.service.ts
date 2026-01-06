import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { QueryRoleDto } from './dto/query-role.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class RoleService {
    constructor(private prisma: PrismaService) { }

    create(createRoleDto: CreateRoleDto) {
        return this.prisma.role.create({
            data: {
                name: createRoleDto.name,
                permissions: createRoleDto.permissions || [],
            },
        });
    }

    async findAll(query: QueryRoleDto) {
        const { page = 1, limit = 10, search } = query;
        const skip = (page - 1) * limit;

        // Build where clause
        const where: Prisma.RoleWhereInput = {};

        // Add search filter if provided
        if (search) {
            where.name = {
                contains: search,
                mode: 'insensitive',
            };
        }

        // Get total count for pagination
        const total = await this.prisma.role.count({ where });

        // Get paginated results
        const roles = await this.prisma.role.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
        });

        return {
            data: roles,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    findOne(id: number) {
        return this.prisma.role.findUnique({ where: { id } });
    }

    update(id: number, updateRoleDto: UpdateRoleDto) {
        return this.prisma.role.update({ where: { id }, data: updateRoleDto });
    }

    remove(id: number) {
        return this.prisma.role.delete({ where: { id } });
    }
}
