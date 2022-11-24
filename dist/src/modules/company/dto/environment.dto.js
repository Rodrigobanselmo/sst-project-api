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
exports.UpdatePhotoEnvironmentDto = exports.AddPhotoEnvironmentDto = exports.UpsertEnvironmentDto = void 0;
const openapi = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const string_capitalize_1 = require("../../../shared/transformers/string-capitalize");
const string_capitalize_paragraph_1 = require("../../../shared/transformers/string-capitalize-paragraph");
const keysOfEnum_utils_1 = require("../../../shared/utils/keysOfEnum.utils");
const string_uppercase_transform_1 = require("../../../shared/transformers/string-uppercase.transform");
class UpsertEnvironmentDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: false, type: () => String }, name: { required: false, type: () => String, maxLength: 100 }, type: { required: false, type: () => Object }, description: { required: false, type: () => String }, photos: { required: false, type: () => [String] }, order: { required: false, type: () => Number }, hierarchyIds: { required: false, type: () => [String] }, considerations: { required: false, type: () => [String] }, activities: { required: false, type: () => [String] }, noiseValue: { required: false, type: () => String }, temperature: { required: false, type: () => String }, moisturePercentage: { required: false, type: () => String }, luminosity: { required: false, type: () => String }, profileName: { required: true, type: () => String }, profileParentId: { required: true, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpsertEnvironmentDto.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Transform)(string_capitalize_paragraph_1.StringCapitalizeParagraphTransform, { toClassOnly: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], UpsertEnvironmentDto.prototype, "name", void 0);
__decorate([
    (0, class_transformer_1.Transform)(string_uppercase_transform_1.StringUppercaseTransform, { toClassOnly: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.CharacterizationTypeEnum, {
        message: `type must be one of: ${(0, keysOfEnum_utils_1.KeysOfEnum)(client_1.CharacterizationTypeEnum)}`,
    }),
    __metadata("design:type", String)
], UpsertEnvironmentDto.prototype, "type", void 0);
__decorate([
    (0, class_transformer_1.Transform)(string_capitalize_paragraph_1.StringCapitalizeParagraphTransform, { toClassOnly: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpsertEnvironmentDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpsertEnvironmentDto.prototype, "photos", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpsertEnvironmentDto.prototype, "order", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpsertEnvironmentDto.prototype, "hierarchyIds", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpsertEnvironmentDto.prototype, "considerations", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpsertEnvironmentDto.prototype, "activities", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpsertEnvironmentDto.prototype, "noiseValue", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpsertEnvironmentDto.prototype, "temperature", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpsertEnvironmentDto.prototype, "moisturePercentage", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpsertEnvironmentDto.prototype, "luminosity", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpsertEnvironmentDto.prototype, "profileName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpsertEnvironmentDto.prototype, "profileParentId", void 0);
exports.UpsertEnvironmentDto = UpsertEnvironmentDto;
class AddPhotoEnvironmentDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { companyCharacterizationId: { required: true, type: () => String }, name: { required: true, type: () => String, maxLength: 100 } };
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddPhotoEnvironmentDto.prototype, "companyCharacterizationId", void 0);
__decorate([
    (0, class_transformer_1.Transform)(string_capitalize_1.StringCapitalizeTransform, { toClassOnly: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], AddPhotoEnvironmentDto.prototype, "name", void 0);
exports.AddPhotoEnvironmentDto = AddPhotoEnvironmentDto;
class UpdatePhotoEnvironmentDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: false, type: () => String }, order: { required: true, type: () => Number }, name: { required: true, type: () => String, maxLength: 100 } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePhotoEnvironmentDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdatePhotoEnvironmentDto.prototype, "order", void 0);
__decorate([
    (0, class_transformer_1.Transform)(string_capitalize_1.StringCapitalizeTransform, { toClassOnly: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], UpdatePhotoEnvironmentDto.prototype, "name", void 0);
exports.UpdatePhotoEnvironmentDto = UpdatePhotoEnvironmentDto;
//# sourceMappingURL=environment.dto.js.map