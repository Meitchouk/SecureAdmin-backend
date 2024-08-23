import { ConflictException, ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { UserType } from 'src/types/Users/userTypes';
import { RegisterDto } from './dto/register.dto';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private readonly prisma: PrismaService,
    ) { }

    /**
     * Valida un usuario por su correo electrónico y contraseña.
     * @param email - El correo electrónico del usuario.
     * @param pass - La contraseña del usuario.
     * @returns El usuario sin la contraseña, si la validación es exitosa.
     */
    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);
        if (user && await bcrypt.compare(pass, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
    /**
     * Genera un JWT único para un usuario autenticado.
     * @param user - El usuario autenticado.
     * @returns Un objeto con un mensaje de éxito, el token de acceso y el usuario autenticado.
     */
    async login(user: UserType) {
        const payload = { username: user.username, sub: user.id, roleId: user.roleId };
    
        const accessToken = this.jwtService.sign(payload);
    
        return {
            message: 'Login successfully completed',
            access_token: accessToken,
            user: user,
        };
    }    

    async register(registerDto: RegisterDto) {
        const { email, password, name, username, roleId } = registerDto;

        // Verificar si el usuario ya existe
        const userExists = await this.prisma.user.findUnique({
            where: { email, username },
        });

        if (userExists) {
            if (userExists.email === email) {
                throw new ConflictException('Correo electrónico ya registrado');
            }
            if (userExists.username === username) {
                throw new ConflictException('Nombre de usuario ya registrado');
            }
        }

        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear nuevo usuario
        const newUser = await this.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                username,
                roleId,
            },
        });

        const { password: _, ...registeredUser } = newUser;

        return {
            message: 'User successfully registered',
            user: registeredUser,
        };
    }

    async profile(user: UserType) {
        return user;
    }
}
