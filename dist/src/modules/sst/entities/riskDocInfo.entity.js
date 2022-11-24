"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiskDocInfoEntity = void 0;
const openapi = require("@nestjs/swagger");
class RiskDocInfoEntity {
    constructor(partial) {
        Object.assign(this, partial);
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, riskId: { required: true, type: () => String }, companyId: { required: true, type: () => String }, hierarchyId: { required: true, type: () => String }, isAso: { required: true, type: () => Boolean }, isPGR: { required: true, type: () => Boolean }, isPCMSO: { required: true, type: () => Boolean }, isPPP: { required: true, type: () => Boolean }, created_at: { required: true, type: () => Date } };
    }
}
exports.RiskDocInfoEntity = RiskDocInfoEntity;
//# sourceMappingURL=riskDocInfo.entity.js.map