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
exports.HierarchyEntity = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class HierarchyEntity {
    constructor(partial) {
        Object.assign(this, partial);
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, name: { required: true, type: () => String }, description: { required: true, type: () => String }, realDescription: { required: true, type: () => String }, status: { required: true, type: () => Object }, companyId: { required: true, type: () => String }, created_at: { required: true, type: () => Date }, type: { required: true, type: () => Object }, parentId: { required: true, type: () => String }, workspaces: { required: false, type: () => [require("./workspace.entity").WorkspaceEntity] }, hierarchyOnHomogeneous: { required: false, type: () => [require("./homoGroup.entity").HierarchyOnHomogeneousEntity] }, homogeneousGroups: { required: false, type: () => [require("./homoGroup.entity").HomoGroupEntity] }, employees: { required: false, type: () => [require("./employee.entity").EmployeeEntity] }, workspaceIds: { required: false, type: () => [String] }, children: { required: false, type: () => [Object] }, workspaceId: { required: false, type: () => String } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The id of the Hierarchy' }),
    __metadata("design:type", String)
], HierarchyEntity.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The name of the Hierarchy' }),
    __metadata("design:type", String)
], HierarchyEntity.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The description of the Hierarchy' }),
    __metadata("design:type", String)
], HierarchyEntity.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The real description of the Hierarchy' }),
    __metadata("design:type", String)
], HierarchyEntity.prototype, "realDescription", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The current status of the Hierarchy',
        examples: [client_1.StatusEnum.ACTIVE, client_1.StatusEnum.INACTIVE],
    }),
    __metadata("design:type", String)
], HierarchyEntity.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The company id of the Hierarchy',
    }),
    __metadata("design:type", String)
], HierarchyEntity.prototype, "companyId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The creation date of the Hierarchy' }),
    __metadata("design:type", Date)
], HierarchyEntity.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The current status of the Hierarchy',
        examples: [...Object.values(client_1.HierarchyEnum)],
    }),
    __metadata("design:type", String)
], HierarchyEntity.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The parent id of the Hierarchy' }),
    __metadata("design:type", String)
], HierarchyEntity.prototype, "parentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The workspace of the Hierarchy' }),
    __metadata("design:type", Array)
], HierarchyEntity.prototype, "workspaces", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The group of the Hierarchy' }),
    __metadata("design:type", Array)
], HierarchyEntity.prototype, "hierarchyOnHomogeneous", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The group of the Hierarchy' }),
    __metadata("design:type", Array)
], HierarchyEntity.prototype, "homogeneousGroups", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The workspace of the Hierarchy' }),
    __metadata("design:type", Array)
], HierarchyEntity.prototype, "employees", void 0);
exports.HierarchyEntity = HierarchyEntity;
//# sourceMappingURL=hierarchy.entity.js.map