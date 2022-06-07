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
const common_1 = require("@nestjs/common");
const UsersCompanyRepository_1 = require("../../../repositories/implementations/UsersCompanyRepository");
let UpdatePermissionsRolesService = class UpdatePermissionsRolesService {
    constructor(usersCompanyRepository) {
        this.usersCompanyRepository = usersCompanyRepository;
    }
    async execute(updateUserCompanyDto) {
        const user = await this.usersCompanyRepository.update(updateUserCompanyDto);
        return user;
    }
};
UpdatePermissionsRolesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [UsersCompanyRepository_1.UsersCompanyRepository])
], UpdatePermissionsRolesService);
exports.UpdatePermissionsRolesService = UpdatePermissionsRolesService;
//# sourceMappingURL=update-permissions-roles.service.js.map