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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentPCMSOEntity = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const DayJSProvider_1 = require("../../../shared/providers/DateProvider/implementations/DayJSProvider");
const professional_entity_1 = require("../../users/entities/professional.entity");
const riskData_entity_1 = require("./riskData.entity");
const usersRiskGroup_1 = require("./usersRiskGroup");
class DocumentPCMSOEntity {
    constructor(partial) {
        Object.assign(this, partial);
        if (partial === null || partial === void 0 ? void 0 : partial.data) {
            this.data = partial.data.map((d) => new riskData_entity_1.RiskFactorDataEntity(d));
        }
        if (!(this === null || this === void 0 ? void 0 : this.professionals))
            this.professionals = [];
        if (partial === null || partial === void 0 ? void 0 : partial.professionalsSignatures) {
            this.professionalsSignatures = partial.professionalsSignatures.map((professionalSig) => new usersRiskGroup_1.ProfessionalPCMSOEntity(professionalSig));
            this.professionals = this.professionalsSignatures.map((_a) => {
                var { professional } = _a, rest = __rest(_a, ["professional"]);
                return new professional_entity_1.ProfessionalEntity(Object.assign(Object.assign({}, professional), { professionalPcmsoSignature: rest }));
            });
        }
        if (this.validityStart && this.validityEnd) {
            this.validity = (0, DayJSProvider_1.dayjs)(this.validityStart).format('MM/YYYY') + ' a ' + (0, DayJSProvider_1.dayjs)(this.validityEnd).format('MM/YYYY');
        }
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, name: { required: true, type: () => String }, companyId: { required: true, type: () => String }, status: { required: true, type: () => Object }, created_at: { required: true, type: () => Date }, data: { required: false, type: () => [Object] }, workspaceId: { required: false, type: () => String }, elaboratedBy: { required: true, type: () => String, nullable: true }, approvedBy: { required: true, type: () => String, nullable: true }, revisionBy: { required: true, type: () => String, nullable: true }, documentDate: { required: true, type: () => Date, nullable: true }, visitDate: { required: true, type: () => Date, nullable: true }, validity: { required: true, type: () => String }, coordinatorBy: { required: true, type: () => String }, validityEnd: { required: true, type: () => Date }, validityStart: { required: true, type: () => Date }, company: { required: false, type: () => Object }, professionals: { required: false, type: () => [require("../../users/entities/professional.entity").ProfessionalEntity] }, professionalsSignatures: { required: false, type: () => [require("./usersRiskGroup").ProfessionalPCMSOEntity] } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The id of the risk group data' }),
    __metadata("design:type", String)
], DocumentPCMSOEntity.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The name of the risk group data' }),
    __metadata("design:type", String)
], DocumentPCMSOEntity.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The company id related to the risk group data' }),
    __metadata("design:type", String)
], DocumentPCMSOEntity.prototype, "companyId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The current status of the risk group data',
        examples: ['ACTIVE', 'CANCELED'],
    }),
    __metadata("design:type", String)
], DocumentPCMSOEntity.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The creation date of the risk group data' }),
    __metadata("design:type", Date)
], DocumentPCMSOEntity.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The array with risks data',
    }),
    __metadata("design:type", Array)
], DocumentPCMSOEntity.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The array with risks data',
    }),
    __metadata("design:type", String)
], DocumentPCMSOEntity.prototype, "workspaceId", void 0);
exports.DocumentPCMSOEntity = DocumentPCMSOEntity;
//# sourceMappingURL=documentPCMSO.entity.js.map