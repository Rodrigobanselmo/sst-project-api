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
exports.RiskFactorGroupDataEntity = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class RiskFactorGroupDataEntity {
    constructor(partial) {
        Object.assign(this, partial);
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, name: { required: true, type: () => String }, companyId: { required: true, type: () => String }, status: { required: true, type: () => Object }, created_at: { required: true, type: () => Date }, data: { required: false, type: () => [Object] }, company: { required: false, type: () => Object }, workspaceId: { required: true, type: () => String }, source: { required: true, type: () => String, nullable: true }, elaboratedBy: { required: true, type: () => String, nullable: true }, approvedBy: { required: true, type: () => String, nullable: true }, revisionBy: { required: true, type: () => String, nullable: true }, documentDate: { required: true, type: () => Date, nullable: true }, visitDate: { required: true, type: () => Date, nullable: true } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The id of the risk group data' }),
    __metadata("design:type", String)
], RiskFactorGroupDataEntity.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The name of the risk group data' }),
    __metadata("design:type", String)
], RiskFactorGroupDataEntity.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The company id related to the risk group data' }),
    __metadata("design:type", String)
], RiskFactorGroupDataEntity.prototype, "companyId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The current status of the risk group data',
        examples: ['ACTIVE', 'CANCELED'],
    }),
    __metadata("design:type", String)
], RiskFactorGroupDataEntity.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The creation date of the risk group data' }),
    __metadata("design:type", Date)
], RiskFactorGroupDataEntity.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The array with risks data',
    }),
    __metadata("design:type", Array)
], RiskFactorGroupDataEntity.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The array with risks data',
    }),
    __metadata("design:type", Object)
], RiskFactorGroupDataEntity.prototype, "company", void 0);
exports.RiskFactorGroupDataEntity = RiskFactorGroupDataEntity;
//# sourceMappingURL=riskGroupData.entity.js.map