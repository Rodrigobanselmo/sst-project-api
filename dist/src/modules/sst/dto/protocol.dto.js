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
exports.FindProtocolDto = exports.UpdateProtocolRiskDto = exports.UpdateProtocolDto = exports.CreateProtocolDto = void 0;
const openapi = require("@nestjs/swagger");
const keysOfEnum_utils_1 = require("./../../../shared/utils/keysOfEnum.utils");
const string_uppercase_transform_1 = require("./../../../shared/transformers/string-uppercase.transform");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const pagination_dto_1 = require("./../../../shared/dto/pagination.dto");
const query_array_1 = require("./../../../shared/transformers/query-array");
const client_1 = require("@prisma/client");
class CreateProtocolDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String }, companyId: { required: false, type: () => String }, status: { required: false, type: () => Object }, system: { required: false, type: () => Boolean } };
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProtocolDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateProtocolDto.prototype, "companyId", void 0);
__decorate([
    (0, class_transformer_1.Transform)(string_uppercase_transform_1.StringUppercaseTransform, { toClassOnly: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.StatusEnum, {
        message: `status must be one of: ${(0, keysOfEnum_utils_1.KeysOfEnum)(client_1.StatusEnum)}`,
    }),
    __metadata("design:type", String)
], CreateProtocolDto.prototype, "status", void 0);
exports.CreateProtocolDto = CreateProtocolDto;
class UpdateProtocolDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: false, type: () => Number }, name: { required: false, type: () => String }, companyId: { required: true, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateProtocolDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateProtocolDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProtocolDto.prototype, "companyId", void 0);
exports.UpdateProtocolDto = UpdateProtocolDto;
class UpdateProtocolRiskDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { protocolIds: { required: false, type: () => [Number] }, companyId: { required: true, type: () => String }, riskIds: { required: true, type: () => [String] }, minRiskDegree: { required: false, type: () => Number }, minRiskDegreeQuantity: { required: false, type: () => Number } };
    }
}
__decorate([
    (0, class_transformer_1.Transform)(query_array_1.QueryArray, { toClassOnly: true }),
    (0, class_validator_1.IsInt)({ each: true }),
    __metadata("design:type", Array)
], UpdateProtocolRiskDto.prototype, "protocolIds", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProtocolRiskDto.prototype, "companyId", void 0);
__decorate([
    (0, class_transformer_1.Transform)(query_array_1.QueryArray, { toClassOnly: true }),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdateProtocolRiskDto.prototype, "riskIds", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateProtocolRiskDto.prototype, "minRiskDegree", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateProtocolRiskDto.prototype, "minRiskDegreeQuantity", void 0);
exports.UpdateProtocolRiskDto = UpdateProtocolRiskDto;
class FindProtocolDto extends pagination_dto_1.PaginationQueryDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { search: { required: false, type: () => String }, companyId: { required: false, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FindProtocolDto.prototype, "search", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FindProtocolDto.prototype, "companyId", void 0);
exports.FindProtocolDto = FindProtocolDto;
//# sourceMappingURL=protocol.dto.js.map