import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SuperAdminGuard implements CanActivate {
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

        if (!role || role.name !== 'Super Admin') {
            throw new ForbiddenException('Super Admin access required');
        }

        return true;
    }
}
