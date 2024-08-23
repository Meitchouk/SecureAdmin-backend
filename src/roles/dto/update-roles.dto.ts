import { ApiProperty } from '@nestjs/swagger';

export class UpdateRoleDto {
    @ApiProperty({
        description: 'Descripción del rol',
        example: 'Superadmin',
    })
    description?: string;

    @ApiProperty({
        description: 'Estado del rol (activo/inactivo)',
        example: true,
    })
    status?: boolean;
}
