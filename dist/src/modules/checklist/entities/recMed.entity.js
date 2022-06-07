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
exports.RecMedEntity = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class RecMedEntity {
    constructor(partial) {
        Object.assign(this, partial);
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, riskId: { required: true, type: () => String }, recName: { required: true, type: () => String }, medName: { required: true, type: () => String }, companyId: { required: true, type: () => String }, system: { required: true, type: () => Boolean }, medType: { required: true, type: () => Object }, status: { required: true, type: () => Object }, created_at: { required: true, type: () => Date }, generateSourceId: { required: true, type: () => String } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The id of the recommendation or control measure',
    }),
    __metadata("design:type", String)
], RecMedEntity.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The id of the parent risk',
    }),
    __metadata("design:type", String)
], RecMedEntity.prototype, "riskId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'the recommendation description' }),
    __metadata("design:type", String)
], RecMedEntity.prototype, "recName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'the control measure description' }),
    __metadata("design:type", String)
], RecMedEntity.prototype, "medName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The company id related to the recommendation or control measure',
    }),
    __metadata("design:type", String)
], RecMedEntity.prototype, "companyId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'If was created from one of simple professionals',
    }),
    __metadata("design:type", Boolean)
], RecMedEntity.prototype, "system", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The current control measure type',
        examples: ['ADM', 'ENG'],
    }),
    __metadata("design:type", String)
], RecMedEntity.prototype, "medType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The current status of the recommendation or control measure',
        examples: ['ACTIVE', 'PENDING', 'CANCELED'],
    }),
    __metadata("design:type", String)
], RecMedEntity.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The creation date of the risk' }),
    __metadata("design:type", Date)
], RecMedEntity.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The generate source id related' }),
    __metadata("design:type", String)
], RecMedEntity.prototype, "generateSourceId", void 0);
exports.RecMedEntity = RecMedEntity;
//# sourceMappingURL=recMed.entity.js.map