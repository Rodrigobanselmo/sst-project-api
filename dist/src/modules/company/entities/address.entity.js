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
exports.AddressEntity = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const workspace_entity_1 = require("./workspace.entity");
const client_1 = require("@prisma/client");
class AddressEntity {
    constructor(partial) {
        Object.assign(this, partial);
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, number: { required: true, type: () => String }, cep: { required: true, type: () => String }, street: { required: true, type: () => String }, complement: { required: true, type: () => String }, neighborhood: { required: true, type: () => String }, city: { required: true, type: () => String }, state: { required: true, type: () => Object }, companyId: { required: true, type: () => String }, workspaceId: { required: true, type: () => String }, workspace: { required: false, type: () => require("./workspace.entity").WorkspaceEntity } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'address id.' }),
    __metadata("design:type", String)
], AddressEntity.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'address number.' }),
    __metadata("design:type", String)
], AddressEntity.prototype, "number", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'address cep.' }),
    __metadata("design:type", String)
], AddressEntity.prototype, "cep", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'address street.' }),
    __metadata("design:type", String)
], AddressEntity.prototype, "street", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'address complement.' }),
    __metadata("design:type", String)
], AddressEntity.prototype, "complement", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'address neighbor.' }),
    __metadata("design:type", String)
], AddressEntity.prototype, "neighborhood", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'address city.' }),
    __metadata("design:type", String)
], AddressEntity.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'address state.', enum: client_1.StatusEnum }),
    __metadata("design:type", String)
], AddressEntity.prototype, "state", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'company id.' }),
    __metadata("design:type", String)
], AddressEntity.prototype, "companyId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'address workspace id.' }),
    __metadata("design:type", String)
], AddressEntity.prototype, "workspaceId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The workspace related to the address' }),
    __metadata("design:type", workspace_entity_1.WorkspaceEntity)
], AddressEntity.prototype, "workspace", void 0);
exports.AddressEntity = AddressEntity;
//# sourceMappingURL=address.entity.js.map