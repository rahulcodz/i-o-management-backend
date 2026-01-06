import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { QueryRoleComboDto } from './dto/query-role-combo.dto';
import { QueryUserComboDto } from './dto/query-user-combo.dto';
import { QueryOrganizationComboDto } from './dto/query-organization-combo.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ComboService {
    constructor(private prisma: PrismaService) { }

    async getUsersCombo(currentUser: any, query: QueryUserComboDto) {
        if (!currentUser || !currentUser.userId) {
            throw new ForbiddenException('Invalid user context');
        }

        // Get current user's role to check if Super Admin
        const currentUserRole = await this.prisma.role.findUnique({
            where: { id: currentUser.roleId },
            select: { name: true },
        });

        // Build where clause
        const where: Prisma.UserWhereInput = {};

        // If not Super Admin, filter by organization
        if (currentUserRole?.name !== 'Super Admin') {
            // Use organizationId from JWT payload, or fetch from database if not available
            let organizationId = currentUser.organizationId;

            // If organizationId is not in JWT, fetch it from database
            if (!organizationId) {
                const user = await this.prisma.user.findUnique({
                    where: { id: currentUser.userId },
                    select: { organizationId: true },
                });

                if (!user || !user.organizationId) {
                    throw new ForbiddenException('Organization not found for user');
                }
                organizationId = user.organizationId;
            }
            where.organizationId = organizationId;
        }

        // Add search filter if provided
        if (query.search) {
            where.name = {
                contains: query.search,
                mode: 'insensitive',
            };
        }

        // Fetch all users in the same organization, include role data and id/name
        const users = await this.prisma.user.findMany({
            where,
            select: {
                id: true,
                name: true,
            },
            orderBy: {
                name: 'asc',
            }
        });

        // Return users with id, label and role information for combo
        return users.map(u => ({
            id: u.id,
            label: u.name,
        }));
    }

    async getRolesCombo(query: QueryRoleComboDto) {
        // Build where clause for search
        const where: Prisma.RoleWhereInput = {};

        if (query.search) {
            where.name = {
                contains: query.search,
                mode: 'insensitive',
            };
        }

        // Optimized query: select only roleId and roleName
        const roles = await this.prisma.role.findMany({
            where,
            select: {
                id: true,
                name: true,
            },
            orderBy: {
                name: 'asc',
            },
        });

        // Transform to return only roleId and roleName
        return roles.map(role => ({
            roleId: role.id,
            roleName: role.name,
        }));
    }

    async getOrganizationsCombo(currentUser: any, query: QueryOrganizationComboDto) {
        if (!currentUser || !currentUser.userId) {
            throw new ForbiddenException('Invalid user context');
        }

        // Get current user's role to check if Super Admin
        const currentUserRole = await this.prisma.role.findUnique({
            where: { id: currentUser.roleId },
            select: { name: true },
        });

        // Build where clause
        const where: Prisma.OrganizationWhereInput = {};

        // If not Super Admin, filter by user's organization
        if (currentUserRole?.name !== 'Super Admin') {
            // Use organizationId from JWT payload, or fetch from database if not available
            let organizationId = currentUser.organizationId;

            // If organizationId is not in JWT, fetch it from database
            if (!organizationId) {
                const user = await this.prisma.user.findUnique({
                    where: { id: currentUser.userId },
                    select: { organizationId: true },
                });

                if (!user || !user.organizationId) {
                    throw new ForbiddenException('Organization not found for user');
                }
                organizationId = user.organizationId;
            }
            where.id = organizationId;
        }

        // Add search filter if provided
        if (query.search) {
            where.name = {
                contains: query.search,
                mode: 'insensitive',
            };
        }

        // Fetch organizations
        const organizations = await this.prisma.organization.findMany({
            where,
            select: {
                id: true,
                name: true,
            },
            orderBy: {
                name: 'asc',
            }
        });

        // Return organizations with id and name for combo
        return organizations.map(org => ({
            id: org.id,
            label: org.name,
        }));
    }
}
