import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Req, SetMetadata } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesGuard } from 'src/auth/roles.guard';
import { SelfRoleGuard } from 'src/auth/self-role.guard';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { UpdateRoleDto } from './dto/update-role.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('users')
@ApiBearerAuth()  // Esto indica que todos los endpoints de este controlador requieren autenticación con Bearer token
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @ApiOperation({ summary: 'Crear un nuevo usuario' })
    @ApiBody({
        type: CreateUserDto,
        examples: {
            example1: {
                summary: 'Ejemplo de creación de usuario',
                value: {
                    username: 'adminuser',
                    email: 'admin@example.com',
                    password: 'adminuser',
                    name: 'Admin User',
                    status: true,
                    roleId: 1
                },
            },
        },
    })
    @ApiResponse({
        status: 201,
        description: 'Usuario creado exitosamente.',
        schema: {
            example: {
                id: 1,
                username: 'adminuser',
                email: 'admin@example.com',
                name: 'Admin User',
                status: true,
                createdAt: '2024-08-21T00:00:00.000Z',
                roleId: 1,
            },
        },
    })
    @ApiResponse({ status: 400, description: 'Datos inválidos.' })
    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @SetMetadata('roles', ['admin', 'superadmin']) // Solo usuarios con estos roles pueden crear usuarios
    create(@Body() createUserDto: CreateUserDto, @Req() req: Request) {
        return this.usersService.createUser(createUserDto, req.user.roleId);
    }

    @ApiOperation({ summary: 'Obtener todos los usuarios' })
    @ApiResponse({
        status: 200,
        description: 'Lista de usuarios obtenida exitosamente.',
        schema: {
            example: [
                {
                    id: 1,
                    username: 'adminuser',
                    email: 'admin@example.com',
                    name: 'Admin User',
                    status: true,
                    createdAt: '2024-08-21T00:00:00.000Z',
                    roleId: 1,
                },
                {
                    id: 2,
                    username: 'normaluser',
                    email: 'user@example.com',
                    name: 'Normal User',
                    status: true,
                    createdAt: '2024-08-21T00:00:00.000Z',
                    roleId: 2,
                },
            ],
        },
    })
    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @SetMetadata('roles', ['admin', 'superadmin']) // Solo estos roles pueden acceder a este endpoint
    findAll(@Req() req: Request) {
        return this.usersService.findAllUsers(req.user.roleId);
    }

    @ApiOperation({ summary: 'Obtener un usuario por ID' })
    @ApiParam({ name: 'id', description: 'ID del usuario', example: 1 })
    @ApiResponse({
        status: 200,
        description: 'Usuario encontrado.',
        schema: {
            example: {
                id: 1,
                username: 'adminuser',
                email: 'admin@example.com',
                name: 'Admin User',
                status: true,
                createdAt: '2024-08-21T00:00:00.000Z',
                roleId: 1,
            },
        },
    })
    @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
    @Get(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @SetMetadata('roles', ['admin', 'superadmin']) // Solo estos roles pueden acceder a este endpoint
    findOne(@Param('id') id: string, @Req() req: Request) {
        return this.usersService.findUserById(+id, req.user.roleId);
    }

    @ApiOperation({ summary: 'Actualizar un usuario por ID' })
    @ApiParam({ name: 'id', description: 'ID del usuario', example: 1 })
    @ApiBody({
        type: UpdateUserDto,
        examples: {
            example1: {
                summary: 'Ejemplo de actualización de usuario',
                value: {
                    email: 'admin_new@example.com',
                    name: 'Admin User Updated',
                    status: false,
                },
            },
        },
    })
    @ApiResponse({
        status: 200,
        description: 'Usuario actualizado exitosamente.',
        schema: {
            example: {
                id: 1,
                username: 'adminuser',
                email: 'admin_new@example.com',
                name: 'Admin User Updated',
                status: false,
                createdAt: '2024-08-21T00:00:00.000Z',
                roleId: 1,
            },
        },
    })
    @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
    @ApiResponse({ status: 400, description: 'Datos inválidos.' })
    @Put(':id')
    @UseGuards(JwtAuthGuard, RolesGuard, SelfRoleGuard)
    @SetMetadata('roles', ['admin', 'superadmin']) // Solo estos roles pueden actualizar usuarios
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Req() req: Request) {
        return this.usersService.updateUser(+id, updateUserDto, req.user.roleId);
    }

    @ApiOperation({ summary: 'Eliminar un usuario por ID' })
    @ApiParam({ name: 'id', description: 'ID del usuario', example: 1 })
    @ApiResponse({
        status: 200,
        description: 'Usuario eliminado exitosamente.',
        schema: {
            example: {
                id: 1,
                username: 'adminuser',
                email: 'admin@example.com',
                name: 'Admin User',
                status: true,
                createdAt: '2024-08-21T00:00:00.000Z',
                roleId: 1,
            },
        },
    })
    @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
    @ApiResponse({ status: 403, description: 'Acceso prohibido.' })
    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard, SelfRoleGuard)
    @SetMetadata('roles', ['admin', 'superadmin']) // Solo estos roles pueden eliminar usuarios
    remove(@Param('id') id: string, @Req() req: Request) {
        return this.usersService.deleteUser(+id, req.user.roleId);
    }

    @ApiOperation({ summary: 'Cambiar el rol de un usuario por ID' })
    @ApiParam({ name: 'id', description: 'ID del usuario', example: 1 })
    @ApiBody({
        type: UpdateRoleDto,
        examples: {
            example1: {
                summary: 'Ejemplo de cambio de rol de usuario',
                value: {
                    roleId: 2,
                },
            },
        },
    })
    @ApiResponse({
        status: 200,
        description: 'Rol de usuario actualizado exitosamente.',
        schema: {
            example: {
                id: 1,
                username: 'adminuser',
                email: 'admin@example.com',
                name: 'Admin User',
                status: true,
                createdAt: '2024-08-21T00:00:00.000Z',
                roleId: 2,
            },
        },
    })
    @ApiResponse({ status: 403, description: 'Prohibido modificar el rol del propio usuario.' })
    @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
    @Put(':id/role')
    @UseGuards(JwtAuthGuard, RolesGuard, SelfRoleGuard)
    @SetMetadata('roles', ['admin', 'superadmin']) // Solo estos roles pueden cambiar roles de usuarios
    changeRole(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto, @Req() req: Request) {
        const { roleId } = updateRoleDto;
        // Aquí añadimos el roleId del usuario autenticado como requesterRoleId
        return this.usersService.changeRoleUser(+id, roleId, req.user.userId, req.user.roleId);
    }
}
