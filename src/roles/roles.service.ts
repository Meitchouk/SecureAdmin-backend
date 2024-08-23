import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRoleDto } from './dto/create-roles.dto';
import { UpdateRoleDto } from './dto/update-roles.dto';

@Injectable()
export class RolesService {
    constructor(private readonly prisma: PrismaService) { }

    async createRole(createRoleDto: CreateRoleDto, requesterRoleId: number) {
        if (![1, 2].includes(requesterRoleId)) {
            throw new ForbiddenException('You do not have permission to create a role.');
        }
        return this.prisma.role.create({
            data: {
                description: createRoleDto.description,
                status: createRoleDto.status ?? true,  // Establecer status por defecto como true
            },
        });
    }

    async findAllRoles(requesterRoleId: number) {
        // Todos los usuarios autenticados pueden ver roles
        return this.prisma.role.findMany({
            include: { users: true },  // Incluir la relación con usuarios
        });
    }

    async findRoleById(id: number, requesterRoleId: number) {
        // Todos los usuarios autenticados pueden ver roles
        const role = await this.prisma.role.findUnique({
            where: { id },
            include: { users: true },  // Incluir la relación con usuarios
        });
        if (!role) {
            throw new NotFoundException('Role not found');
        }
        return role;
    }

    async updateRole(id: number, updateRoleDto: UpdateRoleDto, requesterRoleId: number) {
        // Solo los roles admin y superadmin pueden actualizar roles
        if (![1, 2].includes(requesterRoleId)) {
            throw new ForbiddenException('You do not have permission to update this role.');
        }
        return this.prisma.role.update({
            where: { id },
            data: updateRoleDto,
        });
    }

    async deleteRole(id: number, requesterRoleId: number) {
        // Solo los roles admin y superadmin pueden eliminar roles
        if (![1, 2].includes(requesterRoleId)) {
            throw new ForbiddenException('You do not have permission to delete this role.');
        }
        const role = await this.prisma.role.findUnique({ where: { id } });
        if (!role) {
            throw new NotFoundException('Role not found');
        }
        return this.prisma.role.delete({ where: { id } });
    }
}
