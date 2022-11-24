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
exports.FindExamToClinicDto = exports.CopyExamsToClinicDto = exports.UpsertManyExamToClinicDto = exports.UpsertExamToClinicDto = void 0;
const openapi = require("@nestjs/swagger");
const pagination_dto_1 = require("../../../shared/dto/pagination.dto");
const client_1 = require("@prisma/client");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const date_format_1 = require("../../../shared/transformers/date-format");
const string_uppercase_transform_1 = require("../../../shared/transformers/string-uppercase.transform");
class UpsertExamToClinicDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: false, type: () => Number }, examId: { required: true, type: () => Number }, companyId: { required: true, type: () => String }, groupId: { required: false, type: () => String }, dueInDays: { required: false, type: () => Number }, isScheduled: { required: false, type: () => Boolean }, observation: { required: false, type: () => String }, price: { required: false, type: () => Number }, scheduleRange: { required: false, type: () => Object }, examMinDuration: { required: false, type: () => Number }, isPeriodic: { required: false, type: () => Boolean }, isChange: { required: false, type: () => Boolean }, isAdmission: { required: false, type: () => Boolean }, isReturn: { required: false, type: () => Boolean }, isDismissal: { required: false, type: () => Boolean }, scheduleType: { required: false, type: () => Object }, startDate: { required: true, type: () => Date }, endDate: { required: true, type: () => Date }, status: { required: false, type: () => Object } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], UpsertExamToClinicDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], UpsertExamToClinicDto.prototype, "examId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpsertExamToClinicDto.prototype, "companyId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpsertExamToClinicDto.prototype, "groupId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], UpsertExamToClinicDto.prototype, "dueInDays", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpsertExamToClinicDto.prototype, "isScheduled", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpsertExamToClinicDto.prototype, "observation", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpsertExamToClinicDto.prototype, "price", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpsertExamToClinicDto.prototype, "scheduleRange", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpsertExamToClinicDto.prototype, "examMinDuration", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpsertExamToClinicDto.prototype, "isPeriodic", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpsertExamToClinicDto.prototype, "isChange", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpsertExamToClinicDto.prototype, "isAdmission", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpsertExamToClinicDto.prototype, "isReturn", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpsertExamToClinicDto.prototype, "isDismissal", void 0);
__decorate([
    (0, class_transformer_1.Transform)(string_uppercase_transform_1.StringUppercaseTransform, { toClassOnly: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEnum)(client_1.ClinicScheduleTypeEnum, {
        message: `Tipo de agendamento inválido`,
    }),
    __metadata("design:type", String)
], UpsertExamToClinicDto.prototype, "scheduleType", void 0);
__decorate([
    (0, class_transformer_1.Transform)(date_format_1.DateFormat, { toClassOnly: true }),
    (0, class_validator_1.IsDate)({ message: 'Data de início inválida' }),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], UpsertExamToClinicDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(date_format_1.DateFormat, { toClassOnly: true }),
    (0, class_validator_1.IsDate)({ message: 'Data de fim inválida' }),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], UpsertExamToClinicDto.prototype, "endDate", void 0);
__decorate([
    (0, class_transformer_1.Transform)(string_uppercase_transform_1.StringUppercaseTransform, { toClassOnly: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEnum)(client_1.StatusEnum, {
        message: `Tipo de status inválido`,
    }),
    __metadata("design:type", String)
], UpsertExamToClinicDto.prototype, "status", void 0);
exports.UpsertExamToClinicDto = UpsertExamToClinicDto;
class UpsertManyExamToClinicDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { data: { required: true, type: () => [require("./exam-to-clinic.dto").UpsertExamToClinicDto] }, companyId: { required: true, type: () => String } };
    }
}
exports.UpsertManyExamToClinicDto = UpsertManyExamToClinicDto;
class CopyExamsToClinicDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { fromCompanyId: { required: true, type: () => String }, companyId: { required: true, type: () => String }, overwrite: { required: false, type: () => Boolean } };
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CopyExamsToClinicDto.prototype, "fromCompanyId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CopyExamsToClinicDto.prototype, "companyId", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CopyExamsToClinicDto.prototype, "overwrite", void 0);
exports.CopyExamsToClinicDto = CopyExamsToClinicDto;
class FindExamToClinicDto extends pagination_dto_1.PaginationQueryDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: false, type: () => String }, search: { required: false, type: () => String }, companyId: { required: false, type: () => String }, examId: { required: false, type: () => Number }, endDate: { required: true, type: () => Date, nullable: true }, orderBy: { required: false, type: () => String }, groupId: { required: false, type: () => String }, orderByDirection: { required: false, type: () => Object } };
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FindExamToClinicDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FindExamToClinicDto.prototype, "search", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FindExamToClinicDto.prototype, "companyId", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], FindExamToClinicDto.prototype, "examId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(date_format_1.DateFormat, { toClassOnly: true }),
    (0, class_validator_1.IsDate)({ message: 'Data de início inválida' }),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], FindExamToClinicDto.prototype, "endDate", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FindExamToClinicDto.prototype, "orderBy", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FindExamToClinicDto.prototype, "groupId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FindExamToClinicDto.prototype, "orderByDirection", void 0);
exports.FindExamToClinicDto = FindExamToClinicDto;
//# sourceMappingURL=exam-to-clinic.dto.js.map