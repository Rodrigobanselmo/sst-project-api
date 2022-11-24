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
exports.UpdateUserDto = void 0;
const openapi = require("@nestjs/swagger");
const query_array_1 = require("./../../../shared/transformers/query-array");
const string_uppercase_transform_1 = require("./../../../shared/transformers/string-uppercase.transform");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const cpf_format_transform_1 = require("../../../shared/transformers/cpf-format.transform");
const string_capitalize_1 = require("../../../shared/transformers/string-capitalize");
const council_dto_1 = require("./council.dto");
class UpdateUserDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { oldPassword: { required: false, type: () => String }, password: { required: false, type: () => String, minLength: 8, maxLength: 20 }, name: { required: false, type: () => String, maxLength: 100 }, cpf: { required: false, type: () => String }, googleExternalId: { required: false, type: () => String }, phone: { required: false, type: () => String }, certifications: { required: false, type: () => [String] }, formation: { required: false, type: () => [String] }, councilType: { required: false, type: () => String }, councilUF: { required: false, type: () => String }, councilId: { required: false, type: () => String }, type: { required: false, type: () => Object }, token: { required: false, type: () => String }, councils: { required: false, type: () => [require("./council.dto").CouncilDto] } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'user older password' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "oldPassword", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8),
    (0, class_validator_1.MaxLength)(20),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "password", void 0);
__decorate([
    (0, class_transformer_1.Transform)(string_capitalize_1.StringCapitalizeTransform, { toClassOnly: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "name", void 0);
__decorate([
    (0, class_transformer_1.Transform)(cpf_format_transform_1.CpfFormatTransform, { toClassOnly: true }),
    (0, class_validator_1.IsString)({ message: 'CPF inválido' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "cpf", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "googleExternalId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateUserDto.prototype, "certifications", void 0);
__decorate([
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateUserDto.prototype, "formation", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "councilType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(string_uppercase_transform_1.StringUppercaseTransform, { toClassOnly: true }),
    (0, class_transformer_1.Transform)(query_array_1.QueryArray, { toClassOnly: true }),
    (0, class_validator_1.IsEnum)(client_1.UfStateEnum, {
        message: `UF inválido`,
        each: true,
    }),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "councilUF", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "councilId", void 0);
__decorate([
    (0, class_transformer_1.Transform)(string_uppercase_transform_1.StringUppercaseTransform, { toClassOnly: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.ProfessionalTypeEnum, {
        message: `Tipo de profissional inválido`,
    }),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "token", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => council_dto_1.CouncilDto),
    __metadata("design:type", Array)
], UpdateUserDto.prototype, "councils", void 0);
exports.UpdateUserDto = UpdateUserDto;
//# sourceMappingURL=update-user.dto.js.map