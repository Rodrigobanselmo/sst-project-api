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
exports.FindCompanyGroupDto = exports.UpsertCompanyGroupDto = void 0;
const openapi = require("@nestjs/swagger");
const pagination_dto_1 = require("../../../shared/dto/pagination.dto");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class UpsertCompanyGroupDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, name: { required: true, type: () => String }, description: { required: true, type: () => String }, companyId: { required: true, type: () => String }, numAsos: { required: false, type: () => Number }, blockResignationExam: { required: false, type: () => Boolean }, esocialStart: { required: false, type: () => Date }, doctorResponsibleId: { required: true, type: () => Number }, tecResponsibleId: { required: false, type: () => Number }, esocialSend: { required: false, type: () => Boolean }, companiesIds: { required: true, type: () => [String] } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpsertCompanyGroupDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => !o.id),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpsertCompanyGroupDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpsertCompanyGroupDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpsertCompanyGroupDto.prototype, "companyId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], UpsertCompanyGroupDto.prototype, "numAsos", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpsertCompanyGroupDto.prototype, "blockResignationExam", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], UpsertCompanyGroupDto.prototype, "esocialStart", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], UpsertCompanyGroupDto.prototype, "doctorResponsibleId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], UpsertCompanyGroupDto.prototype, "tecResponsibleId", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpsertCompanyGroupDto.prototype, "esocialSend", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => !o.id),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpsertCompanyGroupDto.prototype, "companiesIds", void 0);
exports.UpsertCompanyGroupDto = UpsertCompanyGroupDto;
class FindCompanyGroupDto extends pagination_dto_1.PaginationQueryDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, search: { required: true, type: () => [String] }, name: { required: true, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FindCompanyGroupDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], FindCompanyGroupDto.prototype, "search", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FindCompanyGroupDto.prototype, "name", void 0);
exports.FindCompanyGroupDto = FindCompanyGroupDto;
//# sourceMappingURL=company-group.dto.js.map