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
exports.FindCompanyEmployeeExamHistoryDto = exports.FindClinicEmployeeExamHistoryDto = exports.FindEmployeeExamHistoryDto = exports.UpdateFileExamDto = exports.UpdateManyScheduleExamDto = exports.UpdateEmployeeExamHistoryDto = exports.CreateEmployeeExamHistoryDto = exports.EmployeeComplementaryExamHistoryDto = void 0;
const string_capitalize_1 = require("./../../../shared/transformers/string-capitalize");
const errorMessage_1 = require("./../../../shared/constants/enum/errorMessage");
const cpf_format_transform_1 = require("./../../../shared/transformers/cpf-format.transform");
const string_uppercase_transform_1 = require("./../../../shared/transformers/string-uppercase.transform");
const date_format_1 = require("./../../../shared/transformers/date-format");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const pagination_dto_1 = require("./../../../shared/dto/pagination.dto");
const class_transformer_1 = require("class-transformer");
const client_1 = require("@prisma/client");
const query_array_1 = require("./../../../shared/transformers/query-array");
class EmployeeComplementaryExamHistoryDto {
}
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], EmployeeComplementaryExamHistoryDto.prototype, "examId", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], EmployeeComplementaryExamHistoryDto.prototype, "validityInMonths", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EmployeeComplementaryExamHistoryDto.prototype, "clinicId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EmployeeComplementaryExamHistoryDto.prototype, "time", void 0);
__decorate([
    (0, class_transformer_1.Transform)(date_format_1.DateFormat, { toClassOnly: true }),
    (0, class_validator_1.IsDate)({ message: 'Data de realização de exame inválida' }),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], EmployeeComplementaryExamHistoryDto.prototype, "doneDate", void 0);
