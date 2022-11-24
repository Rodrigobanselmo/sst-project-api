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
exports.UploadPgrActionPlanDto = exports.UpsertPcmsoDocumentDto = exports.UpsertPgrDocumentDto = exports.UpsertDocumentDto = void 0;
const openapi = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const string_uppercase_transform_1 = require("../../../shared/transformers/string-uppercase.transform");
const keysOfEnum_utils_1 = require("../../../shared/utils/keysOfEnum.utils");
class UpsertDocumentDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: false, type: () => String }, riskGroupId: { required: true, type: () => String }, pcmsoId: { required: true, type: () => String }, name: { required: true, type: () => String }, version: { required: true, type: () => String }, description: { required: false, type: () => String }, status: { required: false, type: () => Object }, companyId: { required: true, type: () => String }, workspaceId: { required: true, type: () => String }, workspaceName: { required: true, type: () => String }, isPGR: { required: true, type: () => Boolean }, isPCMSO: { required: true, type: () => Boolean } };
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpsertDocumentDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpsertDocumentDto.prototype, "riskGroupId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpsertDocumentDto.prototype, "pcmsoId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpsertDocumentDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpsertDocumentDto.prototype, "version", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpsertDocumentDto.prototype, "description", void 0);
__decorate([
    (0, class_transformer_1.Transform)(string_uppercase_transform_1.StringUppercaseTransform, { toClassOnly: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEnum)(client_1.StatusEnum, {
        message: `type must be one of: ${(0, keysOfEnum_utils_1.KeysOfEnum)(client_1.StatusEnum)}`,
    }),
    __metadata("design:type", String)
], UpsertDocumentDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpsertDocumentDto.prototype, "companyId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpsertDocumentDto.prototype, "workspaceId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpsertDocumentDto.prototype, "workspaceName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpsertDocumentDto.prototype, "isPGR", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpsertDocumentDto.prototype, "isPCMSO", void 0);
exports.UpsertDocumentDto = UpsertDocumentDto;
class UpsertPgrDocumentDto extends UpsertDocumentDto {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpsertPgrDocumentDto = UpsertPgrDocumentDto;
class UpsertPcmsoDocumentDto extends UpsertDocumentDto {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpsertPcmsoDocumentDto = UpsertPcmsoDocumentDto;
class UploadPgrActionPlanDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { riskGroupId: { required: true, type: () => String }, companyId: { required: true, type: () => String }, workspaceId: { required: true, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UploadPgrActionPlanDto.prototype, "riskGroupId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UploadPgrActionPlanDto.prototype, "companyId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UploadPgrActionPlanDto.prototype, "workspaceId", void 0);
exports.UploadPgrActionPlanDto = UploadPgrActionPlanDto;
//# sourceMappingURL=pgr.dto.js.map