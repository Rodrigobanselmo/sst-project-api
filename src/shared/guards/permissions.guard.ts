import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  IPermissionOptions,
  PERMISSIONS_KEY,
} from '../decorators/permissions.decorator';
import { UserPayloadDto } from '../dto/user-payload.dto';

type IMethods = 'GET' | 'POST' | 'PATCH' | 'DELETE';

const methodToCrud = (method: IMethods) => {
  switch (method) {
    case 'POST':
      return 'c';
    case 'GET':
      return 'r';
    case 'PATCH':
      return 'u';
    case 'DELETE':
      return 'd';

    default:
      break;
  }
};

const comparePermission = (
  options: IPermissionOptions,
  permission: string,
  CRUD: string,
) => {
  const isEqualCode = permission.split('-')[0] === options.code;
  const isEqualCrud = options.crud ? permission.includes(CRUD) : true;
  // const isEqualExtends = options.special
  //   ? !options.special
  //       .map((extend) => permission.includes(extend))
  //       .some((i) => !i)
  //   : true;

  return isEqualCode && isEqualCrud;
};

const isNotRegisterOnCompany = (req, companyId: number): boolean => {
  const query = req.query;
  const params = req.params;
  const body = req.body;

  if (body && body.companyId == companyId) return false;
  if (params && params.companyId == companyId) return false;
  if (query && query.companyId == companyId) return false;
  return true;
};

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissionsOptions = this.reflector.getAllAndOverride<
      IPermissionOptions[]
    >(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);
    if (!requiredPermissionsOptions) {
      return true;
    }

    const req = context.switchToHttp().getRequest();
    const user: UserPayloadDto = req.user;

    const method: IMethods = req.method;
    const CRUD = methodToCrud(method);

    if (user && user?.companies)
      return user.companies
        .map((company) => {
          return requiredPermissionsOptions.some((options) => {
            if (
              options.checkCompany &&
              isNotRegisterOnCompany(req, company.companyId)
            )
              return false;

            return company.permissions.some((permission) =>
              comparePermission(options, permission, CRUD),
            );
          });
        })
        .some((i) => i);
    return false;
  }
}
