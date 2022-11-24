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
exports.RiskFactorsEntity = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require(".prisma/client");
const client_2 = require("@prisma/client");
const riskData_entity_1 = require("./riskData.entity");
class RiskFactorsEntity {
    constructor(partial) {
        Object.assign(this, partial);
        this.vmp = String(this.getVMP((this === null || this === void 0 ? void 0 : this.nr15lt) || ''));
        if (this.riskFactorData) {
            this.riskFactorData = this.riskFactorData.map((riskData) => new riskData_entity_1.RiskFactorDataEntity(riskData));
        }
    }
    getVMP(nr15lt) {
        if (!nr15lt)
            return '';
        if (nr15lt == '-')
            return '';
        const LT = Number(nr15lt.replace(/[^0-9.]/g, ''));
        if (LT <= 1)
            return 3 * LT;
        if (LT <= 10)
            return 2 * LT;
        if (LT <= 100)
            return 1.5 * LT;
        if (LT <= 1000)
            return 1.25 * LT;
        return 1.1 * LT;
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, name: { required: true, type: () => String }, severity: { required: true, type: () => Number }, type: { required: true, type: () => Object }, companyId: { required: true, type: () => String }, system: { required: true, type: () => Boolean }, representAll: { required: true, type: () => Boolean }, status: { required: true, type: () => Object }, created_at: { required: true, type: () => Date }, appendix: { required: true, type: () => String }, propagation: { required: true, type: () => [String] }, recMed: { required: false, type: () => [require("./recMed.entity").RecMedEntity] }, generateSource: { required: false, type: () => [require("./generateSource.entity").GenerateSourceEntity] }, deleted_at: { required: true, type: () => Date, nullable: true }, risk: { required: true, type: () => String }, symptoms: { required: true, type: () => String }, isEmergency: { required: true, type: () => Boolean }, json: { required: true, type: () => Object }, exame: { required: true, type: () => String }, method: { required: true, type: () => String }, unit: { required: true, type: () => String }, cas: { required: true, type: () => String }, breather: { required: true, type: () => String }, nr15lt: { required: true, type: () => String }, twa: { required: true, type: () => String }, stel: { required: true, type: () => String }, vmp: { required: true, type: () => String }, ipvs: { required: true, type: () => String }, pv: { required: true, type: () => String }, pe: { required: true, type: () => String }, fraction: { required: true, type: () => String }, tlv: { required: true, type: () => String }, coments: { required: true, type: () => String }, carnogenicityACGIH: { required: true, type: () => String }, carnogenicityLinach: { required: true, type: () => String }, examToRisk: { required: true, type: () => [require("./examRisk.entity").ExamRiskEntity] }, riskFactorData: { required: true, type: () => [require("./riskData.entity").RiskFactorDataEntity] }, docInfo: { required: false, type: () => [require("./riskDocInfo.entity").RiskDocInfoEntity] }, protocolToRisk: { required: false, type: () => [require("./protocol.entity").ProtocolToRiskEntity] }, isAso: { required: true, type: () => Boolean }, isPGR: { required: true, type: () => Boolean }, isPCMSO: { required: true, type: () => Boolean }, isPPP: { required: true, type: () => Boolean }, esocialCode: { required: true, type: () => String }, esocial: { required: false, type: () => require("../../esocial/entities/esocialTable24.entity").EsocialTable24Entity } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The id of the Company' }),
    __metadata("design:type", String)
], RiskFactorsEntity.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The name of the risk' }),
    __metadata("design:type", String)
], RiskFactorsEntity.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The severity of the rik' }),
    __metadata("design:type", Number)
], RiskFactorsEntity.prototype, "severity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The current type of the risk',
        examples: ['BIO', 'QUI', 'FIS'],
    }),
    __metadata("design:type", String)
], RiskFactorsEntity.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The company id related to the risk' }),
    __metadata("design:type", String)
], RiskFactorsEntity.prototype, "companyId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'If risk was created from one of simple professionals',
    }),
    __metadata("design:type", Boolean)
], RiskFactorsEntity.prototype, "system", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'If represent all risks',
    }),
    __metadata("design:type", Boolean)
], RiskFactorsEntity.prototype, "representAll", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The current status of the risk',
        examples: ['ACTIVE', 'PENDING', 'CANCELED'],
    }),
    __metadata("design:type", String)
], RiskFactorsEntity.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The creation date of the risk' }),
    __metadata("design:type", Date)
], RiskFactorsEntity.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The appendix date of the risk' }),
    __metadata("design:type", String)
], RiskFactorsEntity.prototype, "appendix", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The propagation array of the risk' }),
    __metadata("design:type", Array)
], RiskFactorsEntity.prototype, "propagation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The array with recommendations and measure controls data',
    }),
    __metadata("design:type", Array)
], RiskFactorsEntity.prototype, "recMed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The array with generate source data' }),
    __metadata("design:type", Array)
], RiskFactorsEntity.prototype, "generateSource", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The deleted date of data' }),
    __metadata("design:type", Date)
], RiskFactorsEntity.prototype, "deleted_at", void 0);
exports.RiskFactorsEntity = RiskFactorsEntity;
//# sourceMappingURL=risk.entity.js.map