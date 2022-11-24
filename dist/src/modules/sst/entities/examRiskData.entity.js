"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExamRiskDataEntity = void 0;
const openapi = require("@nestjs/swagger");
const riskData_entity_1 = require("./riskData.entity");
class ExamRiskDataEntity {
    constructor(partial) {
        Object.assign(this, partial);
        if (this === null || this === void 0 ? void 0 : this.riskData)
            this.riskData = new riskData_entity_1.RiskFactorDataEntity(this.riskData);
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { examId: { required: true, type: () => Number }, riskFactorDataId: { required: true, type: () => String }, isMale: { required: true, type: () => Boolean }, isFemale: { required: true, type: () => Boolean }, isPeriodic: { required: true, type: () => Boolean }, isChange: { required: true, type: () => Boolean }, isAdmission: { required: true, type: () => Boolean }, isReturn: { required: true, type: () => Boolean }, isDismissal: { required: true, type: () => Boolean }, validityInMonths: { required: true, type: () => Number }, lowValidityInMonths: { required: true, type: () => Number }, considerBetweenDays: { required: true, type: () => Number }, fromAge: { required: true, type: () => Number }, toAge: { required: true, type: () => Number }, riskData: { required: false, type: () => require("./riskData.entity").RiskFactorDataEntity }, exam: { required: false, type: () => require("./exam.entity").ExamEntity }, isStandard: { required: false, type: () => Boolean } };
    }
}
exports.ExamRiskDataEntity = ExamRiskDataEntity;
//# sourceMappingURL=examRiskData.entity.js.map