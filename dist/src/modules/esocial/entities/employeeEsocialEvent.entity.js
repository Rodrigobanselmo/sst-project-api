"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeESocialEventEntity = void 0;
const openapi = require("@nestjs/swagger");
class EmployeeESocialEventEntity {
    constructor(partial) {
        Object.assign(this, partial);
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, created_at: { required: true, type: () => Date }, updated_at: { required: true, type: () => Date }, batchId: { required: true, type: () => Number }, environment: { required: true, type: () => Number }, eventsDate: { required: true, type: () => Date }, status: { required: true, type: () => Object }, eventXml: { required: true, type: () => String }, employeeId: { required: true, type: () => Number }, companyId: { required: true, type: () => String }, type: { required: true, type: () => Object }, receipt: { required: true, type: () => String }, eventId: { required: true, type: () => String }, employee: { required: false, type: () => require("../../company/entities/employee.entity").EmployeeEntity }, company: { required: false, type: () => require("../../company/entities/company.entity").CompanyEntity }, batch: { required: false, type: () => require("./employeeEsocialBatch.entity").EmployeeESocialBatchEntity }, response: { required: true, type: () => Object }, action: { required: true, type: () => Object }, examHistoryId: { required: true, type: () => Number }, ppp: { required: true, type: () => require("../../company/entities/employee-ppp-history.entity").EmployeePPPHistoryEntity }, pppId: { required: true, type: () => Number } };
    }
}
exports.EmployeeESocialEventEntity = EmployeeESocialEventEntity;
//# sourceMappingURL=employeeEsocialEvent.entity.js.map