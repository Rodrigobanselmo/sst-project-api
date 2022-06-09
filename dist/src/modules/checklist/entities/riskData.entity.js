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
exports.RiskFactorDataEntity = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const hierarchy_entity_1 = require("../../company/entities/hierarchy.entity");
const homoGroup_entity_1 = require("../../company/entities/homoGroup.entity");
const risk_entity_1 = require("./risk.entity");
class RiskFactorDataEntity {
    constructor(partial) {
        Object.assign(this, partial);
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, probability: { required: true, type: () => Number }, probabilityAfter: { required: true, type: () => Number }, companyId: { required: true, type: () => String }, created_at: { required: true, type: () => Date }, deleted_at: { required: true, type: () => Date, nullable: true }, hierarchy: { required: false, type: () => require("../../company/entities/hierarchy.entity").HierarchyEntity }, hierarchyId: { required: true, type: () => String }, homogeneousGroup: { required: false, type: () => require("../../company/entities/homoGroup.entity").HomoGroupEntity }, homogeneousGroupId: { required: true, type: () => String }, riskFactor: { required: false, type: () => require("./risk.entity").RiskFactorsEntity }, riskId: { required: true, type: () => String }, riskFactorGroupDataId: { required: true, type: () => String }, recs: { required: false, type: () => [require("./recMed.entity").RecMedEntity] }, engs: { required: false, type: () => [require("./recMed.entity").RecMedEntity] }, adms: { required: false, type: () => [require("./recMed.entity").RecMedEntity] }, generateSources: { required: false, type: () => [require("./generateSource.entity").GenerateSourceEntity] }, epis: { required: false, type: () => [require("./epi.entity").EpiEntity] } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The id of the Company' }),
    __metadata("design:type", String)
], RiskFactorDataEntity.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The probability of the risk data' }),
    __metadata("design:type", Number)
], RiskFactorDataEntity.prototype, "probability", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The probability of the risk data' }),
    __metadata("design:type", Number)
], RiskFactorDataEntity.prototype, "probabilityAfter", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The company id related to the risk data' }),
    __metadata("design:type", String)
], RiskFactorDataEntity.prototype, "companyId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The creation date of the risk data' }),
    __metadata("design:type", Date)
], RiskFactorDataEntity.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The deleted date of data' }),
    __metadata("design:type", Date)
], RiskFactorDataEntity.prototype, "deleted_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The hierarchy data' }),
    __metadata("design:type", hierarchy_entity_1.HierarchyEntity)
], RiskFactorDataEntity.prototype, "hierarchy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The hierarchy id' }),
    __metadata("design:type", String)
], RiskFactorDataEntity.prototype, "hierarchyId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The homogeneous group data' }),
    __metadata("design:type", homoGroup_entity_1.HomoGroupEntity)
], RiskFactorDataEntity.prototype, "homogeneousGroup", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The homogeneous group id' }),
    __metadata("design:type", String)
], RiskFactorDataEntity.prototype, "homogeneousGroupId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The risk factor data' }),
    __metadata("design:type", risk_entity_1.RiskFactorsEntity)
], RiskFactorDataEntity.prototype, "riskFactor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The risk id' }),
    __metadata("design:type", String)
], RiskFactorDataEntity.prototype, "riskId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The risk group data id' }),
    __metadata("design:type", String)
], RiskFactorDataEntity.prototype, "riskFactorGroupDataId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The array with recommendations data',
    }),
    __metadata("design:type", Array)
], RiskFactorDataEntity.prototype, "recs", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The array with measure controls data',
    }),
    __metadata("design:type", Array)
], RiskFactorDataEntity.prototype, "engs", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The array with measure controls data',
    }),
    __metadata("design:type", Array)
], RiskFactorDataEntity.prototype, "adms", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The array with generate source data' }),
    __metadata("design:type", Array)
], RiskFactorDataEntity.prototype, "generateSources", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The array with generate source data' }),
    __metadata("design:type", Array)
], RiskFactorDataEntity.prototype, "epis", void 0);
exports.RiskFactorDataEntity = RiskFactorDataEntity;
//# sourceMappingURL=riskData.entity.js.map