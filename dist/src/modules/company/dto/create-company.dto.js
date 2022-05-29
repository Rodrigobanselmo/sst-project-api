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
exports.CreateCompanyDto = void 0;
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
const license_dto_1 = require("./license.dto");
const workspace_dto_1 = require("./workspace.dto");
class CreateCompanyDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { cnpj: { required: true, type: () => String }, name: { required: true, type: () => String, maxLength: 100 }, fantasy: { required: true, type: () => String, maxLength: 100 }, status: { required: true, type: () => Object }, type: { required: true, type: () => Object }, isConsulting: { required: true, type: () => Boolean }, license: { required: false, type: () => require("./license.dto").LicenseDto }, address: { required: false, type: () => require("./address.dto").AddressDto }, workspace: { required: true, type: () => [require("./workspace.dto").WorkspaceDto] }, primary_activity: { required: true, type: () => [require("./activity.dto").ActivityDto] }, secondary_activity: { required: true, type: () => [require("./activity.dto").ActivityDto] }, size: { required: true, type: () => String }, phone: { required: true, type: () => String }, legal_nature: { required: true, type: () => String }, cadastral_situation: { required: true, type: () => String }, activity_start_date: { required: true, type: () => String }, cadastral_situation_date: { required: true, type: () => String }, legal_nature_code: { required: true, type: () => String }, cadastral_situation_description: { required: true, type: () => String } };
    }
}
__decorate([
    (0, class_transformer_1.Transform)(cnpj_format_transform_1.CnpjFormatTransform, { toClassOnly: true }),
    (0, class_validator_1.Length)(18, 18, { message: 'invalid CNPJ' }),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "cnpj", void 0);
__decorate([
    (0, class_transformer_1.Transform)(string_capitalize_1.StringCapitalizeTransform, { toClassOnly: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "name", void 0);
__decorate([
    (0, class_transformer_1.Transform)(string_capitalize_1.StringCapitalizeTransform, { toClassOnly: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(100),
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
        message: `type must be one of: ${(0, keysOfEnum_utils_1.KeysOfEnum)(client_1.CompanyTypesEnum)}`,
    }),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateCompanyDto.prototype, "isConsulting", void 0);
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
exports.CreateCompanyDto = CreateCompanyDto;
//# sourceMappingURL=create-company.dto.js.map