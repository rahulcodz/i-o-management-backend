import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@Injectable()
export class OrganizationService {
    constructor(private prisma: PrismaService) { }

    async create(createOrganizationDto: CreateOrganizationDto) {
        return this.prisma.organization.create({
            data: createOrganizationDto,
        });
    }

    async findAll() {
        return this.prisma.organization.findMany({
            include: {
                users: {
                    include: {
                        role: true,
                    },
                },
            },
        });
    }

    async findOne(id: number) {
        return this.prisma.organization.findUnique({
            where: { id },
            include: {
                users: {
                    include: {
                        role: true,
                    },
                },
            },
        });
    }

    async update(id: number, updateOrganizationDto: UpdateOrganizationDto) {
        return this.prisma.organization.update({
            where: { id },
            data: updateOrganizationDto,
        });
    }

    async remove(id: number) {
        return this.prisma.organization.delete({ where: { id } });
    }
}
