"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExamRiskEntity = void 0;
const openapi = require("@nestjs/swagger");
class ExamRiskEntity {
    constructor(partial) {
        Object.assign(this, partial);
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, examId: { required: true, type: () => Number }, riskId: { required: true, type: () => String }, companyId: { required: true, type: () => String }, isMale: { required: true, type: () => Boolean }, isFemale: { required: true, type: () => Boolean }, isPeriodic: { required: true, type: () => Boolean }, isChange: { required: true, type: () => Boolean }, isAdmission: { required: true, type: () => Boolean }, isReturn: { required: true, type: () => Boolean }, isDismissal: { required: true, type: () => Boolean }, validityInMonths: { required: true, type: () => Number }, lowValidityInMonths: { required: true, type: () => Number }, considerBetweenDays: { required: true, type: () => Number }, fromAge: { required: true, type: () => Number }, toAge: { required: true, type: () => Number }, risk: { required: false, type: () => require("./risk.entity").RiskFactorsEntity }, exam: { required: false, type: () => require("./exam.entity").ExamEntity }, startDate: { required: true, type: () => Date }, endDate: { required: true, type: () => Date }, minRiskDegreeQuantity: { required: true, type: () => Number }, minRiskDegree: { required: true, type: () => Number }, isOld: { required: true, type: () => Boolean } };
    }
}
exports.ExamRiskEntity = ExamRiskEntity;
//# sourceMappingURL=examRisk.entity.js.map