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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const public_decorator_1 = require("../../../../shared/decorators/public.decorator");
const user_decorator_1 = require("../../../../shared/decorators/user.decorator");
const user_payload_dto_1 = require("../../../../shared/dto/user-payload.dto");
const validate_email_pipe_1 = require("../../../../shared/pipes/validate-email.pipe");
const create_user_dto_1 = require("../../dto/create-user.dto");
const reset_pass_1 = require("../../dto/reset-pass");
const update_user_company_dto_1 = require("../../dto/update-user-company.dto");
const update_user_dto_1 = require("../../dto/update-user.dto");
const create_user_service_1 = require("../../services/users/create-user/create-user.service");
const find_by_email_service_1 = require("../../services/users/find-by-email/find-by-email.service");
const find_by_id_service_1 = require("../../services/users/find-by-id/find-by-id.service");
const find_me_service_1 = require("../../services/users/find-me/find-me.service");
const reset_password_service_1 = require("../../services/users/reset-password/reset-password.service");
const update_permissions_roles_service_1 = require("../../services/users/update-permissions-roles/update-permissions-roles.service");
const update_user_service_1 = require("../../services/users/update-user/update-user.service");
let UsersController = class UsersController {
    constructor(createUserService, resetPasswordService, updateUserService, findMeService, findByEmailService, findByIdService, updatePermissionsRolesService) {
        this.createUserService = createUserService;
        this.resetPasswordService = resetPasswordService;
        this.updateUserService = updateUserService;
        this.findMeService = findMeService;
        this.findByEmailService = findByEmailService;
        this.findByIdService = findByIdService;
        this.updatePermissionsRolesService = updatePermissionsRolesService;
    }
    findMe(userPayloadDto) {
        return (0, class_transformer_1.classToClass)(this.findMeService.execute(userPayloadDto.userId, userPayloadDto.companyId));
    }
    findId(id) {
        return (0, class_transformer_1.classToClass)(this.findByIdService.execute(+id));
    }
    findEmail(email) {
        return (0, class_transformer_1.classToClass)(this.findByEmailService.execute(email));
    }
    async create(createUserDto) {
        return (0, class_transformer_1.classToClass)(this.createUserService.execute(createUserDto));
    }
    async update(updateUserDto, { userId }) {
        return (0, class_transformer_1.classToClass)(this.updateUserService.execute(+userId, updateUserDto));
    }
    async updatePermissionsRoles(updateUserCompanyDto) {
        return (0, class_transformer_1.classToClass)(this.updatePermissionsRolesService.execute(updateUserCompanyDto));
    }
    async reset(resetPasswordDto) {
        return (0, class_transformer_1.classToClass)(this.resetPasswordService.execute(resetPasswordDto));
    }
};
__decorate([
    (0, common_1.Get)('me'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_payload_dto_1.UserPayloadDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findMe", null);
__decorate([
    (0, common_1.Get)(':id'),
    openapi.ApiResponse({ status: 200, type: require("../../entities/user.entity").UserEntity }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findId", null);
__decorate([
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200, type: require("../../entities/user.entity").UserEntity }),
    __param(0, (0, common_1.Query)('email', validate_email_pipe_1.ValidateEmailPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findEmail", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201, type: require("../../entities/user.entity").UserEntity }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)('update'),
    openapi.ApiResponse({ status: 200, type: require("../../entities/user.entity").UserEntity }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_user_dto_1.UpdateUserDto,
        user_payload_dto_1.UserPayloadDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)('update/authorization'),
    openapi.ApiResponse({ status: 200, type: require("../../entities/userCompany.entity").UserCompanyEntity }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_user_company_dto_1.UpdateUserCompanyDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updatePermissionsRoles", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Patch)('reset-password'),
    openapi.ApiResponse({ status: 200, type: require("../../entities/user.entity").UserEntity }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reset_pass_1.ResetPasswordDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "reset", null);
UsersController = __decorate([
    (0, swagger_1.ApiTags)('users'),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [create_user_service_1.CreateUserService,
        reset_password_service_1.ResetPasswordService,
        update_user_service_1.UpdateUserService,
        find_me_service_1.FindMeService,
        find_by_email_service_1.FindByEmailService,
        find_by_id_service_1.FindByIdService,
        update_permissions_roles_service_1.UpdatePermissionsRolesService])
], UsersController);
exports.UsersController = UsersController;
//# sourceMappingURL=users.controller.js.map