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
const client_1 = require(".prisma/client");
const swagger_1 = require("@nestjs/swagger");
const client_2 = require("@prisma/client");
const license_entity_1 = require("./license.entity");
class CompanyEntity {
    constructor(partial) {
        Object.assign(this, partial);
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, cnpj: { required: true, type: () => String }, name: { required: true, type: () => String }, fantasy: { required: true, type: () => String }, status: { required: true, type: () => Object }, type: { required: true, type: () => Object }, isConsulting: { required: true, type: () => Boolean }, created_at: { required: true, type: () => Date }, updated_at: { required: true, type: () => Date }, licenseId: { required: true, type: () => Number }, parentCompanyId: { required: true, type: () => String }, license: { required: false, type: () => require("./license.entity").LicenseEntity }, workspaces: { required: false, type: () => [require("./workspace.entity").WorkspaceEntity] }, employees: { required: false, type: () => [require("./employee.entity").EmployeeEntity] }, deleted_at: { required: true, type: () => Date, nullable: true }, description: { required: true, type: () => String }, email: { required: true, type: () => String }, riskDegree: { required: true, type: () => Number }, operatonTime: { required: true, type: () => String }, logoUrl: { required: true, type: () => String }, responsableName: { required: true, type: () => String }, mission: { required: true, type: () => String }, vision: { required: true, type: () => String }, values: { required: true, type: () => String }, size: { required: true, type: () => String }, phone: { required: true, type: () => String }, legal_nature: { required: true, type: () => String }, cadastral_situation: { required: true, type: () => String }, activity_start_date: { required: true, type: () => String }, cadastral_situation_date: { required: true, type: () => String }, legal_nature_code: { required: true, type: () => String }, cadastral_situation_description: { required: true, type: () => String }, employeeCount: { required: false, type: () => Number }, riskGroupCount: { required: false, type: () => Number } };
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
    (0, swagger_1.ApiProperty)({ description: 'The parent company id of the Company' }),
    __metadata("design:type", String)
], CompanyEntity.prototype, "parentCompanyId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The creation date of the Company' }),
    __metadata("design:type", license_entity_1.LicenseEntity)
], CompanyEntity.prototype, "license", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The workspace related to the company' }),
    __metadata("design:type", Array)
], CompanyEntity.prototype, "workspaces", void 0);
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