__decorate([
    (0, class_transformer_1.Transform)(string_uppercase_transform_1.StringUppercaseTransform, { toClassOnly: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.StatusEnum, {
        message: `status inválido`,
    }),
    __metadata("design:type", String)
], EmployeeComplementaryExamHistoryDto.prototype, "status", void 0);
__decorate([
    (0, class_transformer_1.Transform)(string_uppercase_transform_1.StringUppercaseTransform, { toClassOnly: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEnum)(client_1.ClinicScheduleTypeEnum, {
        message: `tipo de conclusão inválido`,
    }),
    __metadata("design:type", String)
], EmployeeComplementaryExamHistoryDto.prototype, "scheduleType", void 0);
exports.EmployeeComplementaryExamHistoryDto = EmployeeComplementaryExamHistoryDto;
class CreateEmployeeExamHistoryDto {
}
__decorate([
    (0, class_validator_1.ValidateIf)((o) => !!o.examId && o.status == client_1.StatusEnum.DONE),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateEmployeeExamHistoryDto.prototype, "examId", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => !!o.examId),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateEmployeeExamHistoryDto.prototype, "employeeId", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => !!o.examId),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEmployeeExamHistoryDto.prototype, "time", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateEmployeeExamHistoryDto.prototype, "obs", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateEmployeeExamHistoryDto.prototype, "clinicObs", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => !!o.examId && o.status == client_1.StatusEnum.DONE),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateEmployeeExamHistoryDto.prototype, "validityInMonths", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => !!o.examId && o.status == client_1.StatusEnum.DONE),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateEmployeeExamHistoryDto.prototype, "doctorId", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => !!o.examId),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEmployeeExamHistoryDto.prototype, "clinicId", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => !!o.examId),
    (0, class_transformer_1.Transform)(date_format_1.DateFormat, { toClassOnly: true }),
    (0, class_validator_1.IsDate)({ message: 'Data de realização de exame inválida' }),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], CreateEmployeeExamHistoryDto.prototype, "doneDate", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => !!o.examId),
    (0, class_transformer_1.Transform)(string_uppercase_transform_1.StringUppercaseTransform, { toClassOnly: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEnum)(client_1.ExamHistoryTypeEnum, {
        message: `tipo de exame inválido`,
    }),
    __metadata("design:type", String)
], CreateEmployeeExamHistoryDto.prototype, "examType", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => !!o.examId && o.status == client_1.StatusEnum.DONE),
    (0, class_transformer_1.Transform)(string_uppercase_transform_1.StringUppercaseTransform, { toClassOnly: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEnum)(client_1.ExamHistoryEvaluationEnum, {
        message: `tipo de avaliação inválido`,
    }),
    __metadata("design:type", String)
], CreateEmployeeExamHistoryDto.prototype, "evaluationType", void 0);
__decorate([
    (0, class_transformer_1.Transform)(string_uppercase_transform_1.StringUppercaseTransform, { toClassOnly: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEnum)(client_1.ExamHistoryConclusionEnum, {
        message: `tipo de conclusão inválido`,
    }),
    __metadata("design:type", String)
], CreateEmployeeExamHistoryDto.prototype, "conclusion", void 0);
__decorate([
    (0, class_transformer_1.Transform)(string_uppercase_transform_1.StringUppercaseTransform, { toClassOnly: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.StatusEnum, {
        message: `status inválido`,
    }),
    __metadata("design:type", String)
], CreateEmployeeExamHistoryDto.prototype, "status", void 0);
__decorate([
    (0, class_transformer_1.Transform)(string_uppercase_transform_1.StringUppercaseTransform, { toClassOnly: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEnum)(client_1.ClinicScheduleTypeEnum, {
        message: `tipo de conclusão inválido`,
    }),
    __metadata("design:type", String)
], CreateEmployeeExamHistoryDto.prototype, "scheduleType", void 0);
__decorate([
    (0, class_transformer_1.Transform)(date_format_1.DateFormat, { toClassOnly: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)({ message: 'Data inválida' }),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], CreateEmployeeExamHistoryDto.prototype, "changeHierarchyDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateEmployeeExamHistoryDto.prototype, "changeHierarchyAnyway", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEmployeeExamHistoryDto.prototype, "hierarchyId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEmployeeExamHistoryDto.prototype, "subOfficeId", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => EmployeeComplementaryExamHistoryDto),
    __metadata("design:type", Array)
], CreateEmployeeExamHistoryDto.prototype, "examsData", void 0);
exports.CreateEmployeeExamHistoryDto = CreateEmployeeExamHistoryDto;
class UpdateEmployeeExamHistoryDto extends (0, swagger_1.PartialType)(CreateEmployeeExamHistoryDto) {
}
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateEmployeeExamHistoryDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateEmployeeExamHistoryDto.prototype, "doctorId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateEmployeeExamHistoryDto.prototype, "time", void 0);
__decorate([
    (0, class_transformer_1.Transform)(string_uppercase_transform_1.StringUppercaseTransform, { toClassOnly: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEnum)(client_1.ExamHistoryEvaluationEnum, {
        message: `tipo de avaliação inválido`,
    }),
    __metadata("design:type", String)
], UpdateEmployeeExamHistoryDto.prototype, "evaluationType", void 0);
__decorate([
    (0, class_transformer_1.Transform)(string_uppercase_transform_1.StringUppercaseTransform, { toClassOnly: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEnum)(client_1.ExamHistoryConclusionEnum, {
        message: `tipo de conclusão inválido`,
    }),
    __metadata("design:type", String)
], UpdateEmployeeExamHistoryDto.prototype, "conclusion", void 0);
exports.UpdateEmployeeExamHistoryDto = UpdateEmployeeExamHistoryDto;
class UpdateManyScheduleExamDto {
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(cpf_format_transform_1.CpfFormatTransform, { toClassOnly: true }),
    (0, class_validator_1.Length)(11, 11, { message: errorMessage_1.ErrorCompanyEnum.INVALID_CPF }),
    __metadata("design:type", String)
], UpdateManyScheduleExamDto.prototype, "cpf", void 0);
__decorate([
    (0, class_transformer_1.Transform)(string_capitalize_1.StringCapitalizeTransform, { toClassOnly: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], UpdateManyScheduleExamDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateManyScheduleExamDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateManyScheduleExamDto.prototype, "email", void 0);
__decorate([
    (0, class_transformer_1.Transform)(string_uppercase_transform_1.StringUppercaseTransform, { toClassOnly: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.SexTypeEnum, {
        message: `Sexo inválido`,
    }),
    __metadata("design:type", String)
], UpdateManyScheduleExamDto.prototype, "sex", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(date_format_1.DateFormat, { toClassOnly: true }),
    (0, class_validator_1.IsDate)({ message: 'Data de aniversário inválida' }),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], UpdateManyScheduleExamDto.prototype, "birthday", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateManyScheduleExamDto.prototype, "isClinic", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_validator_1.IsDefined)(),
    (0, class_transformer_1.Type)(() => UpdateEmployeeExamHistoryDto),
    __metadata("design:type", Array)
], UpdateManyScheduleExamDto.prototype, "data", void 0);
exports.UpdateManyScheduleExamDto = UpdateManyScheduleExamDto;
class UpdateFileExamDto {
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateFileExamDto.prototype, "ids", void 0);
exports.UpdateFileExamDto = UpdateFileExamDto;
class FindEmployeeExamHistoryDto extends pagination_dto_1.PaginationQueryDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FindEmployeeExamHistoryDto.prototype, "search", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FindEmployeeExamHistoryDto.prototype, "companyId", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], FindEmployeeExamHistoryDto.prototype, "examId", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], FindEmployeeExamHistoryDto.prototype, "employeeId", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], FindEmployeeExamHistoryDto.prototype, "allCompanies", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], FindEmployeeExamHistoryDto.prototype, "allExams", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], FindEmployeeExamHistoryDto.prototype, "orderByCreation", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], FindEmployeeExamHistoryDto.prototype, "includeClinic", void 0);
__decorate([
    (0, class_transformer_1.Transform)(query_array_1.QueryArray, { toClassOnly: true }),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], FindEmployeeExamHistoryDto.prototype, "status", void 0);
exports.FindEmployeeExamHistoryDto = FindEmployeeExamHistoryDto;
class FindClinicEmployeeExamHistoryDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FindClinicEmployeeExamHistoryDto.prototype, "companyId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], FindClinicEmployeeExamHistoryDto.prototype, "employeeId", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => !o.employeeId),
    (0, class_transformer_1.Transform)(date_format_1.DateFormat, { toClassOnly: true }),
    (0, class_validator_1.IsDate)({ message: 'Data inválida' }),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], FindClinicEmployeeExamHistoryDto.prototype, "date", void 0);
exports.FindClinicEmployeeExamHistoryDto = FindClinicEmployeeExamHistoryDto;
class FindCompanyEmployeeExamHistoryDto extends pagination_dto_1.PaginationQueryDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FindCompanyEmployeeExamHistoryDto.prototype, "search", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FindCompanyEmployeeExamHistoryDto.prototype, "companyId", void 0);
exports.FindCompanyEmployeeExamHistoryDto = FindCompanyEmployeeExamHistoryDto;
//# sourceMappingURL=employee-exam-history.js.map