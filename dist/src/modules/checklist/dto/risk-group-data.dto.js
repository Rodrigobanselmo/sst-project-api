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
exports.UpsertRiskGroupDataDto = void 0;
const openapi = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const string_capitalize_paragraph_1 = require("../../../shared/transformers/string-capitalize-paragraph");
const date_format_1 = require("../../../shared/transformers/date-format");
const string_capitalize_1 = require("../../../shared/transformers/string-capitalize");
const string_uppercase_transform_1 = require("../../../shared/transformers/string-uppercase.transform");
const keysOfEnum_utils_1 = require("../../../shared/utils/keysOfEnum.utils");
class UpsertRiskGroupDataDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: false, type: () => String }, name: { required: true, type: () => String }, status: { required: false, type: () => Object }, companyId: { required: true, type: () => String }, source: { required: true, type: () => String }, elaboratedBy: { required: true, type: () => String }, approvedBy: { required: true, type: () => String }, revisionBy: { required: true, type: () => String }, workspaceId: { required: true, type: () => String }, documentDate: { required: true, type: () => Date }, visitDate: { required: true, type: () => Date } };
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpsertRiskGroupDataDto.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Transform)(string_capitalize_paragraph_1.StringCapitalizeParagraphTransform, { toClassOnly: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpsertRiskGroupDataDto.prototype, "name", void 0);
__decorate([
    (0, class_transformer_1.Transform)(string_uppercase_transform_1.StringUppercaseTransform, { toClassOnly: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEnum)(client_1.StatusEnum, {
        message: `type must be one of: ${(0, keysOfEnum_utils_1.KeysOfEnum)(client_1.StatusEnum)}`,
    }),
    __metadata("design:type", String)
], UpsertRiskGroupDataDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpsertRiskGroupDataDto.prototype, "companyId", void 0);
__decorate([
    (0, class_transformer_1.Transform)(string_capitalize_paragraph_1.StringCapitalizeParagraphTransform, { toClassOnly: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpsertRiskGroupDataDto.prototype, "source", void 0);
__decorate([
    (0, class_transformer_1.Transform)(string_capitalize_1.StringCapitalizeTransform, { toClassOnly: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpsertRiskGroupDataDto.prototype, "elaboratedBy", void 0);
__decorate([
    (0, class_transformer_1.Transform)(string_capitalize_1.StringCapitalizeTransform, { toClassOnly: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpsertRiskGroupDataDto.prototype, "approvedBy", void 0);
__decorate([
    (0, class_transformer_1.Transform)(string_capitalize_1.StringCapitalizeTransform, { toClassOnly: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpsertRiskGroupDataDto.prototype, "revisionBy", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpsertRiskGroupDataDto.prototype, "workspaceId", void 0);
__decorate([
    (0, class_transformer_1.Transform)(date_format_1.DateFormat, { toClassOnly: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], UpsertRiskGroupDataDto.prototype, "documentDate", void 0);
__decorate([
    (0, class_transformer_1.Transform)(date_format_1.DateFormat, { toClassOnly: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], UpsertRiskGroupDataDto.prototype, "visitDate", void 0);
exports.UpsertRiskGroupDataDto = UpsertRiskGroupDataDto;
//# sourceMappingURL=risk-group-data.dto.js.map