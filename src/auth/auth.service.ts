import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { UserType } from 'src/types/Users/userTypes';


@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
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
        const payload = { username: user.username, sub: user.id };

        const accessToken = this.jwtService.sign(payload);

        return {
            message: 'Login successfully completed',
            access_token: accessToken,
            user: user,
        };
    }
}
