import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
import { CreateRoleDto } from 'src/roles/dto/create-roles.dto';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
    @ApiProperty({
        description: 'ID del rol que se va a actualizar',
        example: 2,
    })
    roleId: number;
}
