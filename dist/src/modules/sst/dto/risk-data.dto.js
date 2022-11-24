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
exports.FindRiskDataDto = exports.DeleteManyRiskDataDto = exports.UpsertManyRiskDataDto = exports.UpsertRiskDataDto = void 0;
const openapi = require("@nestjs/swagger");
const date_format_1 = require("./../../../shared/transformers/date-format");
const pagination_dto_1 = require("../../../shared/dto/pagination.dto");
const client_1 = require("@prisma/client");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const string_uppercase_transform_1 = require("../../../shared/transformers/string-uppercase.transform");
const keysOfEnum_utils_1 = require("../../../shared/utils/keysOfEnum.utils");
const epi_risk_data_dto_1 = require("./epi-risk-data.dto");
const engs_risk_data_dto_1 = require("./engs-risk-data.dto");
const exams_risk_data_dto_1 = require("./exams-risk-data.dto");
class UpsertRiskDataDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: false, type: () => String }, level: { required: false, type: () => Number }, workspaceId: { required: false, type: () => String }, type: { required: false, type: () => Object }, probability: { required: false, type: () => Number }, probabilityAfter: { required: false, type: () => Number }, standardExams: { required: false, type: () => Boolean }, companyId: { required: true, type: () => String }, riskId: { required: true, type: () => String }, hierarchyId: { required: false, type: () => String }, homogeneousGroupId: { required: true, type: () => String }, riskFactorGroupDataId: { required: true, type: () => String }, recs: { required: false, type: () => [String] }, adms: { required: false, type: () => [String] }, generateSources: { required: false, type: () => [String] }, epis: { required: false, type: () => [require("./epi-risk-data.dto").EpiRoRiskDataDto] }, engs: { required: false, type: () => [require("./engs-risk-data.dto").EngsRiskDataDto] }, exams: { required: false, type: () => [require("./exams-risk-data.dto").ExamsRiskDataDto] }, keepEmpty: { required: false, type: () => Boolean }, json: { required: false, type: () => Object }, startDate: { required: false, type: () => Date }, endDate: { required: false, type: () => Date } };
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpsertRiskDataDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpsertRiskDataDto.prototype, "level", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpsertRiskDataDto.prototype, "workspaceId", void 0);
__decorate([
    (0, class_transformer_1.Transform)(string_uppercase_transform_1.StringUppercaseTransform, { toClassOnly: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEnum)(client_1.HomoTypeEnum, {
        message: `type must be one of: ${(0, keysOfEnum_utils_1.KeysOfEnum)(client_1.HomoTypeEnum)}`,
    }),
    __metadata("design:type", String)
], UpsertRiskDataDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpsertRiskDataDto.prototype, "probability", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpsertRiskDataDto.prototype, "probabilityAfter", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpsertRiskDataDto.prototype, "standardExams", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpsertRiskDataDto.prototype, "companyId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpsertRiskDataDto.prototype, "riskId", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => !o.homogeneousGroupId || o.hierarchyId),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpsertRiskDataDto.prototype, "hierarchyId", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => !o.hierarchyId || o.homogeneousGroupId),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpsertRiskDataDto.prototype, "homogeneousGroupId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpsertRiskDataDto.prototype, "riskFactorGroupDataId", void 0);
__decorate([
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpsertRiskDataDto.prototype, "recs", void 0);
__decorate([
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpsertRiskDataDto.prototype, "adms", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpsertRiskDataDto.prototype, "generateSources", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => epi_risk_data_dto_1.EpiRoRiskDataDto),
    __metadata("design:type", Array)
], UpsertRiskDataDto.prototype, "epis", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => engs_risk_data_dto_1.EngsRiskDataDto),
    __metadata("design:type", Array)
], UpsertRiskDataDto.prototype, "engs", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => exams_risk_data_dto_1.ExamsRiskDataDto),
    __metadata("design:type", Array)
], UpsertRiskDataDto.prototype, "exams", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpsertRiskDataDto.prototype, "keepEmpty", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpsertRiskDataDto.prototype, "json", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(date_format_1.DateFormat, { toClassOnly: true }),
    (0, class_validator_1.IsDate)({ message: 'Data de início inválida' }),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], UpsertRiskDataDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(date_format_1.DateFormat, { toClassOnly: true }),
    (0, class_validator_1.IsDate)({ message: 'Data de fim inválida' }),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], UpsertRiskDataDto.prototype, "endDate", void 0);
