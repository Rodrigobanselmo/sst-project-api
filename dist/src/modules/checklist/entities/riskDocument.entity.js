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
exports.RiskDocumentEntity = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const company_entity_1 = require("../../company/entities/company.entity");
class RiskDocumentEntity {
    constructor(partial) {
        Object.assign(this, partial);
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, name: { required: true, type: () => String }, companyId: { required: true, type: () => String }, status: { required: true, type: () => Object }, created_at: { required: true, type: () => Date }, company: { required: false, type: () => Object }, fileUrl: { required: true, type: () => String }, description: { required: true, type: () => String }, version: { required: true, type: () => String }, riskGroupId: { required: true, type: () => String }, updated_at: { required: true, type: () => Date } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The id of the risk group data' }),
    __metadata("design:type", String)
], RiskDocumentEntity.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The name of the risk group data' }),
    __metadata("design:type", String)
], RiskDocumentEntity.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The company id related to the risk group data' }),
    __metadata("design:type", String)
], RiskDocumentEntity.prototype, "companyId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The current status of the risk group data',
        examples: ['ACTIVE', 'CANCELED'],
    }),
    __metadata("design:type", String)
], RiskDocumentEntity.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The creation date of the risk group data' }),
    __metadata("design:type", Date)
], RiskDocumentEntity.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The array with risks data',
    }),
    __metadata("design:type", Object)
], RiskDocumentEntity.prototype, "company", void 0);
exports.RiskDocumentEntity = RiskDocumentEntity;
//# sourceMappingURL=riskDocument.entity.js.map