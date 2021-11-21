import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../prisma/prisma.service';
import { Permission } from '../constants/authorization';
import {
  IPermissionOptions,
  PERMISSIONS_KEY,
} from '../decorators/permissions.decorator';
import { UserCompanyDto, UserPayloadDto } from '../dto/user-payload.dto';
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

const getCompanyId = (req): boolean | string => {
  const query = req.query;
  const params = req.params;
  const body = req.body;

  if (body && body.companyId) return body.companyId;
  if (params && params.companyId) return params.companyId;
  if (query && query.companyId) return query.companyId;
  return false;
};

const getRequestCompanyId = (req): boolean | string => {
  const query = req.query;
  const params = req.params;
  const body = req.body;

  if (body && body.myCompanyId) return body.myCompanyId;
  if (params && params.myCompanyId) return params.myCompanyId;
  if (query && query.myCompanyId) return query.myCompanyId;
  return false;
};

const isParentCompany = async (
  prisma: PrismaService,
  userCompanyId: string,
  companyId: string,
): Promise<boolean> => {
  const parentRelation = await prisma.contract.findUnique({
    where: {
      applyingServiceCompanyId_receivingServiceCompanyId: {
        applyingServiceCompanyId: userCompanyId,
        receivingServiceCompanyId: companyId,
      },
    },
  });

  if (!parentRelation) return false;

  return true;
};

const hasPermissions = (
  company: UserCompanyDto,
  options: IPermissionOptions,
  CRUD: string,
) => {
  return company.permissions.some((permission) =>
    comparePermission(options, permission, CRUD),
  );
};

const isAdmin = (company: UserCompanyDto) => {
  return company.permissions.some(
    (permission) => permission === Permission.MASTER,
  );
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
    if (user && user?.companies)
      // map all companies in user token
      return await asyncSome(user.companies, async (company) => {
        // map all permissions required in route
        return await asyncSome(requiredPermissionsOptions, async (options) => {
          const { checkChild, checkCompany } = options;

          // checks if has permission to edit this company (your or child companies)
          if (checkChild || checkCompany) {
            const companyId = getCompanyId(req);
            const isCompany = companyId == company.companyId;

            // if not same company and checkChild = true
            if (checkChild && !isCompany) {
              // if is not a request from reqCompanyId return false
              const reqCompanyId = getRequestCompanyId(req);
              if (reqCompanyId !== company.companyId) return isAdmin(company);

              // if companyId is not present denied access
              if (typeof companyId === 'string') {
                const havePermission = hasPermissions(company, options, CRUD);

                if (!havePermission)
                  // if does not have permissions denied access
                  return isAdmin(company);

                // if have permissions then check in database if companyId is child of the company permissions
                const isParent = await isParentCompany(
                  this.prisma,
                  company.companyId,
                  companyId,
                );

                if (isParent) return true;

                return isAdmin(company);
              } else {
                return isAdmin(company);
              }
            }

            // if not same company and does not check for child then return false
            if (!isCompany && !checkChild) return isAdmin(company);
          }

          // if dont check for companies domain, then just check if has permissions in one of the companies
          return hasPermissions(company, options, CRUD) || isAdmin(company);
        });
      });
    return false;
  }
}