exports.UpsertRiskDataDto = UpsertRiskDataDto;
class UpsertManyRiskDataDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: false, type: () => String }, type: { required: false, type: () => Object }, level: { required: false, type: () => Number }, workspaceId: { required: false, type: () => String }, workspaceIds: { required: false, type: () => String }, probability: { required: false, type: () => Number }, probabilityAfter: { required: false, type: () => Number }, standardExams: { required: false, type: () => Boolean }, companyId: { required: true, type: () => String }, riskId: { required: true, type: () => String }, riskIds: { required: true, type: () => [String] }, hierarchyIds: { required: true, type: () => [String] }, homogeneousGroupIds: { required: true, type: () => [String] }, riskFactorGroupDataId: { required: true, type: () => String }, recs: { required: false, type: () => [String] }, adms: { required: false, type: () => [String] }, generateSources: { required: false, type: () => [String] }, epis: { required: false, type: () => [require("./epi-risk-data.dto").EpiRoRiskDataDto] }, engs: { required: false, type: () => [require("./engs-risk-data.dto").EngsRiskDataDto] }, exams: { required: false, type: () => [require("./exams-risk-data.dto").ExamsRiskDataDto] }, json: { required: false, type: () => Object }, startDate: { required: false, type: () => Date }, endDate: { required: false, type: () => Date } };
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpsertManyRiskDataDto.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Transform)(string_uppercase_transform_1.StringUppercaseTransform, { toClassOnly: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEnum)(client_1.HomoTypeEnum, {
        message: `type must be one of: ${(0, keysOfEnum_utils_1.KeysOfEnum)(client_1.HomoTypeEnum)}`,
    }),
    __metadata("design:type", String)
], UpsertManyRiskDataDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpsertManyRiskDataDto.prototype, "level", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpsertManyRiskDataDto.prototype, "workspaceId", void 0);
__decorate([
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpsertManyRiskDataDto.prototype, "workspaceIds", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpsertManyRiskDataDto.prototype, "probability", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpsertManyRiskDataDto.prototype, "probabilityAfter", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpsertManyRiskDataDto.prototype, "standardExams", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpsertManyRiskDataDto.prototype, "companyId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpsertManyRiskDataDto.prototype, "riskId", void 0);
__decorate([
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpsertManyRiskDataDto.prototype, "riskIds", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => !o.homogeneousGroupIds || o.hierarchyIds),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpsertManyRiskDataDto.prototype, "hierarchyIds", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => !o.hierarchyIds || o.homogeneousGroupIds),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpsertManyRiskDataDto.prototype, "homogeneousGroupIds", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpsertManyRiskDataDto.prototype, "riskFactorGroupDataId", void 0);
__decorate([
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpsertManyRiskDataDto.prototype, "recs", void 0);
__decorate([
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpsertManyRiskDataDto.prototype, "adms", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpsertManyRiskDataDto.prototype, "generateSources", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => epi_risk_data_dto_1.EpiRoRiskDataDto),
    __metadata("design:type", Array)
], UpsertManyRiskDataDto.prototype, "epis", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => engs_risk_data_dto_1.EngsRiskDataDto),
    __metadata("design:type", Array)
], UpsertManyRiskDataDto.prototype, "engs", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => exams_risk_data_dto_1.ExamsRiskDataDto),
    __metadata("design:type", Array)
], UpsertManyRiskDataDto.prototype, "exams", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpsertManyRiskDataDto.prototype, "json", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(date_format_1.DateFormat, { toClassOnly: true }),
    (0, class_validator_1.IsDate)({ message: 'Data de início inválida' }),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], UpsertManyRiskDataDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(date_format_1.DateFormat, { toClassOnly: true }),
    (0, class_validator_1.IsDate)({ message: 'Data de fim inválida' }),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], UpsertManyRiskDataDto.prototype, "endDate", void 0);
exports.UpsertManyRiskDataDto = UpsertManyRiskDataDto;
class DeleteManyRiskDataDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { ids: { required: true, type: () => [String] } };
    }
}
__decorate([
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], DeleteManyRiskDataDto.prototype, "ids", void 0);
exports.DeleteManyRiskDataDto = DeleteManyRiskDataDto;
class FindRiskDataDto extends pagination_dto_1.PaginationQueryDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { search: { required: false, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FindRiskDataDto.prototype, "search", void 0);
exports.FindRiskDataDto = FindRiskDataDto;
//# sourceMappingURL=risk-data.dto.js.map