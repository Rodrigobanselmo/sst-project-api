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
exports.FindCompanyClinicDto = exports.SetCompanyClinicDto = exports.UpdateCompanyClinicDto = exports.CreateCompanyClinicDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const pagination_dto_1 = require("../../../shared/dto/pagination.dto");
const query_array_1 = require("../../../shared/transformers/query-array");
class CreateCompanyClinicDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { companyId: { required: true, type: () => String }, clinicId: { required: true, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCompanyClinicDto.prototype, "companyId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCompanyClinicDto.prototype, "clinicId", void 0);
exports.CreateCompanyClinicDto = CreateCompanyClinicDto;
class UpdateCompanyClinicDto extends (0, swagger_1.PartialType)(CreateCompanyClinicDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateCompanyClinicDto = UpdateCompanyClinicDto;
class SetCompanyClinicDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { ids: { required: false, type: () => [require("./company-clinic.dto").CreateCompanyClinicDto] } };
    }
}
__decorate([
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_validator_1.IsDefined)(),
    (0, class_transformer_1.Type)(() => CreateCompanyClinicDto),
    __metadata("design:type", Array)
], SetCompanyClinicDto.prototype, "ids", void 0);
exports.SetCompanyClinicDto = SetCompanyClinicDto;
class FindCompanyClinicDto extends pagination_dto_1.PaginationQueryDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { search: { required: false, type: () => String }, companyId: { required: false, type: () => String }, clinicId: { required: false, type: () => [String] } };
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FindCompanyClinicDto.prototype, "search", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FindCompanyClinicDto.prototype, "companyId", void 0);
__decorate([
    (0, class_transformer_1.Transform)(query_array_1.QueryArray, { toClassOnly: true }),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], FindCompanyClinicDto.prototype, "clinicId", void 0);
exports.FindCompanyClinicDto = FindCompanyClinicDto;
//# sourceMappingURL=company-clinic.dto.js.map