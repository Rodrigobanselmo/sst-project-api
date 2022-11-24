"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeESocialBatchEntity = void 0;
const openapi = require("@nestjs/swagger");
class EmployeeESocialBatchEntity {
    constructor(partial) {
        Object.assign(this, partial);
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, created_at: { required: true, type: () => Date }, updated_at: { required: true, type: () => Date }, environment: { required: true, type: () => Number }, status: { required: true, type: () => Object }, userTransmissionId: { required: true, type: () => Number }, companyId: { required: true, type: () => String }, protocolId: { required: true, type: () => String }, type: { required: true, type: () => Object }, company: { required: false, type: () => require("../../company/entities/company.entity").CompanyEntity }, userTransmission: { required: false, type: () => require("../../users/entities/user.entity").UserEntity }, events: { required: false, type: () => [require("./employeeEsocialEvent.entity").EmployeeESocialEventEntity] }, response: { required: true, type: () => Object } };
    }
}
exports.EmployeeESocialBatchEntity = EmployeeESocialBatchEntity;
//# sourceMappingURL=employeeEsocialBatch.entity.js.map