import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { QueryCustomerDto } from './dto/query-customer.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CustomersService {
    constructor(private prisma: PrismaService) { }

    async create(createCustomerDto: CreateCustomerDto, currentUser: any) {
        if (!currentUser || !currentUser.userId) {
            throw new ForbiddenException('Invalid user context');
        }

        // Verify the user exists in the database
        const user = await this.prisma.user.findUnique({
            where: { id: currentUser.userId },
            select: { id: true },
        });

        if (!user) {
            throw new ForbiddenException('User not found');
        }

        // Get current user's role to check if Super Admin
        const currentUserRole = await this.prisma.role.findUnique({
            where: { id: currentUser.roleId },
            select: { name: true },
        });

        let organizationId = createCustomerDto['organizationId'] || currentUser.organizationId;

        // If not Super Admin, use their organization
        if (currentUserRole?.name !== 'Super Admin') {
            if (!currentUser.organizationId) {
                throw new ForbiddenException('User must belong to an organization');
            }
            organizationId = currentUser.organizationId;
        }

        // Prepare data for Prisma
        const data: any = {
            ...createCustomerDto,
            organizationId,
            managerId: currentUser.userId,
        };

        // Convert addresses array to JSON if provided
        if (createCustomerDto.addresses && createCustomerDto.addresses.length > 0) {
            data.addresses = createCustomerDto.addresses;
        }

        // Automatically set managerId from current logged-in user
        return this.prisma.customer.create({
            data,
            include: {
                manager: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                organization: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
    }

    async findAll(query: QueryCustomerDto, currentUser: any) {
        const { page = 1, limit = 10, search } = query;
        const skip = (page - 1) * limit;

        // Get current user's role to check if Super Admin
        const currentUserRole = await this.prisma.role.findUnique({
            where: { id: currentUser.roleId },
            select: { name: true },
        });

        // Build where clause
        const where: Prisma.CustomerWhereInput = {
            deletedAt: null, // Only get non-deleted customers
        };

        // If not Super Admin, filter by organization
        if (currentUserRole?.name !== 'Super Admin') {
            if (!currentUser.organizationId) {
                throw new ForbiddenException('User must belong to an organization');
            }
            where.organizationId = currentUser.organizationId;
        }

        // Add search filter if provided
        if (search) {
            where.OR = [
                { customerName: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { company: { contains: search, mode: 'insensitive' } },
            ];
        }

        // Get total count for pagination
        const total = await this.prisma.customer.count({ where });

        // Get paginated results
        const customers = await this.prisma.customer.findMany({
            where,
            include: {
                manager: false,
                organization: false,
            },
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
        });

        return {
            data: customers,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: number, currentUser: any) {
        const customer = await this.prisma.customer.findFirst({
            where: {
                id,
                deletedAt: null, // Only get non-deleted customer
            },
            include: {
                manager: false,
                organization: false,
            },
        });

        if (!customer) {
            throw new NotFoundException('Customer not found');
        }

        // Check if user has access (Super Admin or same organization)
        const currentUserRole = await this.prisma.role.findUnique({
            where: { id: currentUser.roleId },
            select: { name: true },
        });

        if (currentUserRole?.name !== 'Super Admin' && customer.organizationId !== currentUser.organizationId) {
            throw new ForbiddenException('Access denied');
        }

        return customer;
    }

    async update(id: number, updateCustomerDto: UpdateCustomerDto, currentUser: any) {
        // Check if customer exists and has access
        const existingCustomer = await this.findOne(id, currentUser);
        if (!existingCustomer) {
            throw new NotFoundException('Customer not found');
        }

        // Prepare data for Prisma
        const data: any = { ...updateCustomerDto };

        // Convert addresses array to JSON if provided
        if (updateCustomerDto.addresses !== undefined) {
            data.addresses = updateCustomerDto.addresses;
        }

        return this.prisma.customer.update({
            where: { id },
            data,
            include: {
                manager: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                organization: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
    }

    async remove(id: number, currentUser: any) {
        // Check if customer exists and has access
        const existingCustomer = await this.findOne(id, currentUser);
        if (!existingCustomer) {
            throw new NotFoundException('Customer not found');
        }

        // Soft delete by setting deletedAt
        return this.prisma.customer.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            },
        });
    }
}
