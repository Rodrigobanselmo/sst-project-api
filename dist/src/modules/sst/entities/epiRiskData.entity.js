"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EpiRiskDataEntity = void 0;
const openapi = require("@nestjs/swagger");
class EpiRiskDataEntity {
    constructor(partial) {
        Object.assign(this, partial);
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { epiId: { required: true, type: () => Number }, riskFactorDataId: { required: true, type: () => String }, lifeTimeInDays: { required: true, type: () => Number }, efficientlyCheck: { required: true, type: () => Boolean }, epcCheck: { required: true, type: () => Boolean }, longPeriodsCheck: { required: true, type: () => Boolean }, validationCheck: { required: true, type: () => Boolean }, tradeSignCheck: { required: true, type: () => Boolean }, sanitationCheck: { required: true, type: () => Boolean }, maintenanceCheck: { required: true, type: () => Boolean }, unstoppedCheck: { required: true, type: () => Boolean }, trainingCheck: { required: true, type: () => Boolean }, epi: { required: false, type: () => require("./epi.entity").EpiEntity }, riskData: { required: false, type: () => require("./riskData.entity").RiskFactorDataEntity }, startDate: { required: true, type: () => Date }, endDate: { required: true, type: () => Date } };
    }
}
exports.EpiRiskDataEntity = EpiRiskDataEntity;
//# sourceMappingURL=epiRiskData.entity.js.map