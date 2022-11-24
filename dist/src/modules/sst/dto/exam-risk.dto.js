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
exports.FindExamRiskDto = exports.UpsertManyExamsRiskDto = exports.CopyExamsRiskDto = exports.UpdateExamRiskDto = exports.CreateExamsRiskDto = void 0;
const openapi = require("@nestjs/swagger");
const pagination_dto_1 = require("../../../shared/dto/pagination.dto");
const date_format_1 = require("../../../shared/transformers/date-format");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class CreateExamsRiskDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { examId: { required: true, type: () => Number }, riskId: { required: true, type: () => String }, companyId: { required: true, type: () => String }, isMale: { required: false, type: () => Boolean }, isFemale: { required: true, type: () => Boolean }, isPeriodic: { required: true, type: () => Boolean }, isChange: { required: true, type: () => Boolean }, isAdmission: { required: true, type: () => Boolean }, isReturn: { required: true, type: () => Boolean }, isDismissal: { required: true, type: () => Boolean }, validityInMonths: { required: true, type: () => Number }, lowValidityInMonths: { required: true, type: () => Number }, considerBetweenDays: { required: true, type: () => Number }, fromAge: { required: true, type: () => Number }, toAge: { required: true, type: () => Number }, minRiskDegree: { required: true, type: () => Number }, minRiskDegreeQuantity: { required: true, type: () => Number }, startDate: { required: true, type: () => Date }, endDate: { required: true, type: () => Date } };
    }
}
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateExamsRiskDto.prototype, "examId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateExamsRiskDto.prototype, "riskId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateExamsRiskDto.prototype, "companyId", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateExamsRiskDto.prototype, "isMale", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateExamsRiskDto.prototype, "isFemale", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateExamsRiskDto.prototype, "isPeriodic", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateExamsRiskDto.prototype, "isChange", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateExamsRiskDto.prototype, "isAdmission", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateExamsRiskDto.prototype, "isReturn", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateExamsRiskDto.prototype, "isDismissal", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => o.validityInMonths !== null),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateExamsRiskDto.prototype, "validityInMonths", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => o.lowValidityInMonths !== null),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateExamsRiskDto.prototype, "lowValidityInMonths", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => o.considerBetweenDays !== null),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateExamsRiskDto.prototype, "considerBetweenDays", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => o.fromAge !== null),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateExamsRiskDto.prototype, "fromAge", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateExamsRiskDto.prototype, "toAge", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateExamsRiskDto.prototype, "minRiskDegree", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateExamsRiskDto.prototype, "minRiskDegreeQuantity", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(date_format_1.DateFormat, { toClassOnly: true }),
    (0, class_validator_1.IsDate)({ message: 'Data de início inválida' }),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], CreateExamsRiskDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(date_format_1.DateFormat, { toClassOnly: true }),
    (0, class_validator_1.IsDate)({ message: 'Data de fim inválida' }),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], CreateExamsRiskDto.prototype, "endDate", void 0);
exports.CreateExamsRiskDto = CreateExamsRiskDto;
class UpdateExamRiskDto extends (0, swagger_1.PartialType)(CreateExamsRiskDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: false, type: () => Number } };
    }
}
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateExamRiskDto.prototype, "id", void 0);
exports.UpdateExamRiskDto = UpdateExamRiskDto;
class CopyExamsRiskDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { fromCompanyId: { required: true, type: () => String }, companyId: { required: true, type: () => String }, overwrite: { required: false, type: () => Boolean } };
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CopyExamsRiskDto.prototype, "fromCompanyId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CopyExamsRiskDto.prototype, "companyId", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CopyExamsRiskDto.prototype, "overwrite", void 0);
exports.CopyExamsRiskDto = CopyExamsRiskDto;
class UpsertManyExamsRiskDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { data: { required: true, type: () => [require("./exam-risk.dto").UpdateExamRiskDto] }, companyId: { required: true, type: () => String } };
    }
}
exports.UpsertManyExamsRiskDto = UpsertManyExamsRiskDto;
class FindExamRiskDto extends pagination_dto_1.PaginationQueryDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { search: { required: false, type: () => String }, companyId: { required: false, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FindExamRiskDto.prototype, "search", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FindExamRiskDto.prototype, "companyId", void 0);
exports.FindExamRiskDto = FindExamRiskDto;
//# sourceMappingURL=exam-risk.dto.js.map