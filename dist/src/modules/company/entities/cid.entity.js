"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CidEntity = void 0;
const openapi = require("@nestjs/swagger");
class CidEntity {
    constructor(partial) {
        Object.assign(this, partial);
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { cid: { required: true, type: () => String }, description: { required: true, type: () => String }, employees: { required: true, type: () => [require("./employee.entity").EmployeeEntity] } };
    }
}
exports.CidEntity = CidEntity;
//# sourceMappingURL=cid.entity.js.map