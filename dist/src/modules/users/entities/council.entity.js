"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfessionalCouncilEntity = void 0;
const openapi = require("@nestjs/swagger");
class ProfessionalCouncilEntity {
    constructor(partial) {
        Object.assign(this, partial);
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, councilType: { required: true, type: () => String }, councilUF: { required: true, type: () => String }, councilId: { required: true, type: () => String }, created_at: { required: true, type: () => Date }, updated_at: { required: true, type: () => Date }, professionalId: { required: true, type: () => Number }, professional: { required: true, type: () => require("./professional.entity").ProfessionalEntity } };
    }
}
exports.ProfessionalCouncilEntity = ProfessionalCouncilEntity;
//# sourceMappingURL=council.entity.js.map