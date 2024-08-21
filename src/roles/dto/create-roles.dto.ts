import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
    @ApiProperty({
        description: 'Descripción del rol',
        example: 'Administrador',
    })
    description: string;

    @ApiProperty({
        description: 'ID del rol',
        example: 1,
    })
    roleId: number;

    @ApiProperty({
        description: 'Estado del rol',
        example: true,
    })
    status: boolean;
}
