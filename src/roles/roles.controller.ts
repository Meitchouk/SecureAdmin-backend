import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreateRoleDto } from './dto/create-roles.dto';
import { UpdateRoleDto } from './dto/update-roles.dto';

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
    create(@Body() createRoleDto: CreateRoleDto) {
        return this.rolesService.createRole(createRoleDto);
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
    findAll() {
        return this.rolesService.findAllRoles();
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
    findOne(@Param('id') id: string) {
        return this.rolesService.findRoleById(+id);
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
    update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
        return this.rolesService.updateRole(+id, updateRoleDto);
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
    remove(@Param('id') id: string) {
        return this.rolesService.deleteRole(+id);
    }
}
