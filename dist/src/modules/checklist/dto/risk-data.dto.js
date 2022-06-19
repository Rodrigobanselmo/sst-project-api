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
exports.DeleteManyRiskDataDto = exports.UpsertManyRiskDataDto = exports.UpsertRiskDataDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class UpsertRiskDataDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: false, type: () => String }, probability: { required: false, type: () => Number }, probabilityAfter: { required: false, type: () => Number }, companyId: { required: true, type: () => String }, riskId: { required: true, type: () => String }, hierarchyId: { required: true, type: () => String }, homogeneousGroupId: { required: true, type: () => String }, riskFactorGroupDataId: { required: true, type: () => String }, recs: { required: false, type: () => [String] }, engs: { required: false, type: () => [String] }, adms: { required: false, type: () => [String] }, generateSources: { required: false, type: () => [String] }, epis: { required: false, type: () => [Number] }, keepEmpty: { required: false, type: () => Boolean } };
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpsertRiskDataDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpsertRiskDataDto.prototype, "probability", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpsertRiskDataDto.prototype, "probabilityAfter", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpsertRiskDataDto.prototype, "companyId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpsertRiskDataDto.prototype, "riskId", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => !o.homogeneousGroupId || o.hierarchyId),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpsertRiskDataDto.prototype, "hierarchyId", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => !o.hierarchyId || o.homogeneousGroupId),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpsertRiskDataDto.prototype, "homogeneousGroupId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpsertRiskDataDto.prototype, "riskFactorGroupDataId", void 0);
__decorate([
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpsertRiskDataDto.prototype, "recs", void 0);
__decorate([
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpsertRiskDataDto.prototype, "engs", void 0);
__decorate([
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpsertRiskDataDto.prototype, "adms", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpsertRiskDataDto.prototype, "generateSources", void 0);
__decorate([
    (0, class_validator_1.IsInt)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpsertRiskDataDto.prototype, "epis", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpsertRiskDataDto.prototype, "keepEmpty", void 0);
exports.UpsertRiskDataDto = UpsertRiskDataDto;
class UpsertManyRiskDataDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: false, type: () => String }, probability: { required: false, type: () => Number }, probabilityAfter: { required: false, type: () => Number }, companyId: { required: true, type: () => String }, riskId: { required: true, type: () => String }, riskIds: { required: true, type: () => [String] }, hierarchyIds: { required: true, type: () => [String] }, homogeneousGroupIds: { required: true, type: () => [String] }, riskFactorGroupDataId: { required: true, type: () => String }, recs: { required: false, type: () => [String] }, engs: { required: false, type: () => [String] }, adms: { required: false, type: () => [String] }, generateSources: { required: false, type: () => [String] }, epis: { required: false, type: () => [Number] } };
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpsertManyRiskDataDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpsertManyRiskDataDto.prototype, "probability", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpsertManyRiskDataDto.prototype, "probabilityAfter", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpsertManyRiskDataDto.prototype, "companyId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpsertManyRiskDataDto.prototype, "riskId", void 0);
__decorate([
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpsertManyRiskDataDto.prototype, "riskIds", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => !o.homogeneousGroupIds || o.hierarchyIds),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpsertManyRiskDataDto.prototype, "hierarchyIds", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => !o.hierarchyIds || o.homogeneousGroupIds),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpsertManyRiskDataDto.prototype, "homogeneousGroupIds", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpsertManyRiskDataDto.prototype, "riskFactorGroupDataId", void 0);
__decorate([
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpsertManyRiskDataDto.prototype, "recs", void 0);
__decorate([
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpsertManyRiskDataDto.prototype, "engs", void 0);
__decorate([
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpsertManyRiskDataDto.prototype, "adms", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpsertManyRiskDataDto.prototype, "generateSources", void 0);
__decorate([
    (0, class_validator_1.IsInt)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpsertManyRiskDataDto.prototype, "epis", void 0);
exports.UpsertManyRiskDataDto = UpsertManyRiskDataDto;
class DeleteManyRiskDataDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { riskIds: { required: true, type: () => [String] }, homogeneousGroupIds: { required: true, type: () => [String] } };
    }
}
__decorate([
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], DeleteManyRiskDataDto.prototype, "riskIds", void 0);
__decorate([
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], DeleteManyRiskDataDto.prototype, "homogeneousGroupIds", void 0);
exports.DeleteManyRiskDataDto = DeleteManyRiskDataDto;
//# sourceMappingURL=risk-data.dto.js.map