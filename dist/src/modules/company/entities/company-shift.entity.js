"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyShiftEntity = void 0;
const openapi = require("@nestjs/swagger");
class CompanyShiftEntity {
    constructor(partial) {
        Object.assign(this, partial);
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, name: { required: true, type: () => String }, description: { required: true, type: () => String }, companyId: { required: true, type: () => String }, created_at: { required: true, type: () => Date }, updated_at: { required: true, type: () => Date }, employees: { required: true, type: () => [require("./employee.entity").EmployeeEntity] }, company: { required: true, type: () => require("./company.entity").CompanyEntity } };
    }
}
exports.CompanyShiftEntity = CompanyShiftEntity;
//# sourceMappingURL=company-shift.entity.js.map