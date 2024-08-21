import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRoleDto } from './dto/create-roles.dto';
import { UpdateRoleDto } from './dto/update-roles.dto';


@Injectable()
export class RolesService {
    constructor(private readonly prisma: PrismaService) { }

    async createRole(createRoleDto: CreateRoleDto) {
        return this.prisma.role.create({
            data: {
                description: createRoleDto.description,
                status: createRoleDto.status ?? true,  // Establecer status por defecto como true
            },
        });
    }

    async findAllRoles() {
        return this.prisma.role.findMany({
            include: { users: true },  // Incluir la relación con usuarios
        });
    }

    async findRoleById(id: number) {
        const role = await this.prisma.role.findUnique({
            where: { id },
            include: { users: true },  // Incluir la relación con usuarios
        });
        if (!role) {
            throw new NotFoundException('Role not found');
        }
        return role;
    }

    async updateRole(id: number, updateRoleDto: UpdateRoleDto) {
        return this.prisma.role.update({
            where: { id },
            data: updateRoleDto,
        });
    }

    async deleteRole(id: number) {
        const role = await this.prisma.role.findUnique({ where: { id } });
        if (!role) {
            throw new NotFoundException('Role not found');
        }
        return this.prisma.role.delete({ where: { id } });
    }
}
