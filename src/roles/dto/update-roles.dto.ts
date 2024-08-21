import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class UpdateRoleDto {
  @IsInt()
  @ApiProperty({
    description: 'ID del rol',
    example: 1,
  })
  roleId: number;
}
