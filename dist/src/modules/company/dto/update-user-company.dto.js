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
exports.UserCompanyEditDto = void 0;
const openapi = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const keysOfEnum_utils_1 = require("../../../shared/utils/keysOfEnum.utils");
const string_uppercase_transform_1 = require("../../../shared/transformers/string-uppercase.transform");
const client_1 = require("@prisma/client");
class UserCompanyEditDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { userId: { required: true, type: () => Number }, roles: { required: false, type: () => [String] }, permissions: { required: false, type: () => [String] }, status: { required: false, type: () => Object } };
    }
}
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UserCompanyEditDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UserCompanyEditDto.prototype, "roles", void 0);
__decorate([
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UserCompanyEditDto.prototype, "permissions", void 0);
__decorate([
    (0, class_transformer_1.Transform)(string_uppercase_transform_1.StringUppercaseTransform, { toClassOnly: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.StatusEnum, {
        message: `status must be one of: ${(0, keysOfEnum_utils_1.KeysOfEnum)(client_1.StatusEnum)}`,
    }),
    __metadata("design:type", String)
], UserCompanyEditDto.prototype, "status", void 0);
exports.UserCompanyEditDto = UserCompanyEditDto;
//# sourceMappingURL=update-user-company.dto.js.map