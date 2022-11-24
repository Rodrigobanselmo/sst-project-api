"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtocolEntity = exports.ProtocolToRiskEntity = void 0;
const openapi = require("@nestjs/swagger");
class ProtocolToRiskEntity {
    constructor(partial) {
        Object.assign(this, partial);
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, riskId: { required: true, type: () => String }, protocolId: { required: true, type: () => Number }, updated_at: { required: true, type: () => Date }, minRiskDegree: { required: true, type: () => Number }, minRiskDegreeQuantity: { required: true, type: () => Number }, companyId: { required: true, type: () => String }, protocol: { required: false, type: () => require("./protocol.entity").ProtocolEntity }, risk: { required: false, type: () => require("./risk.entity").RiskFactorsEntity } };
    }
}
exports.ProtocolToRiskEntity = ProtocolToRiskEntity;
class ProtocolEntity {
    constructor(partial) {
        Object.assign(this, partial);
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, name: { required: true, type: () => String }, created_at: { required: true, type: () => Date }, deleted_at: { required: true, type: () => Date }, updated_at: { required: true, type: () => Date }, companyId: { required: true, type: () => String }, protocolToRisk: { required: true, type: () => [require("./protocol.entity").ProtocolToRiskEntity] }, system: { required: true, type: () => Boolean }, status: { required: true, type: () => Object } };
    }
}
exports.ProtocolEntity = ProtocolEntity;
//# sourceMappingURL=protocol.entity.js.map