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
exports.EpiRoRiskDataDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class EpiRoRiskDataDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { epiId: { required: false, type: () => Number }, riskFactorDataId: { required: false, type: () => String }, lifeTimeInDays: { required: false, type: () => Number }, efficientlyCheck: { required: false, type: () => Boolean }, epcCheck: { required: false, type: () => Boolean }, longPeriodsCheck: { required: false, type: () => Boolean }, validationCheck: { required: false, type: () => Boolean }, tradeSignCheck: { required: false, type: () => Boolean }, sanitationCheck: { required: false, type: () => Boolean }, maintenanceCheck: { required: false, type: () => Boolean }, unstoppedCheck: { required: false, type: () => Boolean }, trainingCheck: { required: false, type: () => Boolean } };
    }
}
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], EpiRoRiskDataDto.prototype, "epiId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], EpiRoRiskDataDto.prototype, "riskFactorDataId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], EpiRoRiskDataDto.prototype, "lifeTimeInDays", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], EpiRoRiskDataDto.prototype, "efficientlyCheck", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], EpiRoRiskDataDto.prototype, "epcCheck", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], EpiRoRiskDataDto.prototype, "longPeriodsCheck", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], EpiRoRiskDataDto.prototype, "validationCheck", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], EpiRoRiskDataDto.prototype, "tradeSignCheck", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], EpiRoRiskDataDto.prototype, "sanitationCheck", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], EpiRoRiskDataDto.prototype, "maintenanceCheck", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], EpiRoRiskDataDto.prototype, "unstoppedCheck", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], EpiRoRiskDataDto.prototype, "trainingCheck", void 0);
exports.EpiRoRiskDataDto = EpiRoRiskDataDto;
//# sourceMappingURL=epi-risk-data.dto.js.map