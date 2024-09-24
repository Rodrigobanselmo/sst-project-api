import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { PrismaService } from '../../prisma/prisma.service';
import { PermissionEnum } from '../constants/enum/authorization';
import { IPermissionOptions, PERMISSIONS_KEY } from '../decorators/permissions.decorator';
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
    select: { status: true },
    where: {
      applyingServiceCompanyId_receivingServiceCompanyId: {
        applyingServiceCompanyId: requestCompanyId,
        receivingServiceCompanyId: companyId,
      },
    },
  });

  if (!parentRelation?.status) throw new ForbiddenException('Sem permissões para acesso (1)');
  if (parentRelation.status !== 'ACTIVE') throw new ForbiddenException('Sem permissões para acesso (2)');

  return true;
};

const isMaster = (user: UserPayloadDto, options: IPermissionOptions, CRUD: string) => {
  return checkPermissions(user, { ...options, code: PermissionEnum.MASTER }, CRUD);
};

const checkPermissions = (user: UserPayloadDto, options: IPermissionOptions, CRUD: string) => {
  if (!options.code) return true;
  const crudString = typeof options.crud === 'string' ? options.crud : CRUD;

  if (user.permissions.length === 0) return true;

  return user.permissions.some((permission) => {
    const isEqualCode = permission.split('-')[0] === options.code;
    const isEqualCrud = options.crud ? Array.from(crudString).some((crud) => permission.includes(crud)) : true;

    return isEqualCode && isEqualCrud;
  });
};

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissionsOptions = this.reflector.getAllAndOverride<IPermissionOptions[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredPermissionsOptions) {
      return true;
    }
    const req = context.switchToHttp().getRequest();
    const user: UserPayloadDto = req.user;

    const method: IMethods = req.method;
    const CRUD = methodToCrud(method);

    if (user) {
      const isValidPermission = await asyncSome(requiredPermissionsOptions, async (PermissionOption) => {
        const { isContract, isMember } = PermissionOption;
        const userCompanyId = user.companyId;

        if (isMaster(user, PermissionOption, CRUD)) return true;
        const affectedCompanyId = getCompanyId(req);
        //! missing companiesIds check
        // const affectedCompanyIds = getCompanyIds(req);

        // is being send an array of items with different companies Ids
        if (affectedCompanyId === false) return false;

        const isPermissionPresent = checkPermissions(user, PermissionOption, CRUD);
        if (!isPermissionPresent) return false;

        if (!isMember && !isContract && isPermissionPresent) return true;
        if (isMember && isPermissionPresent) {
          if (!affectedCompanyId) return true;
          if (affectedCompanyId == userCompanyId) return true;
        }

        if (isContract && isPermissionPresent) {
          if (!affectedCompanyId) return false;
          if (affectedCompanyId == userCompanyId) return false;

          const isCompanyContract = await isParentCompany(this.prisma, userCompanyId, affectedCompanyId);

          if (isCompanyContract) return true;
        }

        return false;
      });

      if (!isValidPermission) throw new ForbiddenException('Sem permissões para acesso (3)');
      return true;
    }
    throw new ForbiddenException('Sem permissões para acesso (4)');
  }
}
