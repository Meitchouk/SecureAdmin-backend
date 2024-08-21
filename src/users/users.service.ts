import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

/**
 * Servicio para gestionar los usuarios.
 */
@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) { }

    /**
     * Crea un nuevo usuario en la base de datos.
     * @param createUserDto - Datos para crear un nuevo usuario.
     * @returns El usuario creado.
     */
    async createUser(createUserDto: CreateUserDto) {
        // Hashear la contraseña antes de guardarla
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        createUserDto.password = hashedPassword;

        return this.prisma.user.create({
            data: createUserDto,
        });
    }

    /**
     * Obtiene todos los usuarios de la base de datos.
     * @returns Una lista de todos los usuarios.
     */
    async findAllUsers() {
        return this.prisma.user.findMany();
    }

    /**
     * Obtiene un usuario por su ID.
     * @param id - El ID del usuario que se quiere obtener.
     * @returns El usuario correspondiente al ID.
     * @throws NotFoundException - Si el usuario no se encuentra.
     */
    async findUserById(id: number) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    /**
     * Obtiene un usuario por su correo electrónico.
     * @param email - El correo electrónico del usuario que se quiere obtener.
     * @returns El usuario correspondiente al correo electrónico.
     * @throws NotFoundException - Si el usuario no se encuentra.
     */
    async findByEmail(email: string) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }


    /**
     * Updates a user with the specified ID.
     *
     * @param {number} id - The ID of the user to update.
     * @param {UpdateUserDto} updateUserDto - The data to update the user with.
     * @returns {Promise<{ id: number, message: string }>} - A promise that resolves to an object containing the updated user's ID and a success message.
     * @throws {Error} - If any invalid fields are provided in the updateUserDto object.
     */
    async updateUser(id: number, updateUserDto: UpdateUserDto) {
        const { username, password, email, name } = updateUserDto;
        const data: any = {};

        if (username) {
            data.username = username;
        }

        if (password) {
            // Hashear la nueva contraseña si se está actualizando
            data.password = await bcrypt.hash(password, 10);
        }

        if (email) {
            data.email = email;
        }

        if (name) {
            data.name = name;
        }

        // Check if any other fields are being modified
        const allowedFields = ['username', 'password', 'email', 'name'];
        const invalidFields = Object.keys(updateUserDto).filter(field => !allowedFields.includes(field));
        if (invalidFields.length > 0) {
            throw new Error(`Invalid fields: ${invalidFields.join(', ')}`);
        }

        await this.prisma.user.update({
            where: { id },
            data,
        });

        return {
            id,
            message: 'User updated successfully',
        };
    }

    /**
     * Elimina un usuario por su ID.
     * @param id - El ID del usuario que se quiere eliminar.
     * @returns El usuario eliminado.
     * @throws NotFoundException - Si el usuario no se encuentra.
     */
    async deleteUser(id: number) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return this.prisma.user.delete({ where: { id } });
    }

    /**
     * Cambia el rol de un usuario.
     * @param id - El ID del usuario al que se le quiere cambiar el rol.
     * @param roleId - El ID del nuevo rol.
     * @param requesterId - El ID del usuario que está realizando la solicitud.
     * @returns El usuario con el rol actualizado.
     * @throws ForbiddenException - Si el usuario intenta cambiar su propio rol.
     */
    async changeRoleUser(id: number, roleId: number, requesterId: number) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (id === requesterId) {
            throw new ForbiddenException('You cannot modify your own role.');
        }

        return this.prisma.user.update({
            where: { id },
            data: { roleId },
        });
    }
}
