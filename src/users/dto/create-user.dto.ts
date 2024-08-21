import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({
        description: 'Nombre de usuario único',
        example: 'adminuser',
    })
    username: string;

    @ApiProperty({
        description: 'Correo electrónico único',
        example: 'admin@example.com',
    })
    email: string;

    @ApiProperty({
        description: 'Contraseña del usuario',
        example: 'adminuser',
    })
    password: string;

    @ApiProperty({
        description: 'Nombre completo del usuario',
        example: 'Admin User',
    })
    name: string;

    @ApiProperty({
        description: 'Estado del usuario (activo/inactivo)',
        example: true,
        default: true,
    })
    status?: boolean;

    @ApiProperty({
        description: 'ID del rol asignado al usuario',
        example: 1,
    })
    roleId: number;
}
