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
exports.EpiEntity = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class EpiEntity {
    constructor(partial) {
        Object.assign(this, partial);
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, ca: { required: true, type: () => String }, equipment: { required: true, type: () => String }, description: { required: true, type: () => String }, isValid: { required: true, type: () => Boolean }, status: { required: true, type: () => Object }, expiredDate: { required: true, type: () => Date }, created_at: { required: true, type: () => Date }, national: { required: true, type: () => Boolean }, report: { required: true, type: () => String }, restriction: { required: true, type: () => String }, observation: { required: true, type: () => String }, deleted_at: { required: true, type: () => Date, nullable: true } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The id of the epi',
    }),
    __metadata("design:type", Number)
], EpiEntity.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'the ca number' }),
    __metadata("design:type", String)
], EpiEntity.prototype, "ca", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'the equipment description' }),
    __metadata("design:type", String)
], EpiEntity.prototype, "equipment", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'the epi description' }),
    __metadata("design:type", String)
], EpiEntity.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'if api is valid' }),
    __metadata("design:type", Boolean)
], EpiEntity.prototype, "isValid", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The current status of the epi',
        examples: ['ACTIVE', 'PENDING', 'CANCELED'],
    }),
    __metadata("design:type", String)
], EpiEntity.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The expired date of the epi' }),
    __metadata("design:type", Date)
], EpiEntity.prototype, "expiredDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The creation date of the epi' }),
    __metadata("design:type", Date)
], EpiEntity.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The creation date of the epi' }),
    __metadata("design:type", Boolean)
], EpiEntity.prototype, "national", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The report of the epi' }),
    __metadata("design:type", String)
], EpiEntity.prototype, "report", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The report restriction of the epi' }),
    __metadata("design:type", String)
], EpiEntity.prototype, "restriction", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The observations about the epi report' }),
    __metadata("design:type", String)
], EpiEntity.prototype, "observation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The deleted date of data' }),
    __metadata("design:type", Date)
], EpiEntity.prototype, "deleted_at", void 0);
exports.EpiEntity = EpiEntity;
//# sourceMappingURL=epi.entity.js.map