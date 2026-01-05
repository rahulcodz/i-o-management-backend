import { Injectable, OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService implements OnModuleInit {
    constructor(private prisma: PrismaService, private jwtService: JwtService) { }

    async onModuleInit() {
        await this.seedAdmin();
    }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (user && await bcrypt.compare(pass, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id, roleId: user.roleId };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async getProfile(userId: number) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { role: { select: { id: true } } },
        });
        if (user) {
            const { password, ...result } = user;
            return {
                ...result,
                role: result.role?.id,
            };
        }
        return null;
    }

    async seedAdmin() {
        const roleName = 'Super Admin';
        let role = await this.prisma.role.findUnique({ where: { name: roleName } });
        if (!role) {
            role = await this.prisma.role.create({
                data: {
                    name: roleName,
                    permissions: ["all"],
                }
            });
            console.log('Created Super Admin Role');
        }

        const email = 'bhutkevin1@gmail.com';
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await this.prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name: 'super admin',
                    mobile: '1234567890',
                    roleId: role.id,
                }
            });
            console.log('Created Super Admin User');
        }
    }
}
