import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ComboService {
    constructor(private prisma: PrismaService) { }

    async getUsersCombo(currentUser: any) {
        // Get current user's role to check if Super Admin (optimized - only get name)
        const currentUserRole = await this.prisma.role.findUnique({
            where: { id: currentUser.roleId },
            select: { name: true },
        });

        // Build where clause
        const where: any = {};

        // If not Super Admin, filter by organization
        if (currentUserRole?.name !== 'Super Admin') {
            if (!currentUser.organizationId) {
                throw new ForbiddenException('User must belong to an organization');
            }
            where.organizationId = currentUser.organizationId;
        }

        // Optimized query: select only needed fields (id, roleId, roleName)
        const users = await this.prisma.user.findMany({
            where,
            select: {
                id: true,
                role: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: {
                id: 'asc',
            },
        });

        // Transform to return only role name and id as requested
        return users.map(user => ({
            id: user.role?.id,
            label: user.role?.name || null,
        }));
    }
}
