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
exports.WorkspaceEntity = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const address_entity_1 = require("./address.entity");
const company_entity_1 = require("./company.entity");
class WorkspaceEntity {
    constructor(partial) {
        Object.assign(this, partial);
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, name: { required: true, type: () => String }, status: { required: true, type: () => Object }, created_at: { required: true, type: () => Date }, updated_at: { required: true, type: () => Date }, companyId: { required: true, type: () => String }, address: { required: false, type: () => require("./address.entity").AddressEntity }, company: { required: false, type: () => require("./company.entity").CompanyEntity }, description: { required: true, type: () => String }, employeeCount: { required: false, type: () => Number }, abbreviation: { required: true, type: () => String } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The id of the Workspace' }),
    __metadata("design:type", String)
], WorkspaceEntity.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The name of the Workspace' }),
    __metadata("design:type", String)
], WorkspaceEntity.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The current status of the Workspace',
        examples: ['ACTIVE', 'PENDING', 'CANCELED'],
    }),
    __metadata("design:type", String)
], WorkspaceEntity.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The creation date of the Workspace' }),
    __metadata("design:type", Date)
], WorkspaceEntity.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The last time that the Workspace data was updated',
    }),
    __metadata("design:type", Date)
], WorkspaceEntity.prototype, "updated_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The company id related to the Workspace' }),
    __metadata("design:type", String)
], WorkspaceEntity.prototype, "companyId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The address related to the Workspace' }),
    __metadata("design:type", address_entity_1.AddressEntity)
], WorkspaceEntity.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The company related to the workspace' }),
    __metadata("design:type", company_entity_1.CompanyEntity)
], WorkspaceEntity.prototype, "company", void 0);
exports.WorkspaceEntity = WorkspaceEntity;
//# sourceMappingURL=workspace.entity.js.map