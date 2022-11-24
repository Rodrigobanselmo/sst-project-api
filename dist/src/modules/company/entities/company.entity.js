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
exports.CompanyEntity = void 0;
const openapi = require("@nestjs/swagger");
const professional_responsible_entity_1 = require("./../../users/entities/professional-responsible.entity");
const risk_entity_1 = require("./../../sst/entities/risk.entity");
const professional_entity_1 = require("./../../users/entities/professional.entity");
const client_1 = require(".prisma/client");
const swagger_1 = require("@nestjs/swagger");
const client_2 = require("@prisma/client");
const address_company_entity_1 = require("./address-company.entity");
const license_entity_1 = require("./license.entity");
const stepCompany_enum_1 = require("../../../shared/constants/enum/stepCompany.enum");
class CompanyEntity {
    constructor(partial) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        Object.assign(this, partial);
        if (this.professionalsResponsibles) {
            this.professionalsResponsibles = this.professionalsResponsibles.map((p) => new professional_responsible_entity_1.ProfessionalResponsibleEntity(p));
            const professional = (_a = this.professionalsResponsibles.find((p) => p.type === 'AMB')) === null || _a === void 0 ? void 0 : _a.professional;
            this.ambResponsible = professional;
        }
        if (this.primary_activity && this.primary_activity[0]) {
            this.riskDegree = this.primary_activity[0].riskDegree;
        }
        if (this.riskFactors) {
            this.riskFactors = this.riskFactors.map((risk) => new risk_entity_1.RiskFactorsEntity(risk));
        }
        if (this.group) {
            if (!this.doctorResponsible)
                this.doctorResponsible = (_b = this.group) === null || _b === void 0 ? void 0 : _b.doctorResponsible;
            if (!this.doctorResponsibleId)
                this.doctorResponsibleId = (_c = this.group) === null || _c === void 0 ? void 0 : _c.doctorResponsibleId;
            if (!this.tecResponsible)
                this.tecResponsible = (_d = this.group) === null || _d === void 0 ? void 0 : _d.tecResponsible;
            if (!this.tecResponsibleId)
                this.tecResponsibleId = (_e = this.group) === null || _e === void 0 ? void 0 : _e.tecResponsibleId;
            if (!this.ambResponsible)
                this.ambResponsible = (_f = this.group) === null || _f === void 0 ? void 0 : _f.ambResponsible;
            if (!this.esocialStart)
                this.esocialStart = (_g = this.group) === null || _g === void 0 ? void 0 : _g.esocialStart;
            if (!this.numAsos)
                this.numAsos = (_h = this.group) === null || _h === void 0 ? void 0 : _h.numAsos;
            if (!this.blockResignationExam)
                this.blockResignationExam = (_j = this.group) === null || _j === void 0 ? void 0 : _j.blockResignationExam;
        }
        if (this.doctorResponsible) {
            this.doctorResponsible = new professional_entity_1.ProfessionalEntity(this.doctorResponsible);
        }
        if (this.tecResponsible) {
            this.tecResponsible = new professional_entity_1.ProfessionalEntity(this.tecResponsible);
        }
        if (this.isClinic) {
            this.getClinicStep();
        }
        else {
            this.getCompanyStep();
        }
    }
    getCompanyStep() {
        this.steps = [
            stepCompany_enum_1.CompanyStepEnum.WORKSPACE,
            stepCompany_enum_1.CompanyStepEnum.EMPLOYEE,
            stepCompany_enum_1.CompanyStepEnum.HIERARCHY,
            stepCompany_enum_1.CompanyStepEnum.HOMO_GROUP,
            stepCompany_enum_1.CompanyStepEnum.RISK_GROUP,
            stepCompany_enum_1.CompanyStepEnum.RISKS,
            stepCompany_enum_1.CompanyStepEnum.NONE,
        ];
        const workspaceStep = this.workspace && this.workspace.length == 0;
        const employeeStep = this.employeeCount == 0;
        const hierarchyStep = this.hierarchyCount == 0;
        const homoStep = this.homogenousGroupCount == 0;
        const riskGroupStep = this.riskGroupCount == 0;
        if (workspaceStep) {
            return (this.step = stepCompany_enum_1.CompanyStepEnum.WORKSPACE);
        }
        if (employeeStep && hierarchyStep) {
            return (this.step = stepCompany_enum_1.CompanyStepEnum.EMPLOYEE);
        }
        if (hierarchyStep) {
            return (this.step = stepCompany_enum_1.CompanyStepEnum.HIERARCHY);
        }
        if (homoStep && riskGroupStep) {
            return (this.step = stepCompany_enum_1.CompanyStepEnum.HOMO_GROUP);
        }
        if (riskGroupStep) {
            return (this.step = stepCompany_enum_1.CompanyStepEnum.RISK_GROUP);
        }
        return (this.step = stepCompany_enum_1.CompanyStepEnum.RISKS);
    }
    getClinicStep() {
        this.steps = [stepCompany_enum_1.CompanyStepEnum.EXAMS, stepCompany_enum_1.CompanyStepEnum.PROFESSIONALS, stepCompany_enum_1.CompanyStepEnum.USERS, stepCompany_enum_1.CompanyStepEnum.NONE];
        const professionalStep = this.professionalCount == 0;
        const examStep = this.examCount == 0;
        const usersStep = this.usersCount == 0;
        if (examStep) {
            return (this.step = stepCompany_enum_1.CompanyStepEnum.EXAMS);
        }
        if (professionalStep) {
            return (this.step = stepCompany_enum_1.CompanyStepEnum.PROFESSIONALS);
        }
        if (usersStep) {
            return (this.step = stepCompany_enum_1.CompanyStepEnum.USERS);
        }
        return (this.step = stepCompany_enum_1.CompanyStepEnum.NONE);
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, cnpj: { required: true, type: () => String }, name: { required: true, type: () => String }, fantasy: { required: true, type: () => String }, status: { required: true, type: () => Object }, type: { required: true, type: () => Object }, isConsulting: { required: true, type: () => Boolean }, created_at: { required: true, type: () => Date }, updated_at: { required: true, type: () => Date }, licenseId: { required: true, type: () => Number }, groupId: { required: true, type: () => Number }, parentCompanyId: { required: true, type: () => String }, license: { required: false, type: () => require("./license.entity").LicenseEntity }, address: { required: false, type: () => require("./address-company.entity").AddressCompanyEntity }, workspace: { required: false, type: () => [require("./workspace.entity").WorkspaceEntity] }, employees: { required: false, type: () => [require("./employee.entity").EmployeeEntity] }, deleted_at: { required: true, type: () => Date, nullable: true }, primary_activity: { required: false, type: () => [require("./activity.entity").ActivityEntity] }, secondary_activity: { required: false, type: () => [require("./activity.entity").ActivityEntity] }, environments: { required: false, type: () => [require("./environment.entity").EnvironmentEntity] }, characterization: { required: false, type: () => [require("./characterization.entity").CharacterizationEntity] }, professionals: { required: false, type: () => [require("../../users/entities/professional.entity").ProfessionalEntity] }, riskFactorGroupData: { required: false, type: () => [require("../../sst/entities/riskGroupData.entity").RiskFactorGroupDataEntity] }, email: { required: true, type: () => String }, logoUrl: { required: true, type: () => String }, responsibleName: { required: true, type: () => String }, phone: { required: true, type: () => String }, operationTime: { required: true, type: () => String }, activityStartDate: { required: true, type: () => Date }, receivingServiceContracts: { required: false, type: () => [require("./contract.entity").ContractEntity] }, applyingServiceContracts: { required: false, type: () => [require("./contract.entity").ContractEntity] }, responsibleNit: { required: true, type: () => String }, responsibleCpf: { required: true, type: () => String }, initials: { required: true, type: () => String }, description: { required: true, type: () => String }, unit: { required: true, type: () => String }, numAsos: { required: true, type: () => Number }, blockResignationExam: { required: true, type: () => Boolean }, doctorResponsibleId: { required: true, type: () => Number }, tecResponsibleId: { required: true, type: () => Number }, contacts: { required: true, type: () => [require("./contact.entity").ContactEntity] }, covers: { required: true, type: () => [require("./document-cover.entity").DocumentCoverEntity] }, isClinic: { required: true, type: () => Boolean }, employeeCount: { required: false, type: () => Number }, riskGroupCount: { required: false, type: () => Number }, homogenousGroupCount: { required: false, type: () => Number }, hierarchyCount: { required: false, type: () => Number }, professionalCount: { required: false, type: () => Number }, examCount: { required: false, type: () => Number }, usersCount: { required: false, type: () => Number }, step: { required: false, enum: require("../../../shared/constants/enum/stepCompany.enum").CompanyStepEnum }, steps: { required: false, enum: require("../../../shared/constants/enum/stepCompany.enum").CompanyStepEnum, isArray: true }, paymentType: { required: true, type: () => Object }, paymentDay: { required: true, type: () => Number }, isTaxNote: { required: true, type: () => Boolean }, observationBank: { required: true, type: () => String }, companiesToClinicAvailable: { required: true, type: () => require("./company-clinics.entity").CompanyClinicsEntity }, clinicsAvailable: { required: true, type: () => require("./company-clinics.entity").CompanyClinicsEntity }, clinicExams: { required: true, type: () => [require("../../sst/entities/examToClinic").ExamToClinicEntity] }, report: { required: true, type: () => require("./report.entity").CompanyReportEntity }, riskDegree: { required: false, type: () => Number }, isGroup: { required: true, type: () => Boolean }, esocialSend: { required: true, type: () => Boolean }, companyGroupId: { required: true, type: () => Number }, esocialStart: { required: true, type: () => Date }, esocialLastTransmission: { required: true, type: () => Date }, group: { required: false, type: () => Object }, cert: { required: false, type: () => require("../../esocial/entities/companyCert.entity").CompanyCertEntity }, riskFactors: { required: false, type: () => [require("../../sst/entities/risk.entity").RiskFactorsEntity] }, hierarchy: { required: false, type: () => [require("./hierarchy.entity").HierarchyEntity] }, homogeneousGroup: { required: false, type: () => [require("./homoGroup.entity").HomoGroupEntity] }, doctorResponsible: { required: false, type: () => Object }, tecResponsible: { required: false, type: () => Object }, professionalsResponsibles: { required: false, type: () => [Object] }, ambResponsible: { required: false, type: () => Object }, mission: { required: true, type: () => String }, vision: { required: true, type: () => String }, values: { required: true, type: () => String }, activity_start_date: { required: true, type: () => String }, cadastral_situation_date: { required: true, type: () => String }, legal_nature_code: { required: true, type: () => String }, size: { required: true, type: () => String }, legal_nature: { required: true, type: () => String }, cadastral_situation: { required: true, type: () => String }, cadastral_situation_description: { required: true, type: () => String }, coordinatorName: { required: true, type: () => String }, stateRegistration: { required: true, type: () => String }, shortName: { required: true, type: () => String }, obs: { required: true, type: () => String } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The id of the Company' }),
    __metadata("design:type", String)
], CompanyEntity.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The CNPJ of the Company' }),
    __metadata("design:type", String)
], CompanyEntity.prototype, "cnpj", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The name of the Company' }),
    __metadata("design:type", String)
], CompanyEntity.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The fantasy name of the Company' }),
    __metadata("design:type", String)
], CompanyEntity.prototype, "fantasy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The current status of the Company',
        examples: ['ACTIVE', 'PENDING', 'CANCELED'],
    }),
    __metadata("design:type", String)
], CompanyEntity.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The type of the Company',
        examples: ['matriz', 'filial'],
    }),
    __metadata("design:type", String)
], CompanyEntity.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'If true, the company can administrate other companies',
    }),
    __metadata("design:type", Boolean)
], CompanyEntity.prototype, "isConsulting", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The creation date of the Company' }),
    __metadata("design:type", Date)
], CompanyEntity.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The last time that the Company data was updated',
    }),
    __metadata("design:type", Date)
], CompanyEntity.prototype, "updated_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The license id of the Company' }),
    __metadata("design:type", Number)
], CompanyEntity.prototype, "licenseId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The group id of the Company' }),
    __metadata("design:type", Number)
], CompanyEntity.prototype, "groupId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The parent company id of the Company' }),
    __metadata("design:type", String)
], CompanyEntity.prototype, "parentCompanyId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The creation date of the Company' }),
    __metadata("design:type", license_entity_1.LicenseEntity)
], CompanyEntity.prototype, "license", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The address of the Company' }),
    __metadata("design:type", address_company_entity_1.AddressCompanyEntity)
], CompanyEntity.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The workspace related to the company' }),
    __metadata("design:type", Array)
], CompanyEntity.prototype, "workspace", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The employees related to the company' }),
    __metadata("design:type", Array)
], CompanyEntity.prototype, "employees", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The deleted date of data' }),
    __metadata("design:type", Date)
], CompanyEntity.prototype, "deleted_at", void 0);
exports.CompanyEntity = CompanyEntity;
//# sourceMappingURL=company.entity.js.map