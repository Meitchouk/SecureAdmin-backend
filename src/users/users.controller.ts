import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Req, SetMetadata } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { SelfRoleGuard } from 'src/auth/self-role.guard';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { UpdateRoleDto } from './dto/update-role.dto';

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
    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.createUser(createUserDto);
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
    @UseGuards(JwtAuthGuard)
    @Get()
    findAll() {
        return this.usersService.findAllUsers();
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
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usersService.findUserById(+id);
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
    @UseGuards(JwtAuthGuard)
    @Put(':id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.updateUser(+id, updateUserDto);
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
    @UseGuards(JwtAuthGuard, RolesGuard)
    @SetMetadata('roles', ['admin'])
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.usersService.deleteUser(+id);
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
    @UseGuards(JwtAuthGuard, RolesGuard, SelfRoleGuard)
    @Put(':id/role')
    changeRole(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto, @Req() req: Request) {
        const { roleId } = updateRoleDto;
        return this.usersService.changeRoleUser(+id, roleId, req.user.userId);
    }
}
