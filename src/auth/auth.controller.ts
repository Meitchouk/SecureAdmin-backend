import { Controller, Post, Body, UnauthorizedException, Get, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiProperty } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RegisterDto } from './dto/register.dto';

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
        status: 200,
        description: 'Autenticación exitosa.',
        schema: {
            example: {
                message: 'Login successfully completed',
                access_token: '[access_token]',
                user: {
                    id: '[id]',
                    username: 'username',
                    email: 'user@example.com',
                    name: 'User',
                    status: true,
                    createdAt: '[createdAt]',
                    roleId: '[roleId]',
                },
            },
        },
    })
    @ApiResponse({ status: 401, description: 'Credenciales incorrectas.' })
    async login(@Body() loginDto: LoginDto) {
        const user = await this.authService.validateUser(loginDto.email, loginDto.password);
        if (!user) {
            throw new UnauthorizedException('Credenciales incorrectas');
        }
        return this.authService.login(user);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    @ApiOperation({ summary: 'Obtener perfil de usuario' })
    @ApiResponse({
        status: 200,
        description: 'Perfil de usuario obtenido con éxito.',
        schema: {
            example: {
                id: '[id]',
                username: 'username',
                email: 'email@email.com',
                name: 'User',
                status: true,
                createdAt: '[createdAt]',
                roleId: '[roleId]',
            },
        },
    })
    @ApiResponse({ status: 401, description: 'No autorizado.' })
    async getProfile(@Request() req) {
        return req.user;
    }

    @Post('register')
    @ApiOperation({ summary: 'Registrar usuario' })
    @ApiBody({ type: RegisterDto })
    @ApiResponse({ status: 201, description: 'Usuario registrado exitosamente.' })
    @ApiResponse({ status: 400, description: 'Correo electrónico ya registrado.' })
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }
}
