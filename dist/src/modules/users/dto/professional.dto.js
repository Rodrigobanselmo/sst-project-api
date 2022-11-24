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
exports.FindProfessionalsDto = exports.UpdateProfessionalDto = exports.CreateProfessionalDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const pagination_dto_1 = require("./../../../shared/dto/pagination.dto");
const cpf_format_transform_1 = require("./../../../shared/transformers/cpf-format.transform");
const query_array_1 = require("./../../../shared/transformers/query-array");
const string_capitalize_1 = require("./../../../shared/transformers/string-capitalize");
const string_uppercase_transform_1 = require("./../../../shared/transformers/string-uppercase.transform");
const council_dto_1 = require("./council.dto");
class CreateProfessionalDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String }, cpf: { required: false, type: () => String }, phone: { required: false, type: () => String }, email: { required: false, type: () => String }, certifications: { required: false, type: () => [String] }, formation: { required: false, type: () => [String] }, type: { required: true, type: () => Object }, status: { required: false, type: () => Object }, inviteId: { required: false, type: () => String }, userId: { required: false, type: () => Number }, sendEmail: { required: false, type: () => Boolean }, councils: { required: false, type: () => [require("./council.dto").CouncilDto] } };
    }
}
__decorate([
    (0, class_transformer_1.Transform)(string_capitalize_1.StringCapitalizeTransform, { toClassOnly: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProfessionalDto.prototype, "name", void 0);
__decorate([
    (0, class_transformer_1.Transform)(cpf_format_transform_1.CpfFormatTransform, { toClassOnly: true }),
    (0, class_validator_1.IsString)({ message: 'CPF inválido' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateProfessionalDto.prototype, "cpf", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateProfessionalDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateProfessionalDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateProfessionalDto.prototype, "certifications", void 0);
__decorate([
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateProfessionalDto.prototype, "formation", void 0);
__decorate([
    (0, class_transformer_1.Transform)(string_uppercase_transform_1.StringUppercaseTransform, { toClassOnly: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEnum)(client_1.ProfessionalTypeEnum, {
        message: `Tipo de profissional inválido`,
    }),
    __metadata("design:type", String)
], CreateProfessionalDto.prototype, "type", void 0);
__decorate([
    (0, class_transformer_1.Transform)(string_uppercase_transform_1.StringUppercaseTransform, { toClassOnly: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.StatusEnum, {
        message: `Tipo de status inválido`,
    }),
    __metadata("design:type", String)
], CreateProfessionalDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateProfessionalDto.prototype, "inviteId", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateProfessionalDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateProfessionalDto.prototype, "sendEmail", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => council_dto_1.CouncilDto),
    __metadata("design:type", Array)
], CreateProfessionalDto.prototype, "councils", void 0);
exports.CreateProfessionalDto = CreateProfessionalDto;
class UpdateProfessionalDto extends (0, swagger_1.PartialType)(CreateProfessionalDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, councils: { required: false, type: () => [require("./council.dto").CouncilDto] } };
    }
}
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateProfessionalDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => council_dto_1.CouncilDto),
    __metadata("design:type", Array)
], UpdateProfessionalDto.prototype, "councils", void 0);
exports.UpdateProfessionalDto = UpdateProfessionalDto;
class FindProfessionalsDto extends pagination_dto_1.PaginationQueryDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { search: { required: false, type: () => String }, name: { required: false, type: () => String }, cpf: { required: false, type: () => String }, email: { required: false, type: () => String }, councilType: { required: false, type: () => String }, councilUF: { required: false, type: () => String }, councilId: { required: false, type: () => String }, companyId: { required: false, type: () => String }, companies: { required: false, type: () => [String] }, id: { required: false, type: () => [Number] }, userCompanyId: { required: false, type: () => String }, byCouncil: { required: false, type: () => Boolean }, type: { required: true, type: () => [Object] } };
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FindProfessionalsDto.prototype, "search", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FindProfessionalsDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FindProfessionalsDto.prototype, "cpf", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FindProfessionalsDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FindProfessionalsDto.prototype, "councilType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(string_uppercase_transform_1.StringUppercaseTransform, { toClassOnly: true }),
    (0, class_transformer_1.Transform)(query_array_1.QueryArray, { toClassOnly: true }),
    (0, class_validator_1.IsEnum)(client_1.UfStateEnum, {
        message: `UF inválido`,
        each: true,
    }),
    __metadata("design:type", String)
], FindProfessionalsDto.prototype, "councilUF", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FindProfessionalsDto.prototype, "councilId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FindProfessionalsDto.prototype, "companyId", void 0);
__decorate([
    (0, class_transformer_1.Transform)(query_array_1.QueryArray, { toClassOnly: true }),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], FindProfessionalsDto.prototype, "companies", void 0);
__decorate([
    (0, class_transformer_1.Transform)(query_array_1.QueryArray, { toClassOnly: true }),
    (0, class_validator_1.IsInt)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], FindProfessionalsDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FindProfessionalsDto.prototype, "userCompanyId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], FindProfessionalsDto.prototype, "byCouncil", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(query_array_1.QueryArray, { toClassOnly: true }),
    (0, class_validator_1.IsEnum)(client_1.ProfessionalTypeEnum, {
        message: `Tipo de profissional inválido`,
        each: true,
    }),
    __metadata("design:type", Array)
], FindProfessionalsDto.prototype, "type", void 0);
exports.FindProfessionalsDto = FindProfessionalsDto;
//# sourceMappingURL=professional.dto.js.map