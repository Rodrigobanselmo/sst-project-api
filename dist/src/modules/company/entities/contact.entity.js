"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactEntity = void 0;
const openapi = require("@nestjs/swagger");
class ContactEntity {
    constructor(partial) {
        Object.assign(this, partial);
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, name: { required: true, type: () => String }, phone: { required: true, type: () => String }, phone_1: { required: true, type: () => String }, email: { required: true, type: () => String }, obs: { required: true, type: () => String }, companyId: { required: true, type: () => String }, isPrincipal: { required: true, type: () => Boolean }, updated_at: { required: true, type: () => Date }, status: { required: true, type: () => Object }, created_at: { required: true, type: () => Date }, company: { required: false, type: () => require("./company.entity").CompanyEntity } };
    }
}
exports.ContactEntity = ContactEntity;
//# sourceMappingURL=contact.entity.js.map