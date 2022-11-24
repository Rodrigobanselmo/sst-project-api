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
exports.FindProtocolToRiskDto = exports.UpsertManyProtocolToRiskDto = exports.CopyProtocolToRiskDto = exports.UpdateProtocolToRiskDto = exports.CreateProtocolToRiskDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const pagination_dto_1 = require("../../../shared/dto/pagination.dto");
class CreateProtocolToRiskDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { protocolId: { required: true, type: () => Number }, riskId: { required: true, type: () => String }, companyId: { required: true, type: () => String }, minRiskDegree: { required: true, type: () => Number }, minRiskDegreeQuantity: { required: true, type: () => Number } };
    }
}
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateProtocolToRiskDto.prototype, "protocolId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProtocolToRiskDto.prototype, "riskId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProtocolToRiskDto.prototype, "companyId", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateProtocolToRiskDto.prototype, "minRiskDegree", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateProtocolToRiskDto.prototype, "minRiskDegreeQuantity", void 0);
exports.CreateProtocolToRiskDto = CreateProtocolToRiskDto;
class UpdateProtocolToRiskDto extends (0, swagger_1.PartialType)(CreateProtocolToRiskDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: false, type: () => Number } };
    }
}
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateProtocolToRiskDto.prototype, "id", void 0);
exports.UpdateProtocolToRiskDto = UpdateProtocolToRiskDto;
class CopyProtocolToRiskDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { fromCompanyId: { required: true, type: () => String }, companyId: { required: true, type: () => String }, overwrite: { required: false, type: () => Boolean } };
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CopyProtocolToRiskDto.prototype, "fromCompanyId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CopyProtocolToRiskDto.prototype, "companyId", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CopyProtocolToRiskDto.prototype, "overwrite", void 0);
exports.CopyProtocolToRiskDto = CopyProtocolToRiskDto;
class UpsertManyProtocolToRiskDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { data: { required: true, type: () => [require("./protocol-to-risk.dto").UpdateProtocolToRiskDto] }, companyId: { required: true, type: () => String } };
    }
}
exports.UpsertManyProtocolToRiskDto = UpsertManyProtocolToRiskDto;
class FindProtocolToRiskDto extends pagination_dto_1.PaginationQueryDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { search: { required: false, type: () => String }, companyId: { required: false, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FindProtocolToRiskDto.prototype, "search", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FindProtocolToRiskDto.prototype, "companyId", void 0);
exports.FindProtocolToRiskDto = FindProtocolToRiskDto;
//# sourceMappingURL=protocol-to-risk.dto.js.map