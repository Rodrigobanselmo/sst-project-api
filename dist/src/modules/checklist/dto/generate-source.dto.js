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
exports.RiskUpdateGenerateSourceDto = exports.RiskCreateGenerateSourceDto = exports.UpdateGenerateSourceDto = exports.UpsertGenerateSourceDto = exports.CreateGenerateSourceDto = void 0;
const openapi = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const string_capitalize_paragraph_1 = require("../../../shared/transformers/string-capitalize-paragraph");
const string_uppercase_transform_1 = require("../../../shared/transformers/string-uppercase.transform");
const keysOfEnum_utils_1 = require("../../../shared/utils/keysOfEnum.utils");
const rec_med_dto_1 = require("./rec-med.dto");
class CreateGenerateSourceDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { riskId: { required: true, type: () => String }, name: { required: true, type: () => String }, status: { required: false, type: () => Object }, companyId: { required: true, type: () => String }, recMeds: { required: false, type: () => [require("./rec-med.dto").RiskCreateRecMedDto] } };
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateGenerateSourceDto.prototype, "riskId", void 0);
__decorate([
    (0, class_transformer_1.Transform)(string_capitalize_paragraph_1.StringCapitalizeParagraphTransform, { toClassOnly: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateGenerateSourceDto.prototype, "name", void 0);
__decorate([
    (0, class_transformer_1.Transform)(string_uppercase_transform_1.StringUppercaseTransform, { toClassOnly: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEnum)(client_1.StatusEnum, {
        message: `type must be one of: ${(0, keysOfEnum_utils_1.KeysOfEnum)(client_1.StatusEnum)}`,
    }),
    __metadata("design:type", String)
], CreateGenerateSourceDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateGenerateSourceDto.prototype, "companyId", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => rec_med_dto_1.RiskCreateRecMedDto),
    __metadata("design:type", Array)
], CreateGenerateSourceDto.prototype, "recMeds", void 0);
exports.CreateGenerateSourceDto = CreateGenerateSourceDto;
class UpsertGenerateSourceDto extends CreateGenerateSourceDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpsertGenerateSourceDto.prototype, "id", void 0);
exports.UpsertGenerateSourceDto = UpsertGenerateSourceDto;
class UpdateGenerateSourceDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String }, status: { required: false, type: () => Object }, companyId: { required: true, type: () => String }, recMeds: { required: false, type: () => [require("./rec-med.dto").RiskUpdateRecMedDto] } };
    }
}
__decorate([
    (0, class_transformer_1.Transform)(string_capitalize_paragraph_1.StringCapitalizeParagraphTransform, { toClassOnly: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateGenerateSourceDto.prototype, "name", void 0);
__decorate([
    (0, class_transformer_1.Transform)(string_uppercase_transform_1.StringUppercaseTransform, { toClassOnly: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEnum)(client_1.StatusEnum, {
        message: `type must be one of: ${(0, keysOfEnum_utils_1.KeysOfEnum)(client_1.StatusEnum)}`,
    }),
    __metadata("design:type", String)
], UpdateGenerateSourceDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateGenerateSourceDto.prototype, "companyId", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => rec_med_dto_1.RiskUpdateRecMedDto),
    __metadata("design:type", Array)
], UpdateGenerateSourceDto.prototype, "recMeds", void 0);
exports.UpdateGenerateSourceDto = UpdateGenerateSourceDto;
class RiskCreateGenerateSourceDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String }, status: { required: false, type: () => Object } };
    }
}
__decorate([
    (0, class_transformer_1.Transform)(string_capitalize_paragraph_1.StringCapitalizeParagraphTransform, { toClassOnly: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RiskCreateGenerateSourceDto.prototype, "name", void 0);
__decorate([
    (0, class_transformer_1.Transform)(string_uppercase_transform_1.StringUppercaseTransform, { toClassOnly: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEnum)(client_1.StatusEnum, {
        message: `type must be one of: ${(0, keysOfEnum_utils_1.KeysOfEnum)(client_1.StatusEnum)}`,
    }),
    __metadata("design:type", String)
], RiskCreateGenerateSourceDto.prototype, "status", void 0);
exports.RiskCreateGenerateSourceDto = RiskCreateGenerateSourceDto;
class RiskUpdateGenerateSourceDto extends RiskCreateGenerateSourceDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RiskUpdateGenerateSourceDto.prototype, "id", void 0);
exports.RiskUpdateGenerateSourceDto = RiskUpdateGenerateSourceDto;
//# sourceMappingURL=generate-source.dto.js.map