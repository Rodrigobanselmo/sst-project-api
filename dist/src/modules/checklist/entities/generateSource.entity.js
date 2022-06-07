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
exports.GenerateSourceEntity = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class GenerateSourceEntity {
    constructor(partial) {
        Object.assign(this, partial);
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, riskId: { required: true, type: () => String }, name: { required: true, type: () => String }, companyId: { required: true, type: () => String }, system: { required: true, type: () => Boolean }, status: { required: true, type: () => Object }, created_at: { required: true, type: () => Date } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The id of the generate source or control measure',
    }),
    __metadata("design:type", String)
], GenerateSourceEntity.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The id of the parent risk',
    }),
    __metadata("design:type", String)
], GenerateSourceEntity.prototype, "riskId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'the generate source description' }),
    __metadata("design:type", String)
], GenerateSourceEntity.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The company id related to the generate source or control measure',
    }),
    __metadata("design:type", String)
], GenerateSourceEntity.prototype, "companyId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'If was created from one of simple professionals',
    }),
    __metadata("design:type", Boolean)
], GenerateSourceEntity.prototype, "system", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The current status of the generate source or control measure',
        examples: ['ACTIVE', 'CANCELED'],
    }),
    __metadata("design:type", String)
], GenerateSourceEntity.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The creation date of the risk' }),
    __metadata("design:type", Date)
], GenerateSourceEntity.prototype, "created_at", void 0);
exports.GenerateSourceEntity = GenerateSourceEntity;
//# sourceMappingURL=generateSource.entity.js.map