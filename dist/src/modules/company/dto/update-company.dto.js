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
exports.UpdateCompanyDto = void 0;
const openapi = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const cnpj_format_transform_1 = require("../../../shared/transformers/cnpj-format.transform");
const string_capitalize_1 = require("../../../shared/transformers/string-capitalize");
const string_uppercase_transform_1 = require("../../../shared/transformers/string-uppercase.transform");
const keysOfEnum_utils_1 = require("../../../shared/utils/keysOfEnum.utils");
const activity_dto_1 = require("./activity.dto");
const address_dto_1 = require("./address.dto");
const employee_dto_1 = require("./employee.dto");
const update_user_company_dto_1 = require("./update-user-company.dto");
const workspace_dto_1 = require("./workspace.dto");
class UpdateCompanyDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: false, type: () => String }, companyId: { required: true, type: () => String }, users: { required: false, type: () => [require("./update-user-company.dto").UserCompanyEditDto] }, employees: { required: false, type: () => [require("./employee.dto").UpdateEmployeeDto] }, cnpj: { required: false, type: () => String }, name: { required: false, type: () => String, maxLength: 100 }, fantasy: { required: false, type: () => String, maxLength: 100 }, status: { required: false, type: () => Object }, type: { required: false, type: () => Object }, address: { required: false, type: () => require("./address.dto").AddressDto }, workspace: { required: false, type: () => [require("./workspace.dto").WorkspaceDto] }, primary_activity: { required: false, type: () => [require("./activity.dto").ActivityDto] }, secondary_activity: { required: false, type: () => [require("./activity.dto").ActivityDto] }, size: { required: false, type: () => String }, phone: { required: false, type: () => String }, legal_nature: { required: false, type: () => String }, cadastral_situation: { required: false, type: () => String }, activity_start_date: { required: false, type: () => String }, cadastral_situation_date: { required: false, type: () => String }, legal_nature_code: { required: false, type: () => String }, cadastral_situation_description: { required: false, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "companyId", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => update_user_company_dto_1.UserCompanyEditDto),
    __metadata("design:type", Array)
], UpdateCompanyDto.prototype, "users", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => employee_dto_1.UpdateEmployeeDto),
    __metadata("design:type", Array)
], UpdateCompanyDto.prototype, "employees", void 0);
__decorate([
    (0, class_transformer_1.Transform)(cnpj_format_transform_1.CnpjFormatTransform, { toClassOnly: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(18, 18, { message: 'invalid CNPJ' }),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "cnpj", void 0);
__decorate([
    (0, class_transformer_1.Transform)(string_capitalize_1.StringCapitalizeTransform, { toClassOnly: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "name", void 0);
__decorate([
    (0, class_transformer_1.Transform)(string_capitalize_1.StringCapitalizeTransform, { toClassOnly: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "fantasy", void 0);
__decorate([
    (0, class_transformer_1.Transform)(string_uppercase_transform_1.StringUppercaseTransform, { toClassOnly: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.StatusEnum, {
        message: `status must be one of: ${(0, keysOfEnum_utils_1.KeysOfEnum)(client_1.StatusEnum)}`,
    }),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "status", void 0);
__decorate([
    (0, class_transformer_1.Transform)(string_uppercase_transform_1.StringUppercaseTransform, { toClassOnly: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEnum)(client_1.CompanyTypesEnum, {
        message: `type must be one of: ${(0, keysOfEnum_utils_1.KeysOfEnum)(client_1.CompanyTypesEnum)}`,
    }),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => address_dto_1.AddressDto),
    __metadata("design:type", address_dto_1.AddressDto)
], UpdateCompanyDto.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => workspace_dto_1.WorkspaceDto),
    __metadata("design:type", Array)
], UpdateCompanyDto.prototype, "workspace", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => activity_dto_1.ActivityDto),
    __metadata("design:type", Array)
], UpdateCompanyDto.prototype, "primary_activity", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => activity_dto_1.ActivityDto),
    __metadata("design:type", Array)
], UpdateCompanyDto.prototype, "secondary_activity", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "size", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "legal_nature", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "cadastral_situation", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "activity_start_date", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "cadastral_situation_date", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "legal_nature_code", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "cadastral_situation_description", void 0);
exports.UpdateCompanyDto = UpdateCompanyDto;
//# sourceMappingURL=update-company.dto.js.map