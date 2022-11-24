"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiskDataRecCommentsEntity = void 0;
const openapi = require("@nestjs/swagger");
class RiskDataRecCommentsEntity {
    constructor(partial) {
        Object.assign(this, partial);
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, text: { required: true, type: () => String }, type: { required: true, type: () => Object }, textType: { required: true, type: () => Object }, riskFactorDataRecId: { required: true, type: () => String }, updated_at: { required: true, type: () => Date }, created_at: { required: true, type: () => Date } };
    }
}
exports.RiskDataRecCommentsEntity = RiskDataRecCommentsEntity;
//# sourceMappingURL=riskDataRecComments.entity.js.map