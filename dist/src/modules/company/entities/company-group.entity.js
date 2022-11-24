"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyGroupEntity = void 0;
const openapi = require("@nestjs/swagger");
const professional_entity_1 = require("./../../users/entities/professional.entity");
const swagger_1 = require("@nestjs/swagger");
const company_entity_1 = require("./company.entity");
class CompanyGroupEntity {
    constructor(partial) {
        var _a, _b;
        Object.assign(this, partial);
        if (this.companyGroup) {
            this.companyGroup = new company_entity_1.CompanyEntity(this.companyGroup);
            this.ambResponsible = (_a = this.companyGroup) === null || _a === void 0 ? void 0 : _a.ambResponsible;
        }
        if (this.company) {
            this.cert = (_b = this.company) === null || _b === void 0 ? void 0 : _b.cert;
        }
        if (this.doctorResponsible) {
            this.doctorResponsible = new professional_entity_1.ProfessionalEntity(this.doctorResponsible);
        }
        if (this.tecResponsible) {
            this.tecResponsible = new professional_entity_1.ProfessionalEntity(this.tecResponsible);
        }
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, name: { required: true, type: () => String }, description: { required: true, type: () => String }, esocialSend: { required: true, type: () => Boolean }, created_at: { required: true, type: () => Date }, updated_at: { required: true, type: () => Date }, companyId: { required: true, type: () => String }, numAsos: { required: true, type: () => Number }, blockResignationExam: { required: true, type: () => Boolean }, esocialStart: { required: true, type: () => Date }, doctorResponsibleId: { required: true, type: () => Number }, tecResponsibleId: { required: true, type: () => Number }, doctorResponsible: { required: false, type: () => Object }, tecResponsible: { required: false, type: () => Object }, ambResponsible: { required: false, type: () => Object }, company: { required: false, type: () => Object }, cert: { required: false, type: () => require("../../esocial/entities/companyCert.entity").CompanyCertEntity }, companyGroup: { required: false, type: () => Object } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The id of the CompanyGroups' }),
    __metadata("design:type", Number)
], CompanyGroupEntity.prototype, "id", void 0);
exports.CompanyGroupEntity = CompanyGroupEntity;
//# sourceMappingURL=company-group.entity.js.map