import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(private prisma: PrismaService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user || !user.roleId) {
            throw new ForbiddenException('Access denied');
        }

        const role = await this.prisma.role.findUnique({
            where: { id: user.roleId },
        });

        if (!role) {
            throw new ForbiddenException('Access denied');
        }

        // Allow Super Admin or Admin roles
        if (role.name === 'Super Admin' || role.name === 'Admin') {
            return true;
        }

        throw new ForbiddenException('Admin access required');
    }
}
