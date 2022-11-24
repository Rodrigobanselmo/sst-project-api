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
exports.FindHomogeneousGroupDto = exports.CopyHomogeneousGroupDto = exports.UpdateHierarchyHomoGroupDto = exports.UpdateHomoGroupDto = exports.CreateHomoGroupDto = exports.HierarchyOnHomoDto = void 0;
const query_array_1 = require("./../../../shared/transformers/query-array");
const pagination_dto_1 = require("./../../../shared/dto/pagination.dto");
const client_1 = require("@prisma/client");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const string_capitalize_paragraph_1 = require("../../../shared/transformers/string-capitalize-paragraph");
const string_uppercase_transform_1 = require("../../../shared/transformers/string-uppercase.transform");
const keysOfEnum_utils_1 = require("../../../shared/utils/keysOfEnum.utils");
class HierarchyOnHomoDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HierarchyOnHomoDto.prototype, "workspaceId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HierarchyOnHomoDto.prototype, "id", void 0);
exports.HierarchyOnHomoDto = HierarchyOnHomoDto;
class CreateHomoGroupDto {
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateHomoGroupDto.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Transform)(string_capitalize_paragraph_1.StringCapitalizeParagraphTransform, { toClassOnly: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateHomoGroupDto.prototype, "name", void 0);
__decorate([
    (0, class_transformer_1.Transform)(string_uppercase_transform_1.StringUppercaseTransform, { toClassOnly: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEnum)(client_1.HomoTypeEnum, {
        message: `type must be one of: ${(0, keysOfEnum_utils_1.KeysOfEnum)(client_1.HomoTypeEnum)}`,
    }),
    __metadata("design:type", String)
], CreateHomoGroupDto.prototype, "type", void 0);
__decorate([
    (0, class_transformer_1.Transform)(string_capitalize_paragraph_1.StringCapitalizeParagraphTransform, { toClassOnly: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateHomoGroupDto.prototype, "description", void 0);
__decorate([
    (0, class_transformer_1.Transform)(string_uppercase_transform_1.StringUppercaseTransform, { toClassOnly: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.StatusEnum, {
        message: `status must be one of: ${client_1.StatusEnum.ACTIVE} or ${client_1.StatusEnum.INACTIVE}`,
    }),
    __metadata("design:type", String)
], CreateHomoGroupDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateHomoGroupDto.prototype, "companyId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], CreateHomoGroupDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], CreateHomoGroupDto.prototype, "endDate", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => HierarchyOnHomoDto),
    __metadata("design:type", Array)
], CreateHomoGroupDto.prototype, "hierarchies", void 0);
exports.CreateHomoGroupDto = CreateHomoGroupDto;
class UpdateHomoGroupDto {
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateHomoGroupDto.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Transform)(string_uppercase_transform_1.StringUppercaseTransform, { toClassOnly: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEnum)(client_1.HomoTypeEnum, {
        message: `type must be one of: ${(0, keysOfEnum_utils_1.KeysOfEnum)(client_1.HomoTypeEnum)}`,
    }),
    __metadata("design:type", String)
], UpdateHomoGroupDto.prototype, "type", void 0);
__decorate([
    (0, class_transformer_1.Transform)(string_capitalize_paragraph_1.StringCapitalizeParagraphTransform, { toClassOnly: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateHomoGroupDto.prototype, "description", void 0);
__decorate([
    (0, class_transformer_1.Transform)(string_capitalize_paragraph_1.StringCapitalizeParagraphTransform, { toClassOnly: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], UpdateHomoGroupDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], UpdateHomoGroupDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], UpdateHomoGroupDto.prototype, "endDate", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => HierarchyOnHomoDto),
    __metadata("design:type", Array)
], UpdateHomoGroupDto.prototype, "hierarchies", void 0);
exports.UpdateHomoGroupDto = UpdateHomoGroupDto;
class UpdateHierarchyHomoGroupDto {
}
__decorate([
    (0, class_validator_1.IsInt)({ each: true }),
    __metadata("design:type", Array)
], UpdateHierarchyHomoGroupDto.prototype, "ids", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], UpdateHierarchyHomoGroupDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], UpdateHierarchyHomoGroupDto.prototype, "endDate", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateHierarchyHomoGroupDto.prototype, "workspaceId", void 0);
exports.UpdateHierarchyHomoGroupDto = UpdateHierarchyHomoGroupDto;
class CopyHomogeneousGroupDto {
}
__decorate([
    (0, class_validator_1.ValidateIf)((o) => !o.hierarchyId || o.actualGroupId),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CopyHomogeneousGroupDto.prototype, "actualGroupId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CopyHomogeneousGroupDto.prototype, "riskGroupId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CopyHomogeneousGroupDto.prototype, "copyFromHomoGroupId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CopyHomogeneousGroupDto.prototype, "companyIdFrom", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CopyHomogeneousGroupDto.prototype, "riskGroupIdFrom", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CopyHomogeneousGroupDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CopyHomogeneousGroupDto.prototype, "workspaceId", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => !o.actualGroupId || o.hierarchyId),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CopyHomogeneousGroupDto.prototype, "hierarchyId", void 0);
exports.CopyHomogeneousGroupDto = CopyHomogeneousGroupDto;
class FindHomogeneousGroupDto extends pagination_dto_1.PaginationQueryDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FindHomogeneousGroupDto.prototype, "search", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FindHomogeneousGroupDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FindHomogeneousGroupDto.prototype, "companyId", void 0);
__decorate([
    (0, class_transformer_1.Transform)(query_array_1.QueryArray, { toClassOnly: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsEnum)(client_1.HomoTypeEnum, {
        each: true,
        message: `type must be one of: ${(0, keysOfEnum_utils_1.KeysOfEnum)(client_1.HomoTypeEnum)}`,
    }),
    __metadata("design:type", Array)
], FindHomogeneousGroupDto.prototype, "type", void 0);
exports.FindHomogeneousGroupDto = FindHomogeneousGroupDto;
//# sourceMappingURL=homoGroup.js.map