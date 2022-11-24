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
exports.ExamEntity = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
class ExamEntity {
    constructor(partial) {
        Object.assign(this, partial);
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, name: { required: true, type: () => String }, instruction: { required: true, type: () => String }, material: { required: true, type: () => String }, companyId: { required: true, type: () => String }, obsProc: { required: true, type: () => String }, status: { required: true, type: () => Object }, type: { required: true, type: () => Object }, updated_at: { required: true, type: () => Date }, created_at: { required: true, type: () => Date }, system: { required: true, type: () => Boolean }, analyses: { required: true, type: () => String }, deleted_at: { required: true, type: () => Date }, examToClinic: { required: true, type: () => [require("./examToClinic").ExamToClinicEntity] }, isAttendance: { required: true, type: () => Boolean }, esocial27Code: { required: true, type: () => String }, examsRiskData: { required: false, type: () => require("./examRiskData.entity").ExamRiskDataEntity }, examToRiskData: { required: false, type: () => [require("./examRiskData.entity").ExamRiskDataEntity] }, examToRisk: { required: false, type: () => [require("./examRisk.entity").ExamRiskEntity] } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The id of the Company' }),
    __metadata("design:type", Number)
], ExamEntity.prototype, "id", void 0);
exports.ExamEntity = ExamEntity;
//# sourceMappingURL=exam.entity.js.map