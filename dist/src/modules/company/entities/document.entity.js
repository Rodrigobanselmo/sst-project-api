"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentEntity = void 0;
const openapi = require("@nestjs/swagger");
class DocumentEntity {
    constructor(partial) {
        Object.assign(this, partial);
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, fileUrl: { required: true, type: () => String }, name: { required: true, type: () => String }, description: { required: true, type: () => String }, startDate: { required: true, type: () => Date }, endDate: { required: true, type: () => Date }, type: { required: true, type: () => Object }, status: { required: true, type: () => Object }, created_at: { required: true, type: () => Date }, updated_at: { required: true, type: () => Date }, companyId: { required: true, type: () => String }, workspaceId: { required: true, type: () => String }, workspace: { required: true, type: () => require("./workspace.entity").WorkspaceEntity }, company: { required: true, type: () => require("./company.entity").CompanyEntity }, oldDocuments: { required: true, type: () => [require("./document.entity").DocumentEntity] }, parentDocumentId: { required: true, type: () => Number }, parentDocument: { required: true, type: () => require("./document.entity").DocumentEntity } };
    }
}
exports.DocumentEntity = DocumentEntity;
//# sourceMappingURL=document.entity.js.map