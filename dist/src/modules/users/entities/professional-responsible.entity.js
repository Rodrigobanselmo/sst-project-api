"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfessionalResponsibleEntity = void 0;
const openapi = require("@nestjs/swagger");
const professional_entity_1 = require("./professional.entity");
class ProfessionalResponsibleEntity {
    constructor(partial) {
        Object.assign(this, partial);
        if (this.professional) {
            this.professional = new professional_entity_1.ProfessionalEntity(this.professional);
        }
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, created_at: { required: true, type: () => Date }, updated_at: { required: true, type: () => Date }, startDate: { required: true, type: () => Date }, professionalCouncilId: { required: true, type: () => Number }, companyId: { required: true, type: () => String }, professional: { required: false, type: () => Object }, company: { required: false, type: () => require("../../company/entities/company.entity").CompanyEntity }, type: { required: true, type: () => Object } };
    }
}
exports.ProfessionalResponsibleEntity = ProfessionalResponsibleEntity;
//# sourceMappingURL=professional-responsible.entity.js.map