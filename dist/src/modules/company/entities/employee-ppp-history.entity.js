"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeePPPHistoryEntity = void 0;
const openapi = require("@nestjs/swagger");
class EmployeePPPHistoryEntity {
    constructor(partial) {
        Object.assign(this, partial);
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, created_at: { required: true, type: () => Date }, updated_at: { required: true, type: () => Date }, doneDate: { required: true, type: () => Date }, status: { required: true, type: () => Object }, sendEvent: { required: true, type: () => Boolean }, employeeId: { required: true, type: () => Number }, employee: { required: true, type: () => require("./employee.entity").EmployeeEntity }, events: { required: true, type: () => [Object] }, json: { required: true, type: () => Object } };
    }
}
exports.EmployeePPPHistoryEntity = EmployeePPPHistoryEntity;
//# sourceMappingURL=employee-ppp-history.entity.js.map