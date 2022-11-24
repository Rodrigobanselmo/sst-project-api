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
exports.ProfessionalToRiskDataGroupDto = exports.UsersToRiskDataGroupDto = exports.UpsertRiskGroupDataDto = void 0;
const openapi = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const string_capitalize_1 = require("../../../shared/transformers/string-capitalize");
const string_capitalize_paragraph_1 = require("../../../shared/transformers/string-capitalize-paragraph");
const string_uppercase_transform_1 = require("../../../shared/transformers/string-uppercase.transform");
const keysOfEnum_utils_1 = require("../../../shared/utils/keysOfEnum.utils");
class UpsertRiskGroupDataDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: false, type: () => String }, name: { required: true, type: () => String }, status: { required: false, type: () => Object }, companyId: { required: true, type: () => String }, source: { required: true, type: () => String }, elaboratedBy: { required: true, type: () => String }, approvedBy: { required: true, type: () => String }, revisionBy: { required: true, type: () => String }, coordinatorBy: { required: true, type: () => String }, workspaceId: { required: false, type: () => String }, isQ5: { required: false, type: () => Boolean }, hasEmergencyPlan: { required: false, type: () => Boolean }, complementarySystems: { required: false, type: () => [String] }, complementaryDocs: { required: true, type: () => [String] }, visitDate: { required: true, type: () => Date }, validityEnd: { required: false, type: () => Date }, validityStart: { required: false, type: () => Date }, users: { required: false, type: () => [require("./risk-group-data.dto").UsersToRiskDataGroupDto] }, professionals: { required: false, type: () => [require("./risk-group-data.dto").ProfessionalToRiskDataGroupDto] } };
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpsertRiskGroupDataDto.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Transform)(string_capitalize_paragraph_1.StringCapitalizeParagraphTransform, { toClassOnly: true }),
    (0, class_validator_1.IsOptional)(),
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
    (0, class_transformer_1.Transform)(string_capitalize_1.StringCapitalizeTransform, { toClassOnly: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpsertRiskGroupDataDto.prototype, "coordinatorBy", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpsertRiskGroupDataDto.prototype, "workspaceId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpsertRiskGroupDataDto.prototype, "isQ5", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpsertRiskGroupDataDto.prototype, "hasEmergencyPlan", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpsertRiskGroupDataDto.prototype, "complementarySystems", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpsertRiskGroupDataDto.prototype, "complementaryDocs", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], UpsertRiskGroupDataDto.prototype, "visitDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], UpsertRiskGroupDataDto.prototype, "validityEnd", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], UpsertRiskGroupDataDto.prototype, "validityStart", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => UsersToRiskDataGroupDto),
    __metadata("design:type", Array)
], UpsertRiskGroupDataDto.prototype, "users", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => ProfessionalToRiskDataGroupDto),
    __metadata("design:type", Array)
], UpsertRiskGroupDataDto.prototype, "professionals", void 0);
exports.UpsertRiskGroupDataDto = UpsertRiskGroupDataDto;
class UsersToRiskDataGroupDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { riskFactorGroupDataId: { required: true, type: () => String }, userId: { required: true, type: () => Number }, isSigner: { required: true, type: () => Boolean }, isElaborator: { required: true, type: () => Boolean } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UsersToRiskDataGroupDto.prototype, "riskFactorGroupDataId", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], UsersToRiskDataGroupDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UsersToRiskDataGroupDto.prototype, "isSigner", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UsersToRiskDataGroupDto.prototype, "isElaborator", void 0);
exports.UsersToRiskDataGroupDto = UsersToRiskDataGroupDto;
class ProfessionalToRiskDataGroupDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { riskFactorGroupDataId: { required: true, type: () => String }, professionalId: { required: true, type: () => Number }, isSigner: { required: true, type: () => Boolean }, isElaborator: { required: true, type: () => Boolean } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProfessionalToRiskDataGroupDto.prototype, "riskFactorGroupDataId", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], ProfessionalToRiskDataGroupDto.prototype, "professionalId", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], ProfessionalToRiskDataGroupDto.prototype, "isSigner", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], ProfessionalToRiskDataGroupDto.prototype, "isElaborator", void 0);
exports.ProfessionalToRiskDataGroupDto = ProfessionalToRiskDataGroupDto;
//# sourceMappingURL=risk-group-data.dto.js.map