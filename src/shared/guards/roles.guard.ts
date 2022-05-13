import { ROLES_KEY } from './../decorators/roles.decorator';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleEnum } from '../constants/enum/authorization';
import { UserPayloadDto } from '../dto/user-payload.dto';

const isAdmin = (user: UserPayloadDto) => {
  return user.roles.some((roles) => roles === RoleEnum.MASTER);
};

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }
    const user: UserPayloadDto = context.switchToHttp().getRequest().user;

    if (isAdmin(user)) return true;

    return requiredRoles.some((role) => user.roles.includes(role));
  }
}
