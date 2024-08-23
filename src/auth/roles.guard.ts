import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        // Verificar si el rol del usuario es admin o superadmin
        if (user.roleId === 1 || user.roleId === 2) {
            return true;
        } else {
            // Lanzar un error con el roleId del usuario
            throw new ForbiddenException(`RolesGuard | No tienes permiso para realizar esta acción. Tu roleId es: ${user.roleId}`);
        }
    }
}
