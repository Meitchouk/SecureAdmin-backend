import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
    @ApiProperty({ example: 'user@example.com' })
    email: string;

    @ApiProperty({ example: 'password' })
    password: string;

    @ApiProperty({ example: 'User' })
    name: string;

    @ApiProperty({ example: 'username' })
    username: string;

    @ApiProperty({ example: 1 })
    roleId: number;
}
