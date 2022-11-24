"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EngsRiskDataEntity = void 0;
const openapi = require("@nestjs/swagger");
class EngsRiskDataEntity {
    constructor(partial) {
        Object.assign(this, partial);
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { recMedId: { required: true, type: () => String }, riskFactorDataId: { required: true, type: () => String }, efficientlyCheck: { required: true, type: () => Boolean }, recMed: { required: false, type: () => require("./recMed.entity").RecMedEntity }, riskData: { required: false, type: () => require("./riskData.entity").RiskFactorDataEntity }, startDate: { required: true, type: () => Date }, endDate: { required: true, type: () => Date } };
    }
}
exports.EngsRiskDataEntity = EngsRiskDataEntity;
//# sourceMappingURL=engsRiskData.entity.js.map