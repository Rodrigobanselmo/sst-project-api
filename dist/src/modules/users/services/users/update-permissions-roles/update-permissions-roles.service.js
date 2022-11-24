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
exports.UpdatePermissionsRolesService = void 0;
const CompanyRepository_1 = require("./../../../../company/repositories/implementations/CompanyRepository");
const authorization_1 = require("./../../../../../shared/constants/enum/authorization");
const AuthGroupRepository_1 = require("./../../../../auth/repositories/implementations/AuthGroupRepository");
const errorMessage_1 = require("./../../../../../shared/constants/enum/errorMessage");
const common_1 = require("@nestjs/common");
const UsersCompanyRepository_1 = require("../../../repositories/implementations/UsersCompanyRepository");
let UpdatePermissionsRolesService = class UpdatePermissionsRolesService {
    constructor(usersCompanyRepository, authGroupRepository, companyRepository) {
        this.usersCompanyRepository = usersCompanyRepository;
        this.authGroupRepository = authGroupRepository;
        this.companyRepository = companyRepository;
    }
    async execute(updateUserCompanyDto, userPayloadDto) {
        const userRoles = userPayloadDto.roles || [];
        const userPermissions = userPayloadDto.permissions || [];
        const company = await this.companyRepository.findById(updateUserCompanyDto.companyId);
        const isConsulting = company.isConsulting;
        if (!isConsulting)
            updateUserCompanyDto.companiesIds = [];
        const addRoles = [...(updateUserCompanyDto.roles || [])];
        const addPermissions = [...(updateUserCompanyDto.permissions || [])];
        if (updateUserCompanyDto.groupId) {
            const authGroup = await this.authGroupRepository.findById(updateUserCompanyDto.groupId, userPayloadDto.companyId);
            if (!(authGroup === null || authGroup === void 0 ? void 0 : authGroup.id))
                throw new common_1.BadRequestException(errorMessage_1.ErrorInvitesEnum.AUTH_GROUP_NOT_FOUND);
            addPermissions.push(...authGroup.permissions);
            addRoles.push(...authGroup.roles);
        }
        if (!userRoles.includes(authorization_1.RoleEnum.MASTER)) {
            const doesUserHasAllRoles = addRoles.every((role) => userRoles.includes(role));
            const doesUserHasAllPermissions = addPermissions.every((addPermission) => userPermissions.some((userPermission) => {
                return (userPermission.split('-')[0] === addPermission.split('-')[0] &&
                    Array.from(addPermission.split('-')[1] || '').every((crud) => (userPermission.split('-')[1] || '').includes(crud)));
            }));
            if (!doesUserHasAllRoles || !doesUserHasAllPermissions) {
                throw new common_1.ForbiddenException(errorMessage_1.ErrorInvitesEnum.FORBIDDEN_INSUFFICIENT_PERMISSIONS);
            }
        }
        const companyId = updateUserCompanyDto.companyId;
        const companies = await this.companyRepository.findNude({
            where: {
                id: { in: (updateUserCompanyDto === null || updateUserCompanyDto === void 0 ? void 0 : updateUserCompanyDto.companiesIds) || [] },
                OR: [
                    { id: companyId },
                    {
                        receivingServiceContracts: {
                            some: { applyingServiceCompanyId: companyId },
                        },
                    },
                ],
            },
        });
        if (companies && companies && companies.length > 0) {
            await this.usersCompanyRepository.deleteAllFromConsultant(updateUserCompanyDto.userId, updateUserCompanyDto.companyId);
            await this.usersCompanyRepository.upsertMany(Object.assign(Object.assign({}, updateUserCompanyDto), { companiesIds: companies.map((company) => company.id) }));
        }
        else
            await this.usersCompanyRepository.update(updateUserCompanyDto);
    }
};
UpdatePermissionsRolesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [UsersCompanyRepository_1.UsersCompanyRepository,
        AuthGroupRepository_1.AuthGroupRepository,
        CompanyRepository_1.CompanyRepository])
], UpdatePermissionsRolesService);
exports.UpdatePermissionsRolesService = UpdatePermissionsRolesService;
//# sourceMappingURL=update-permissions-roles.service.js.map