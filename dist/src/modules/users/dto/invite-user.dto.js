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
exports.InviteUserDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const authorization_1 = require("../../../shared/constants/enum/authorization");
class InviteUserDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { email: { required: true, type: () => String }, companyId: { required: true, type: () => String }, permissions: { required: true, enum: require("../../../shared/constants/enum/authorization").PermissionEnum, isArray: true }, roles: { required: false, enum: require("../../../shared/constants/enum/authorization").RoleEnum, isArray: true } };
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], InviteUserDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InviteUserDto.prototype, "companyId", void 0);
__decorate([
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(authorization_1.PermissionEnum, {
        message: `wrong permission value sent`,
        each: true,
    }),
    __metadata("design:type", Array)
], InviteUserDto.prototype, "permissions", void 0);
__decorate([
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsEnum)(authorization_1.RoleEnum, {
        message: `wrong role value sent`,
        each: true,
    }),
    __metadata("design:type", Array)
], InviteUserDto.prototype, "roles", void 0);
exports.InviteUserDto = InviteUserDto;
//# sourceMappingURL=invite-user.dto.js.map