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
exports.CopyCharacterizationDto = exports.UpdatePhotoCharacterizationDto = exports.AddPhotoCharacterizationDto = exports.UpsertCharacterizationDto = void 0;
const openapi = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const string_capitalize_1 = require("../../../shared/transformers/string-capitalize");
const string_capitalize_paragraph_1 = require("../../../shared/transformers/string-capitalize-paragraph");
const string_uppercase_transform_1 = require("../../../shared/transformers/string-uppercase.transform");
const keysOfEnum_utils_1 = require("../../../shared/utils/keysOfEnum.utils");
class UpsertCharacterizationDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: false, type: () => String }, name: { required: false, type: () => String }, type: { required: false, type: () => Object }, description: { required: false, type: () => String }, photos: { required: false, type: () => [String] }, order: { required: false, type: () => Number }, hierarchyIds: { required: false, type: () => [String] }, paragraphs: { required: false, type: () => [String] }, considerations: { required: false, type: () => [String] }, activities: { required: false, type: () => [String] }, noiseValue: { required: false, type: () => String }, temperature: { required: false, type: () => String }, moisturePercentage: { required: false, type: () => String }, luminosity: { required: false, type: () => String }, profileName: { required: false, type: () => String }, profileParentId: { required: false, type: () => String }, startDate: { required: false, type: () => Date }, endDate: { required: false, type: () => Date } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpsertCharacterizationDto.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Transform)(string_capitalize_paragraph_1.StringCapitalizeParagraphTransform, { toClassOnly: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpsertCharacterizationDto.prototype, "name", void 0);
__decorate([
    (0, class_transformer_1.Transform)(string_uppercase_transform_1.StringUppercaseTransform, { toClassOnly: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.CharacterizationTypeEnum, {
        message: `type must be one of: ${(0, keysOfEnum_utils_1.KeysOfEnum)(client_1.CharacterizationTypeEnum)}`,
    }),
    __metadata("design:type", String)
], UpsertCharacterizationDto.prototype, "type", void 0);
__decorate([
    (0, class_transformer_1.Transform)(string_capitalize_paragraph_1.StringCapitalizeParagraphTransform, { toClassOnly: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpsertCharacterizationDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpsertCharacterizationDto.prototype, "photos", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpsertCharacterizationDto.prototype, "order", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpsertCharacterizationDto.prototype, "hierarchyIds", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpsertCharacterizationDto.prototype, "paragraphs", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpsertCharacterizationDto.prototype, "considerations", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpsertCharacterizationDto.prototype, "activities", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpsertCharacterizationDto.prototype, "noiseValue", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpsertCharacterizationDto.prototype, "temperature", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpsertCharacterizationDto.prototype, "moisturePercentage", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpsertCharacterizationDto.prototype, "luminosity", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpsertCharacterizationDto.prototype, "profileName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpsertCharacterizationDto.prototype, "profileParentId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], UpsertCharacterizationDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], UpsertCharacterizationDto.prototype, "endDate", void 0);
exports.UpsertCharacterizationDto = UpsertCharacterizationDto;
class AddPhotoCharacterizationDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { companyCharacterizationId: { required: true, type: () => String }, name: { required: true, type: () => String, maxLength: 250 } };
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddPhotoCharacterizationDto.prototype, "companyCharacterizationId", void 0);
__decorate([
    (0, class_transformer_1.Transform)(string_capitalize_1.StringCapitalizeTransform, { toClassOnly: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(250, {
        message: 'A imagem deve ter uma descrição com até 250 caracteres',
    }),
    __metadata("design:type", String)
], AddPhotoCharacterizationDto.prototype, "name", void 0);
exports.AddPhotoCharacterizationDto = AddPhotoCharacterizationDto;
class UpdatePhotoCharacterizationDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: false, type: () => String }, order: { required: true, type: () => Number }, name: { required: true, type: () => String, maxLength: 100 } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePhotoCharacterizationDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdatePhotoCharacterizationDto.prototype, "order", void 0);
__decorate([
    (0, class_transformer_1.Transform)(string_capitalize_1.StringCapitalizeTransform, { toClassOnly: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], UpdatePhotoCharacterizationDto.prototype, "name", void 0);
exports.UpdatePhotoCharacterizationDto = UpdatePhotoCharacterizationDto;
class CopyCharacterizationDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { companyCopyFromId: { required: true, type: () => String }, workspaceId: { required: true, type: () => String }, characterizationIds: { required: true, type: () => [String] } };
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CopyCharacterizationDto.prototype, "companyCopyFromId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CopyCharacterizationDto.prototype, "workspaceId", void 0);
__decorate([
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CopyCharacterizationDto.prototype, "characterizationIds", void 0);
exports.CopyCharacterizationDto = CopyCharacterizationDto;
//# sourceMappingURL=characterization.dto.js.map