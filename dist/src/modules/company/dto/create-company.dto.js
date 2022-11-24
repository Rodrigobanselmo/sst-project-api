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
exports.FindCompaniesDto = exports.CreateCompanyDto = void 0;
const openapi = require("@nestjs/swagger");
const query_array_1 = require("./../../../shared/transformers/query-array");
const pagination_dto_1 = require("./../../../shared/dto/pagination.dto");
const client_1 = require("@prisma/client");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const cnpj_format_transform_1 = require("../../../shared/transformers/cnpj-format.transform");
const string_capitalize_1 = require("../../../shared/transformers/string-capitalize");
const string_uppercase_transform_1 = require("../../../shared/transformers/string-uppercase.transform");
const keysOfEnum_utils_1 = require("../../../shared/utils/keysOfEnum.utils");
const activity_dto_1 = require("./activity.dto");
const address_dto_1 = require("./address.dto");
const license_dto_1 = require("./license.dto");
const workspace_dto_1 = require("./workspace.dto");
class CreateCompanyDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { cnpj: { required: true, type: () => String }, name: { required: true, type: () => String, maxLength: 500 }, fantasy: { required: true, type: () => String }, status: { required: true, type: () => Object }, type: { required: true, type: () => Object }, isConsulting: { required: true, type: () => Boolean }, isClinic: { required: false, type: () => Boolean }, license: { required: false, type: () => require("./license.dto").LicenseDto }, address: { required: false, type: () => require("./address.dto").AddressDto }, workspace: { required: true, type: () => [require("./workspace.dto").WorkspaceDto] }, primary_activity: { required: true, type: () => [require("./activity.dto").ActivityDto] }, secondary_activity: { required: true, type: () => [require("./activity.dto").ActivityDto] }, size: { required: true, type: () => String }, phone: { required: true, type: () => String }, legal_nature: { required: true, type: () => String }, cadastral_situation: { required: true, type: () => String }, activity_start_date: { required: true, type: () => String }, cadastral_situation_date: { required: true, type: () => String }, legal_nature_code: { required: true, type: () => String }, cadastral_situation_description: { required: true, type: () => String }, operationTime: { required: false, type: () => String }, description: { required: false, type: () => String }, responsibleName: { required: false, type: () => String }, email: { required: false, type: () => String }, numAsos: { required: false, type: () => Number }, blockResignationExam: { required: false, type: () => Boolean }, esocialStart: { required: false, type: () => Date }, responsibleNit: { required: false, type: () => String }, responsibleCpf: { required: false, type: () => String }, initials: { required: false, type: () => String }, unit: { required: false, type: () => String }, stateRegistration: { required: false, type: () => String }, obs: { required: false, type: () => String }, paymentDay: { required: false, type: () => Number }, isTaxNote: { required: false, type: () => Boolean }, observationBank: { required: false, type: () => String }, paymentType: { required: false, type: () => Object }, doctorResponsibleId: { required: false, type: () => Number }, tecResponsibleId: { required: false, type: () => Number }, esocialSend: { required: false, type: () => Boolean } };
    }
}
__decorate([
    (0, class_transformer_1.Transform)(cnpj_format_transform_1.CnpjFormatTransform, { toClassOnly: true }),
    (0, class_validator_1.Length)(14, 14, { message: 'invalid CNPJ' }),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "cnpj", void 0);
__decorate([
    (0, class_transformer_1.Transform)(string_capitalize_1.StringCapitalizeTransform, { toClassOnly: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "name", void 0);
__decorate([
    (0, class_transformer_1.Transform)(string_capitalize_1.StringCapitalizeTransform, { toClassOnly: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "fantasy", void 0);
__decorate([
    (0, class_transformer_1.Transform)(string_uppercase_transform_1.StringUppercaseTransform, { toClassOnly: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.StatusEnum, {
        message: `status must be one of: ${(0, keysOfEnum_utils_1.KeysOfEnum)(client_1.StatusEnum)}`,
    }),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "status", void 0);
__decorate([
    (0, class_transformer_1.Transform)(string_uppercase_transform_1.StringUppercaseTransform, { toClassOnly: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEnum)(client_1.CompanyTypesEnum, {
        message: `Tiop de empresa inválido`,
    }),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateCompanyDto.prototype, "isConsulting", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateCompanyDto.prototype, "isClinic", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => license_dto_1.LicenseDto),
    __metadata("design:type", license_dto_1.LicenseDto)
], CreateCompanyDto.prototype, "license", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => address_dto_1.AddressDto),
    __metadata("design:type", address_dto_1.AddressDto)
], CreateCompanyDto.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => workspace_dto_1.WorkspaceDto),
    __metadata("design:type", Array)
], CreateCompanyDto.prototype, "workspace", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_validator_1.IsDefined)(),
    (0, class_transformer_1.Type)(() => activity_dto_1.ActivityDto),
    __metadata("design:type", Array)
], CreateCompanyDto.prototype, "primary_activity", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => activity_dto_1.ActivityDto),
    __metadata("design:type", Array)
], CreateCompanyDto.prototype, "secondary_activity", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "size", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "legal_nature", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "cadastral_situation", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "activity_start_date", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "cadastral_situation_date", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "legal_nature_code", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "cadastral_situation_description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "operationTime", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "responsibleName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateCompanyDto.prototype, "numAsos", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateCompanyDto.prototype, "blockResignationExam", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], CreateCompanyDto.prototype, "esocialStart", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "responsibleNit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "responsibleCpf", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "initials", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "unit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "stateRegistration", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "obs", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateCompanyDto.prototype, "paymentDay", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateCompanyDto.prototype, "isTaxNote", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "observationBank", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(string_uppercase_transform_1.StringUppercaseTransform, { toClassOnly: true }),
    (0, class_validator_1.IsEnum)(client_1.CompanyPaymentTypeEnum, {
        message: `Tipo de pagamento inválido`,
    }),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "paymentType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateCompanyDto.prototype, "doctorResponsibleId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateCompanyDto.prototype, "tecResponsibleId", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateCompanyDto.prototype, "esocialSend", void 0);
