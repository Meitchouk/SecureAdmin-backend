import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

/**
 * A guard that prevents a user from modifying their own role.
 * @implements CanActivate
 */
@Injectable()
export class SelfRoleGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user = request.user; // Este es el usuario autenticado
        const userIdToModify = +request.params.id; // ID del usuario que se intenta modificar

        if (userIdToModify === user.userId) {
            throw new ForbiddenException('You cannot modify your own role.');
        }

        return true;
    }
}
