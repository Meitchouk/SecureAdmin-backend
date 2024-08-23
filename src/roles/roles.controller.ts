import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Req } from '@nestjs/common';
import { RolesService } from './roles.service';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreateRoleDto } from './dto/create-roles.dto';
import { UpdateRoleDto } from './dto/update-roles.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from 'express';

@ApiTags('roles')
@ApiBearerAuth()  // Indicando que todos los endpoints requieren autenticación
@Controller('roles')
export class RolesController {
    constructor(private readonly rolesService: RolesService) { }

    @ApiOperation({ summary: 'Crear un nuevo rol' })
    @ApiBody({
        type: CreateRoleDto,
        examples: {
            example1: {
                summary: 'Ejemplo de creación de rol',
                value: {
                    description: 'Administrador',
                },
            },
        },
    })
    @ApiResponse({
        status: 201,
        description: 'Rol creado exitosamente.',
        schema: {
            example: {
                id: 1,
                description: 'Administrador',
                createdAt: '2024-08-21T00:00:00.000Z',
                status: true,
            },
        },
    })
    @ApiResponse({ status: 400, description: 'Datos inválidos.' })
    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() createRoleDto: CreateRoleDto, @Req() req: Request) {
        return this.rolesService.createRole(createRoleDto, req.user.roleId);
    }

    @ApiOperation({ summary: 'Obtener todos los roles' })
    @ApiResponse({
        status: 200,
        description: 'Lista de roles obtenida exitosamente.',
        schema: {
            example: [
                {
                    id: 1,
                    description: 'Administrador',
                    createdAt: '2024-08-21T00:00:00.000Z',
                    status: true,
                },
                {
                    id: 2,
                    description: 'Usuario',
                    createdAt: '2024-08-21T00:00:00.000Z',
                    status: true,
                },
            ],
        },
    })
    @UseGuards(JwtAuthGuard)
    @Get()
    findAll(@Req() req: Request) {
        return this.rolesService.findAllRoles(req.user.roleId);
    }

    @ApiOperation({ summary: 'Obtener un rol por ID' })
    @ApiParam({ name: 'id', description: 'ID del rol', example: 1 })
    @ApiResponse({
        status: 200,
        description: 'Rol encontrado.',
        schema: {
            example: {
                id: 1,
                description: 'Administrador',
                createdAt: '2024-08-21T00:00:00.000Z',
                status: true,
            },
        },
    })
    @ApiResponse({ status: 404, description: 'Rol no encontrado.' })
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    findOne(@Param('id') id: string, @Req() req: Request) {
        return this.rolesService.findRoleById(+id, req.user.roleId);
    }

    @ApiOperation({ summary: 'Actualizar un rol por ID' })
    @ApiParam({ name: 'id', description: 'ID del rol', example: 1 })
    @ApiBody({
        type: UpdateRoleDto,
        examples: {
            example1: {
                summary: 'Ejemplo de actualización de rol',
                value: {
                    description: 'Super Administrador',
                },
            },
        },
    })
    @ApiResponse({
        status: 200,
        description: 'Rol actualizado exitosamente.',
        schema: {
            example: {
                id: 1,
                description: 'Super Administrador',
                createdAt: '2024-08-21T00:00:00.000Z',
                status: true,
            },
        },
    })
    @ApiResponse({ status: 404, description: 'Rol no encontrado.' })
    @ApiResponse({ status: 400, description: 'Datos inválidos.' })
    @UseGuards(JwtAuthGuard)
    @Put(':id')
    update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto, @Req() req: Request) {
        return this.rolesService.updateRole(+id, updateRoleDto, req.user.roleId);
    }

    @ApiOperation({ summary: 'Eliminar un rol por ID' })
    @ApiParam({ name: 'id', description: 'ID del rol', example: 1 })
    @ApiResponse({
        status: 200,
        description: 'Rol eliminado exitosamente.',
        schema: {
            example: {
                id: 1,
                description: 'Administrador',
                createdAt: '2024-08-21T00:00:00.000Z',
                status: true,
            },
        },
    })
    @ApiResponse({ status: 404, description: 'Rol no encontrado.' })
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@Param('id') id: string, @Req() req: Request) {
        return this.rolesService.deleteRole(+id, req.user.roleId);
    }
}
