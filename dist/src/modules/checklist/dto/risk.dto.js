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
exports.UpdateRiskDto = exports.UpsertRiskDto = exports.CreateRiskDto = void 0;
const openapi = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const string_capitalize_paragraph_1 = require("../../../shared/transformers/string-capitalize-paragraph");
const string_uppercase_transform_1 = require("../../../shared/transformers/string-uppercase.transform");
const keysOfEnum_utils_1 = require("../../../shared/utils/keysOfEnum.utils");
const generate_source_dto_1 = require("./generate-source.dto");
const rec_med_dto_1 = require("./rec-med.dto");
class CreateRiskDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { type: { required: true, type: () => Object }, name: { required: true, type: () => String }, severity: { required: true, type: () => Number }, status: { required: false, type: () => Object }, companyId: { required: true, type: () => String }, recMed: { required: false, type: () => [require("./rec-med.dto").RiskCreateRecMedDto] }, generateSource: { required: false, type: () => [require("./generate-source.dto").RiskCreateGenerateSourceDto] } };
    }
}
__decorate([
    (0, class_transformer_1.Transform)(string_uppercase_transform_1.StringUppercaseTransform, { toClassOnly: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEnum)(client_1.RiskFactorsEnum, {
        message: `type must be one of: ${(0, keysOfEnum_utils_1.KeysOfEnum)(client_1.RiskFactorsEnum)}`,
    }),
    __metadata("design:type", String)
], CreateRiskDto.prototype, "type", void 0);
__decorate([
    (0, class_transformer_1.Transform)(string_capitalize_paragraph_1.StringCapitalizeParagraphTransform, { toClassOnly: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRiskDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateRiskDto.prototype, "severity", void 0);
__decorate([
    (0, class_transformer_1.Transform)(string_uppercase_transform_1.StringUppercaseTransform, { toClassOnly: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEnum)(client_1.StatusEnum, {
        message: `type must be one of: ${(0, keysOfEnum_utils_1.KeysOfEnum)(client_1.StatusEnum)}`,
    }),
    __metadata("design:type", String)
], CreateRiskDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRiskDto.prototype, "companyId", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => rec_med_dto_1.RiskCreateRecMedDto),
    __metadata("design:type", Array)
], CreateRiskDto.prototype, "recMed", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => generate_source_dto_1.RiskCreateGenerateSourceDto),
    __metadata("design:type", Array)
], CreateRiskDto.prototype, "generateSource", void 0);
exports.CreateRiskDto = CreateRiskDto;
class UpsertRiskDto extends CreateRiskDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, recMed: { required: false, type: () => [require("./rec-med.dto").UpsertRecMedDto] }, generateSource: { required: false, type: () => [require("./generate-source.dto").UpsertGenerateSourceDto] } };
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpsertRiskDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => rec_med_dto_1.UpsertRecMedDto),
    __metadata("design:type", Array)
], UpsertRiskDto.prototype, "recMed", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => generate_source_dto_1.UpsertGenerateSourceDto),
    __metadata("design:type", Array)
], UpsertRiskDto.prototype, "generateSource", void 0);
exports.UpsertRiskDto = UpsertRiskDto;
class UpdateRiskDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, type: { required: false, type: () => Object }, name: { required: false, type: () => String }, status: { required: false, type: () => Object }, companyId: { required: true, type: () => String }, recMed: { required: false, type: () => [require("./rec-med.dto").RiskUpdateRecMedDto] }, generateSource: { required: false, type: () => [require("./generate-source.dto").RiskUpdateGenerateSourceDto] } };
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateRiskDto.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Transform)(string_uppercase_transform_1.StringUppercaseTransform, { toClassOnly: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEnum)(client_1.RiskFactorsEnum, {
        message: `type must be one of: ${(0, keysOfEnum_utils_1.KeysOfEnum)(client_1.RiskFactorsEnum)}`,
    }),
    __metadata("design:type", String)
], UpdateRiskDto.prototype, "type", void 0);
__decorate([
    (0, class_transformer_1.Transform)(string_capitalize_paragraph_1.StringCapitalizeParagraphTransform, { toClassOnly: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateRiskDto.prototype, "name", void 0);
__decorate([
    (0, class_transformer_1.Transform)(string_uppercase_transform_1.StringUppercaseTransform, { toClassOnly: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEnum)(client_1.StatusEnum, {
        message: `type must be one of: ${(0, keysOfEnum_utils_1.KeysOfEnum)(client_1.StatusEnum)}`,
    }),
    __metadata("design:type", String)
], UpdateRiskDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateRiskDto.prototype, "companyId", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => rec_med_dto_1.RiskUpdateRecMedDto),
    __metadata("design:type", Array)
], UpdateRiskDto.prototype, "recMed", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => generate_source_dto_1.RiskUpdateGenerateSourceDto),
    __metadata("design:type", Array)
], UpdateRiskDto.prototype, "generateSource", void 0);
exports.UpdateRiskDto = UpdateRiskDto;
//# sourceMappingURL=risk.dto.js.map