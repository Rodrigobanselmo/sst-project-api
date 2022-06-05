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
exports.UpsertManyHierarchyDto = exports.UpsertHierarchyDto = exports.UpdateHierarchyDto = exports.CreateHierarchyDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const string_capitalize_1 = require("../../../shared/transformers/string-capitalize");
const string_uppercase_transform_1 = require("../../../shared/transformers/string-uppercase.transform");
class CreateHierarchyDto {
}
__decorate([
    (0, class_transformer_1.Transform)(string_capitalize_1.StringCapitalizeTransform, { toClassOnly: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateHierarchyDto.prototype, "name", void 0);
__decorate([
    (0, class_transformer_1.Transform)(string_uppercase_transform_1.StringUppercaseTransform, { toClassOnly: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.StatusEnum, {
        message: `status must be one of: ${client_1.StatusEnum.ACTIVE} or ${client_1.StatusEnum.INACTIVE}`,
    }),
    __metadata("design:type", String)
], CreateHierarchyDto.prototype, "status", void 0);
__decorate([
    (0, class_transformer_1.Transform)(string_uppercase_transform_1.StringUppercaseTransform, { toClassOnly: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEnum)(client_1.HierarchyEnum, {
        message: `type must be one of: ${client_1.HierarchyEnum.DIRECTORY} or ${client_1.HierarchyEnum.MANAGEMENT} or ${client_1.HierarchyEnum.SECTOR} or ${client_1.HierarchyEnum.OFFICE}`,
    }),
    __metadata("design:type", String)
], CreateHierarchyDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateHierarchyDto.prototype, "companyId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateHierarchyDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateHierarchyDto.prototype, "workspaceIds", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateHierarchyDto.prototype, "parentId", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => CreateHierarchyDto),
    __metadata("design:type", Array)
], CreateHierarchyDto.prototype, "children", void 0);
exports.CreateHierarchyDto = CreateHierarchyDto;
class UpdateHierarchyDto extends (0, swagger_1.PartialType)(CreateHierarchyDto) {
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateHierarchyDto.prototype, "id", void 0);
exports.UpdateHierarchyDto = UpdateHierarchyDto;
class UpsertHierarchyDto {
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpsertHierarchyDto.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Transform)(string_capitalize_1.StringCapitalizeTransform, { toClassOnly: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], UpsertHierarchyDto.prototype, "name", void 0);
__decorate([
    (0, class_transformer_1.Transform)(string_uppercase_transform_1.StringUppercaseTransform, { toClassOnly: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.StatusEnum, {
        message: `status must be one of: ${client_1.StatusEnum.ACTIVE} or ${client_1.StatusEnum.INACTIVE}`,
    }),
    __metadata("design:type", String)
], UpsertHierarchyDto.prototype, "status", void 0);
__decorate([
    (0, class_transformer_1.Transform)(string_uppercase_transform_1.StringUppercaseTransform, { toClassOnly: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.HierarchyEnum, {
        message: `type must be one of: ${client_1.HierarchyEnum.DIRECTORY} or ${client_1.HierarchyEnum.MANAGEMENT} or ${client_1.HierarchyEnum.SECTOR} or ${client_1.HierarchyEnum.OFFICE}`,
    }),
    __metadata("design:type", String)
], UpsertHierarchyDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpsertHierarchyDto.prototype, "companyId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpsertHierarchyDto.prototype, "workspaceIds", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpsertHierarchyDto.prototype, "parentId", void 0);
exports.UpsertHierarchyDto = UpsertHierarchyDto;
class UpsertManyHierarchyDto {
}
__decorate([
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => UpsertHierarchyDto),
    __metadata("design:type", Array)
], UpsertManyHierarchyDto.prototype, "data", void 0);
exports.UpsertManyHierarchyDto = UpsertManyHierarchyDto;
//# sourceMappingURL=hierarchy.js.map