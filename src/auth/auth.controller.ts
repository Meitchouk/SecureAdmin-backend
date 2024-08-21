import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiProperty } from '@nestjs/swagger';
import { AuthService } from './auth.service';

/**
 * Represents the data transfer object for the login operation.
 */
class LoginDto {
    @ApiProperty({
        description: 'Correo electrónico del usuario',
        example: 'sample@email.com',
    })
    email: string;

    @ApiProperty({
        description: 'Contraseña del usuario',
        example: 'password',
    })
    password: string;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    @ApiOperation({ summary: 'Iniciar sesión' })
    @ApiBody({ type: LoginDto })
    @ApiResponse({
        status: 200, description: 'Autenticación exitosa.', schema: {
            example: {
                "message": "Login successfully completed",
                "access_token": "[access_token]",
                "user": {
                    "id": "[id]",
                    "username": "username",
                    "email": "user@example.com",
                    "name": "User",
                    "status": true,
                    "createdAt": "[createdAt]",
                    "roleId": "[roleId]"
                }
            }
        }
    })
    @ApiResponse({ status: 401, description: 'Credenciales incorrectas.' })
    async login(@Body() loginDto: LoginDto) {
        const user = await this.authService.validateUser(loginDto.email, loginDto.password);
        if (!user) {
            throw new UnauthorizedException('Credenciales incorrectas');
        }
        return this.authService.login(user);
    }
}