exports.CreateCompanyDto = CreateCompanyDto;
class FindCompaniesDto extends pagination_dto_1.PaginationQueryDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { search: { required: false, type: () => String }, fantasy: { required: false, type: () => String }, userId: { required: false, type: () => Number }, groupId: { required: false, type: () => Number }, isClinic: { required: false, type: () => Boolean }, isGroup: { required: false, type: () => Boolean }, findAll: { required: false, type: () => Boolean }, clinicsCompanyId: { required: false, type: () => String }, isConsulting: { required: false, type: () => Boolean }, isPeriodic: { required: false, type: () => Boolean }, isChange: { required: false, type: () => Boolean }, isAdmission: { required: false, type: () => Boolean }, isReturn: { required: false, type: () => Boolean }, isDismissal: { required: false, type: () => Boolean }, selectReport: { required: false, type: () => Boolean }, type: { required: false, type: () => [Object] }, companiesIds: { required: false, type: () => [String] }, clinicExamsIds: { required: false, type: () => [Number] } };
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FindCompaniesDto.prototype, "search", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FindCompaniesDto.prototype, "fantasy", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], FindCompaniesDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], FindCompaniesDto.prototype, "groupId", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], FindCompaniesDto.prototype, "isClinic", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], FindCompaniesDto.prototype, "isGroup", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], FindCompaniesDto.prototype, "findAll", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FindCompaniesDto.prototype, "clinicsCompanyId", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], FindCompaniesDto.prototype, "isConsulting", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], FindCompaniesDto.prototype, "isPeriodic", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], FindCompaniesDto.prototype, "isChange", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], FindCompaniesDto.prototype, "isAdmission", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], FindCompaniesDto.prototype, "isReturn", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], FindCompaniesDto.prototype, "isDismissal", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], FindCompaniesDto.prototype, "selectReport", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(string_uppercase_transform_1.StringUppercaseTransform, { toClassOnly: true }),
    (0, class_transformer_1.Transform)(query_array_1.QueryArray, { toClassOnly: true }),
    (0, class_validator_1.IsEnum)(client_1.CompanyTypesEnum, {
        message: `Tiop de empresa inválido`,
        each: true,
    }),
    __metadata("design:type", Array)
], FindCompaniesDto.prototype, "type", void 0);
__decorate([
    (0, class_transformer_1.Transform)(query_array_1.QueryArray, { toClassOnly: true }),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], FindCompaniesDto.prototype, "companiesIds", void 0);
__decorate([
    (0, class_transformer_1.Transform)((t) => (0, query_array_1.QueryArray)(t, (v) => Number(v)), { toClassOnly: true }),
    (0, class_validator_1.IsInt)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], FindCompaniesDto.prototype, "clinicExamsIds", void 0);
exports.FindCompaniesDto = FindCompaniesDto;
//# sourceMappingURL=create-company.dto.js.map