import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { PrismaService } from '../../prisma/prisma.service';
import { Permission } from '../constants/enum/authorization';
import {
  IPermissionOptions,
  PERMISSIONS_KEY,
} from '../decorators/permissions.decorator';
import { UserPayloadDto } from '../dto/user-payload.dto';
import { asyncSome } from '../utils/asyncSome.utils';

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

const getCompanyId = (req): string => {
  const query = req.query;
  const params = req.params;
  const body = req.body;

  if (body && body.companyId) return body.companyId;
  if (params && params.companyId) return params.companyId;
  if (query && query.companyId) return query.companyId;
  return '';
};

const isParentCompany = async (
  prisma: PrismaService,
  requestCompanyId: string,
  companyId: string,
): Promise<boolean> => {
  const parentRelation = await prisma.contract.findUnique({
    where: {
      applyingServiceCompanyId_receivingServiceCompanyId: {
        applyingServiceCompanyId: requestCompanyId,
        receivingServiceCompanyId: companyId,
      },
    },
  });

  if (!parentRelation) return false;
  if (parentRelation.status !== 'ACTIVE') return false;

  return true;
};

const isAdmin = (user: UserPayloadDto) => {
  return user.permissions.some(
    (permission) => permission === Permission.MASTER,
  );
};

const checkPermissions = (
  user: UserPayloadDto,
  options: IPermissionOptions,
  CRUD: string,
) => {
  if (!options.code) return true;

  return user.permissions.some((permission) => {
    const isEqualCode = permission.split('-')[0] === options.code;
    const isEqualCrud = options.crud ? permission.includes(CRUD) : true;

    return isEqualCode && isEqualCrud;
  });
};

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector, private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
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

    if (user)
      // map all companies in user token
      return await asyncSome(requiredPermissionsOptions, async (options) => {
        const { isContract, isMember } = options;
        const userCompanyId = user.companyId;

        if (isAdmin(user)) return true;

        let isCompanyMember = false;

        const affectedCompanyId = getCompanyId(req);

        if (isMember) {
          if (!affectedCompanyId) return false;

          isCompanyMember = affectedCompanyId == userCompanyId;
        }

        const isPermissionPresent = checkPermissions(user, options, CRUD);
        if (!isPermissionPresent) return false;

        if (!isMember && !isContract && isPermissionPresent) return true;
        if (isCompanyMember && isPermissionPresent) return true;

        if (isContract) {
          const isCompanyContract = await isParentCompany(
            this.prisma,
            userCompanyId,
            affectedCompanyId,
          );

          if (isCompanyContract && isPermissionPresent) return true;
        }

        return false;
      });
    return false;
  }
}
