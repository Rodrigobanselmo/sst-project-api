"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionsGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const prisma_service_1 = require("../../prisma/prisma.service");
const authorization_1 = require("../constants/enum/authorization");
const permissions_decorator_1 = require("../decorators/permissions.decorator");
const asyncSome_utils_1 = require("../utils/asyncSome.utils");
const getCompanId_1 = require("../utils/getCompanId");
const methodToCrud = (method) => {
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
const isParentCompany = async (prisma, requestCompanyId, companyId) => {
    const parentRelation = await prisma.contract.findUnique({
        where: {
            applyingServiceCompanyId_receivingServiceCompanyId: {
                applyingServiceCompanyId: requestCompanyId,
                receivingServiceCompanyId: companyId,
            },
        },
    });
    if (!parentRelation)
        return false;
    if (parentRelation.status !== 'ACTIVE')
        return false;
    return true;
};
const isAdmin = (user) => {
    return user.permissions.some((permission) => permission === authorization_1.PermissionEnum.MASTER);
};
const checkPermissions = (user, options, CRUD) => {
    if (!options.code)
        return true;
    return user.permissions.some((permission) => {
        const isEqualCode = permission.split('-')[0] === options.code;
        const isEqualCrud = options.crud ? permission.includes(CRUD) : true;
        return isEqualCode && isEqualCrud;
    });
};
let PermissionsGuard = class PermissionsGuard {
    constructor(reflector, prisma) {
        this.reflector = reflector;
        this.prisma = prisma;
    }
    async canActivate(context) {
        const requiredPermissionsOptions = this.reflector.getAllAndOverride(permissions_decorator_1.PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);
        if (!requiredPermissionsOptions) {
            return true;
        }
        const req = context.switchToHttp().getRequest();
        const user = req.user;
        const method = req.method;
        const CRUD = methodToCrud(method);
        if (user)
            return await (0, asyncSome_utils_1.asyncSome)(requiredPermissionsOptions, async (PermissionOption) => {
                const { isContract, isMember } = PermissionOption;
                const userCompanyId = user.companyId;
                if (isAdmin(user))
                    return true;
                const affectedCompanyId = (0, getCompanId_1.getCompanyId)(req);
                if (affectedCompanyId === false)
                    return false;
                const isPermissionPresent = checkPermissions(user, PermissionOption, CRUD);
                if (!isPermissionPresent)
                    return false;
                if (!isMember && !isContract && isPermissionPresent)
                    return true;
                if (isMember && isPermissionPresent) {
                    if (!affectedCompanyId)
                        return true;
                    if (affectedCompanyId == userCompanyId)
                        return true;
                }
                if (isContract && isPermissionPresent) {
                    if (!affectedCompanyId)
                        return false;
                    if (affectedCompanyId == userCompanyId)
                        return false;
                    const isCompanyContract = await isParentCompany(this.prisma, userCompanyId, affectedCompanyId);
                    if (isCompanyContract)
                        return true;
                }
                return false;
            });
        return false;
    }
};
PermissionsGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector, prisma_service_1.PrismaService])
], PermissionsGuard);
exports.PermissionsGuard = PermissionsGuard;
//# sourceMappingURL=permissions.guard.js.map