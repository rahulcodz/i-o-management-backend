import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

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

    findAll() {
        return this.prisma.user.findMany({ include: { role: true } });
    }

    findOne(id: number) {
        return this.prisma.user.findUnique({ where: { id }, include: { role: true } });
    }

    async update(id: number, updateUserDto: any) {
        if (updateUserDto.password) {
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
        }
        return this.prisma.user.update({ where: { id }, data: updateUserDto });
    }

    remove(id: number) {
        return this.prisma.user.delete({ where: { id } });
    }
}
