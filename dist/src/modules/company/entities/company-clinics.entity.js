"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyClinicsEntity = void 0;
const openapi = require("@nestjs/swagger");
class CompanyClinicsEntity {
    constructor(partial) {
        Object.assign(this, partial);
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { companyId: { required: true, type: () => String }, clinicId: { required: true, type: () => String }, created_at: { required: true, type: () => Date }, company: { required: false, type: () => require("./company.entity").CompanyEntity }, clinic: { required: false, type: () => require("./company.entity").CompanyEntity } };
    }
}
exports.CompanyClinicsEntity = CompanyClinicsEntity;
//# sourceMappingURL=company-clinics.entity.js.map