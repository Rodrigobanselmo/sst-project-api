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
exports.ExamsRiskDataDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class ExamsRiskDataDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { examId: { required: false, type: () => Number }, riskFactorDataId: { required: false, type: () => String }, isMale: { required: false, type: () => Boolean }, isFemale: { required: true, type: () => Boolean }, isPeriodic: { required: true, type: () => Boolean }, isChange: { required: true, type: () => Boolean }, isAdmission: { required: true, type: () => Boolean }, isReturn: { required: true, type: () => Boolean }, isDismissal: { required: true, type: () => Boolean }, validityInMonths: { required: true, type: () => Number }, lowValidityInMonths: { required: true, type: () => Number }, considerBetweenDays: { required: true, type: () => Number }, fromAge: { required: true, type: () => Number }, toAge: { required: true, type: () => Number } };
    }
}
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], ExamsRiskDataDto.prototype, "examId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ExamsRiskDataDto.prototype, "riskFactorDataId", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], ExamsRiskDataDto.prototype, "isMale", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], ExamsRiskDataDto.prototype, "isFemale", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], ExamsRiskDataDto.prototype, "isPeriodic", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], ExamsRiskDataDto.prototype, "isChange", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], ExamsRiskDataDto.prototype, "isAdmission", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], ExamsRiskDataDto.prototype, "isReturn", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], ExamsRiskDataDto.prototype, "isDismissal", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => o.validityInMonths !== null),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], ExamsRiskDataDto.prototype, "validityInMonths", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => o.lowValidityInMonths !== null),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], ExamsRiskDataDto.prototype, "lowValidityInMonths", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => o.considerBetweenDays !== null),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], ExamsRiskDataDto.prototype, "considerBetweenDays", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => o.fromAge !== null),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], ExamsRiskDataDto.prototype, "fromAge", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => o.toAge !== null),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], ExamsRiskDataDto.prototype, "toAge", void 0);
exports.ExamsRiskDataDto = ExamsRiskDataDto;
//# sourceMappingURL=exams-risk-data.dto.js.map