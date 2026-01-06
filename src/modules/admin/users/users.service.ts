import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async create(createUserDto: CreateUserDto) {
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        return this.prisma.user.create({
            data: {
                ...createUserDto,
                password: hashedPassword,
            },
        });
    }

    async findAll(query: QueryUserDto) {
        const { page = 1, limit = 10, search, roleId, createdFrom, createdTo } = query;
        const skip = (page - 1) * limit;

        // Build where clause
        const where: Prisma.UserWhereInput = {};

        // Search by name or email
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
            ];
        }

        // Filter by role
        if (roleId) {
            where.roleId = roleId;
        }

        // Filter by created date range
        if (createdFrom || createdTo) {
            where.createdAt = {};
            if (createdFrom) {
                where.createdAt.gte = new Date(createdFrom);
            }
            if (createdTo) {
                where.createdAt.lte = new Date(createdTo);
            }
        }

        // Get total count for pagination
        const total = await this.prisma.user.count({ where });

        // Get paginated results
        const users = await this.prisma.user.findMany({
            where,
            include: { role: true },
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
        });

        return {
            data: users,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    findOne(id: number) {
        return this.prisma.user.findUnique({ where: { id }, include: { role: true } });
    }

    async update(id: number, updateUserDto: UpdateUserDto) {
        return this.prisma.user.update({ 
            where: { id }, 
            data: updateUserDto,
            include: { role: true },
        });
    }

    remove(id: number) {
        return this.prisma.user.delete({ where: { id } });
    }
}
