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
exports.EmployeeEntity = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const hierarchy_entity_1 = require("./hierarchy.entity");
class EmployeeEntity {
    constructor(partial) {
        Object.assign(this, partial);
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, name: { required: true, type: () => String }, cpf: { required: true, type: () => String }, status: { required: true, type: () => Object }, companyId: { required: true, type: () => String }, created_at: { required: true, type: () => Date }, updated_at: { required: true, type: () => Date }, hierarchyId: { required: true, type: () => String }, workspaces: { required: false, type: () => [require("./workspace.entity").WorkspaceEntity] }, hierarchy: { required: false, type: () => require("./hierarchy.entity").HierarchyEntity }, directory: { required: false, type: () => String }, management: { required: false, type: () => String }, sector: { required: false, type: () => String }, sub_sector: { required: false, type: () => String }, office: { required: false, type: () => String }, sub_office: { required: false, type: () => String }, birthdate: { required: true, type: () => Date }, admissionDate: { required: true, type: () => Date } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The id of the Employee' }),
    __metadata("design:type", Number)
], EmployeeEntity.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The name of the Employee' }),
    __metadata("design:type", String)
], EmployeeEntity.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The cpf name of the Employee' }),
    __metadata("design:type", String)
], EmployeeEntity.prototype, "cpf", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The current status of the Employee',
        examples: ['ACTIVE', 'INACTIVE'],
    }),
    __metadata("design:type", String)
], EmployeeEntity.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The company id of the employee',
    }),
    __metadata("design:type", String)
], EmployeeEntity.prototype, "companyId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The creation date of the Employee' }),
    __metadata("design:type", Date)
], EmployeeEntity.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The last time that the Employee data was updated',
    }),
    __metadata("design:type", Date)
], EmployeeEntity.prototype, "updated_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The hierarchy id of the Employee' }),
    __metadata("design:type", String)
], EmployeeEntity.prototype, "hierarchyId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The workspaces related to the Employee' }),
    __metadata("design:type", Array)
], EmployeeEntity.prototype, "workspaces", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The hierarchy of the Employee' }),
    __metadata("design:type", hierarchy_entity_1.HierarchyEntity)
], EmployeeEntity.prototype, "hierarchy", void 0);
exports.EmployeeEntity = EmployeeEntity;
//# sourceMappingURL=employee.entity.js.map