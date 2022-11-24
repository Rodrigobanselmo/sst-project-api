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
exports.HierarchyOnHomogeneousEntity = exports.HomoGroupEntity = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const hierarchy_entity_1 = require("./hierarchy.entity");
class HomoGroupEntity {
    constructor(partial) {
        Object.assign(this, partial);
        if (this.type === 'HIERARCHY' && !this.hierarchy && this.hierarchyOnHomogeneous && this.hierarchyOnHomogeneous[0]) {
            this.hierarchy = new hierarchy_entity_1.HierarchyEntity(this.hierarchyOnHomogeneous[0].hierarchy);
        }
        if (this.hierarchyOnHomogeneous && !this.hierarchies) {
            this.hierarchies = Object.values(this.hierarchyOnHomogeneous.reduce((acc, curr) => {
                if (!curr.hierarchy)
                    return acc;
                if (!acc[curr.hierarchyId])
                    acc[curr.hierarchyId] = curr.hierarchy;
                if (!acc[curr.hierarchyId].hierarchyOnHomogeneous)
                    acc[curr.hierarchyId].hierarchyOnHomogeneous = [];
                delete curr.hierarchy;
                acc[curr.hierarchyId].hierarchyOnHomogeneous.push(curr);
                return acc;
            }, {}));
        }
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, name: { required: true, type: () => String }, description: { required: true, type: () => String }, status: { required: true, type: () => Object }, companyId: { required: true, type: () => String }, created_at: { required: true, type: () => Date }, hierarchyOnHomogeneous: { required: false, type: () => [require("./homoGroup.entity").HierarchyOnHomogeneousEntity] }, hierarchies: { required: false, type: () => [require("./hierarchy.entity").HierarchyEntity] }, type: { required: true, type: () => Object }, workspaceId: { required: false, type: () => String }, workspaceIds: { required: false, type: () => [String] }, riskFactorData: { required: false, type: () => [require("../../sst/entities/riskData.entity").RiskFactorDataEntity] }, characterization: { required: false, type: () => require("./characterization.entity").CharacterizationEntity }, environment: { required: false, type: () => require("./environment.entity").EnvironmentEntity }, hierarchy: { required: false, type: () => require("./hierarchy.entity").HierarchyEntity }, deletedAt: { required: true, type: () => Date }, employeeCount: { required: false, type: () => Number } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The id of the HomogeneousGroup' }),
    __metadata("design:type", String)
], HomoGroupEntity.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The name of the HomogeneousGroup' }),
    __metadata("design:type", String)
], HomoGroupEntity.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The name of the HomogeneousGroup' }),
    __metadata("design:type", String)
], HomoGroupEntity.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The current status of the HomogeneousGroup',
        examples: [client_1.StatusEnum.ACTIVE, client_1.StatusEnum.INACTIVE],
    }),
    __metadata("design:type", String)
], HomoGroupEntity.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The company id of the HomogeneousGroup',
    }),
    __metadata("design:type", String)
], HomoGroupEntity.prototype, "companyId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The creation date of the HomogeneousGroup' }),
    __metadata("design:type", Date)
], HomoGroupEntity.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The hierarchies of the HomogeneousGroup' }),
    __metadata("design:type", Array)
], HomoGroupEntity.prototype, "hierarchies", void 0);
exports.HomoGroupEntity = HomoGroupEntity;
class HierarchyOnHomogeneousEntity {
    constructor(partial) {
        Object.assign(this, partial);
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, hierarchyId: { required: true, type: () => String }, homogeneousGroupId: { required: true, type: () => String }, workspaceId: { required: true, type: () => String }, hierarchy: { required: false, type: () => require("./hierarchy.entity").HierarchyEntity }, workspace: { required: false, type: () => require("./workspace.entity").WorkspaceEntity }, homogeneousGroup: { required: false, type: () => require("./homoGroup.entity").HomoGroupEntity }, endDate: { required: true, type: () => Date }, startDate: { required: true, type: () => Date }, deletedAt: { required: true, type: () => Date } };
    }
}
exports.HierarchyOnHomogeneousEntity = HierarchyOnHomogeneousEntity;
//# sourceMappingURL=homoGroup.entity.js.map