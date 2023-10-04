import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesTypeGuard implements CanActivate {
  constructor(private readonly _reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const rolesTypeDecorators = this._reflector.get<string[]>(
      'rolesType',
      context.getHandler(),
    );

    if (!rolesTypeDecorators) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const { role } = request.user;

    return rolesTypeDecorators.includes(role);
  }
}
