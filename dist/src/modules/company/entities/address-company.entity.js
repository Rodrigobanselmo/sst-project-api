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
exports.AddressCompanyEntity = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class AddressCompanyEntity {
    constructor(partial) {
        Object.assign(this, partial);
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, number: { required: true, type: () => String }, cep: { required: true, type: () => String }, street: { required: true, type: () => String }, complement: { required: true, type: () => String }, neighborhood: { required: true, type: () => String }, city: { required: true, type: () => String }, state: { required: true, type: () => String }, companyId: { required: true, type: () => String }, uf: { required: true, type: () => Object } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'address id.' }),
    __metadata("design:type", String)
], AddressCompanyEntity.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'address number.' }),
    __metadata("design:type", String)
], AddressCompanyEntity.prototype, "number", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'address cep.' }),
    __metadata("design:type", String)
], AddressCompanyEntity.prototype, "cep", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'address street.' }),
    __metadata("design:type", String)
], AddressCompanyEntity.prototype, "street", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'address complement.' }),
    __metadata("design:type", String)
], AddressCompanyEntity.prototype, "complement", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'address neighbor.' }),
    __metadata("design:type", String)
], AddressCompanyEntity.prototype, "neighborhood", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'address city.' }),
    __metadata("design:type", String)
], AddressCompanyEntity.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'address state.', enum: client_1.UfStateEnum }),
    __metadata("design:type", String)
], AddressCompanyEntity.prototype, "state", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'company id.' }),
    __metadata("design:type", String)
], AddressCompanyEntity.prototype, "companyId", void 0);
exports.AddressCompanyEntity = AddressCompanyEntity;
//# sourceMappingURL=address-company.entity.js.map