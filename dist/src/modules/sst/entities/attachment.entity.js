"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttachmentEntity = void 0;
const openapi = require("@nestjs/swagger");
class AttachmentEntity {
    constructor(partial) {
        Object.assign(this, partial);
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, name: { required: true, type: () => String }, url: { required: true, type: () => String }, created_at: { required: true, type: () => Date }, deleted_at: { required: true, type: () => Date }, updated_at: { required: true, type: () => Date }, riskFactorDocumentId: { required: true, type: () => String }, riskDocument: { required: true, type: () => require("./riskDocument.entity").RiskDocumentEntity } };
    }
}
exports.AttachmentEntity = AttachmentEntity;
//# sourceMappingURL=attachment.entity.js.map