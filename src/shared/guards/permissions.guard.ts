import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { PrismaService } from '../../prisma/prisma.service';
import { PermissionEnum } from '../constants/enum/authorization';
import {
  IPermissionOptions,
  PERMISSIONS_KEY,
} from '../decorators/permissions.decorator';
import { UserPayloadDto } from '../dto/user-payload.dto';
import { asyncSome } from '../utils/asyncSome.utils';
import { getCompanyId } from '../utils/getCompanId';

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
    (permission) => permission === PermissionEnum.MASTER,
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
      return await asyncSome(
        requiredPermissionsOptions,
        async (PermissionOption) => {
          const { isContract, isMember } = PermissionOption;
          const userCompanyId = user.companyId;

          if (isAdmin(user)) return true;

          const affectedCompanyId = getCompanyId(req);

          // is being send an array of items with different companies Ids
          if (affectedCompanyId === false) return false;

          const isPermissionPresent = checkPermissions(
            user,
            PermissionOption,
            CRUD,
          );

          if (!isPermissionPresent) return false;

          if (!isMember && !isContract && isPermissionPresent) return true;

          if (isMember && isPermissionPresent) {
            if (!affectedCompanyId) return true;
            if (affectedCompanyId == userCompanyId) return true;
          }

          if (isContract && isPermissionPresent) {
            if (!affectedCompanyId) return false;
            if (affectedCompanyId == userCompanyId) return false;

            const isCompanyContract = await isParentCompany(
              this.prisma,
              userCompanyId,
              affectedCompanyId,
            );

            if (isCompanyContract) return true;
          }

          return false;
        },
      );
    return false;
  }
}
