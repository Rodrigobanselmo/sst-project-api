"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiskDataRecEntity = void 0;
const openapi = require("@nestjs/swagger");
class RiskDataRecEntity {
    constructor(partial) {
        Object.assign(this, partial);
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, responsibleName: { required: true, type: () => String }, endDate: { required: true, type: () => Date }, comment: { required: true, type: () => String }, status: { required: true, type: () => Object }, recMedId: { required: true, type: () => String }, companyId: { required: true, type: () => String }, riskFactorDataId: { required: true, type: () => String }, comments: { required: false, type: () => [require("./riskDataRecComments.entity").RiskDataRecCommentsEntity] }, updated_at: { required: true, type: () => Date }, created_at: { required: true, type: () => Date } };
    }
}
exports.RiskDataRecEntity = RiskDataRecEntity;
//# sourceMappingURL=riskDataRec.entity.js.map