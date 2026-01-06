import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async create(createUserDto: CreateUserDto, currentUser: any) {
        // Get current user's role
        const currentUserRole = await this.prisma.role.findUnique({
            where: { id: currentUser.roleId },
        });

        let organizationId = createUserDto.organizationId;

        // If current user is not Super Admin, use their organization
        if (currentUserRole?.name !== 'Super Admin') {
            if (!currentUser.organizationId) {
                throw new ForbiddenException('User must belong to an organization');
            }
            organizationId = currentUser.organizationId;
        } else {
            // Super Admin can create users with or without organization
            // If creating an admin user, organizationId is required
            if (!organizationId) {
                throw new ForbiddenException('Organization ID is required when creating admin users');
            }
        }

        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        return this.prisma.user.create({
            data: {
                ...createUserDto,
                password: hashedPassword,
                organizationId,
            },
            include: {
                role: true,
                organization: true,
            },
        });
    }

    async findAll(query: QueryUserDto, currentUser: any) {
        const { page = 1, limit = 10, search, roleId, createdFrom, createdTo } = query;
        const skip = (page - 1) * limit;

        // Get current user's role
        const currentUserRole = await this.prisma.role.findUnique({
            where: { id: currentUser.roleId },
        });

        // Build where clause
        const where: Prisma.UserWhereInput = {};

        // If not Super Admin, filter by organization
        if (currentUserRole?.name !== 'Super Admin') {
            if (!currentUser.organizationId) {
                throw new ForbiddenException('User must belong to an organization');
            }
            where.organizationId = currentUser.organizationId;
        }

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
            select: {
                id: true,
                name: true,
                email: true,
                mobile: true,
                roleId: true,
                organizationId: true,
                createdAt: true,
                updatedAt: true,
                role: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                organization: {
                    select: {
                        id: true,
                        name: true,
                    }
                }
            },
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

    async findOne(id: number, currentUser: any) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: {
                role: true,
                organization: true,
            }
        });

        if (!user) {
            return null;
        }

        // Check if user has access (Super Admin or same organization)
        const currentUserRole = await this.prisma.role.findUnique({
            where: { id: currentUser.roleId },
        });

        if (currentUserRole?.name !== 'Super Admin' && user.organizationId !== currentUser.organizationId) {
            throw new ForbiddenException('Access denied');
        }

        return user;
    }

    async update(id: number, updateUserDto: UpdateUserDto, currentUser: any) {
        // Check if user exists and has access
        const existingUser = await this.findOne(id, currentUser);
        if (!existingUser) {
            throw new ForbiddenException('User not found');
        }

        return this.prisma.user.update({
            where: { id },
            data: updateUserDto,
            include: {
                role: true,
                organization: true,
            },
        });
    }

    async remove(id: number, currentUser: any) {
        // Check if user exists and has access
        const existingUser = await this.findOne(id, currentUser);
        if (!existingUser) {
            throw new ForbiddenException('User not found');
        }

        return this.prisma.user.delete({ where: { id } });
    }
}
