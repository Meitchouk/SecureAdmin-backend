import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        // Verificar si el rol del usuario tiene permisos para modificar roles
        if (user.role !== 'admin') { 
            throw new ForbiddenException('You do not have permission to modify roles.');
        }

        return true;
    }
}
