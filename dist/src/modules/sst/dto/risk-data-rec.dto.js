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
exports.UpsertRiskDataRecDto = exports.CreateRiskDataRecDto = void 0;
const openapi = require("@nestjs/swagger");
const date_format_1 = require("../../../shared/transformers/date-format");
const client_1 = require("@prisma/client");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const string_uppercase_transform_1 = require("../../../shared/transformers/string-uppercase.transform");
const keysOfEnum_utils_1 = require("../../../shared/utils/keysOfEnum.utils");
class CreateRiskDataRecDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { text: { required: true, type: () => String }, type: { required: true, type: () => Object }, textType: { required: true, type: () => Object } };
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRiskDataRecDto.prototype, "text", void 0);
__decorate([
    (0, class_transformer_1.Transform)(string_uppercase_transform_1.StringUppercaseTransform, { toClassOnly: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEnum)(client_1.RiskRecTypeEnum, {
        message: `type must be one of: ${(0, keysOfEnum_utils_1.KeysOfEnum)(client_1.RiskRecTypeEnum)}`,
    }),
    __metadata("design:type", String)
], CreateRiskDataRecDto.prototype, "type", void 0);
__decorate([
    (0, class_transformer_1.Transform)(string_uppercase_transform_1.StringUppercaseTransform, { toClassOnly: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEnum)(client_1.RiskRecTextTypeEnum, {
        message: `type must be one of: ${(0, keysOfEnum_utils_1.KeysOfEnum)(client_1.RiskRecTextTypeEnum)}`,
    }),
    __metadata("design:type", String)
], CreateRiskDataRecDto.prototype, "textType", void 0);
exports.CreateRiskDataRecDto = CreateRiskDataRecDto;
class UpsertRiskDataRecDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: false, type: () => String }, responsibleName: { required: false, type: () => String }, endDate: { required: false, type: () => Date }, status: { required: false, type: () => Object }, riskFactorDataId: { required: true, type: () => String }, recMedId: { required: true, type: () => String }, companyId: { required: true, type: () => String }, comment: { required: false, type: () => require("./risk-data-rec.dto").CreateRiskDataRecDto } };
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpsertRiskDataRecDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpsertRiskDataRecDto.prototype, "responsibleName", void 0);
__decorate([
    (0, class_transformer_1.Transform)(date_format_1.DateFormat, { toClassOnly: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], UpsertRiskDataRecDto.prototype, "endDate", void 0);
__decorate([
    (0, class_transformer_1.Transform)(string_uppercase_transform_1.StringUppercaseTransform, { toClassOnly: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEnum)(client_1.StatusEnum, {
        message: `type must be one of: ${(0, keysOfEnum_utils_1.KeysOfEnum)(client_1.StatusEnum)}`,
    }),
    __metadata("design:type", String)
], UpsertRiskDataRecDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpsertRiskDataRecDto.prototype, "riskFactorDataId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpsertRiskDataRecDto.prototype, "recMedId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpsertRiskDataRecDto.prototype, "companyId", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => CreateRiskDataRecDto),
    __metadata("design:type", CreateRiskDataRecDto)
], UpsertRiskDataRecDto.prototype, "comment", void 0);
exports.UpsertRiskDataRecDto = UpsertRiskDataRecDto;
//# sourceMappingURL=risk-data-rec.dto.js.map