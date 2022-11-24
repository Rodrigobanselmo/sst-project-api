"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentCoverEntity = void 0;
const openapi = require("@nestjs/swagger");
class DocumentCoverEntity {
    constructor(partial) {
        Object.assign(this, partial);
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, name: { required: true, type: () => String }, json: { required: true, type: () => Object }, description: { required: true, type: () => String }, companyId: { required: true, type: () => String }, acceptType: { required: true, type: () => [Object] } };
    }
}
exports.DocumentCoverEntity = DocumentCoverEntity;
//# sourceMappingURL=document-cover.entity.js.map