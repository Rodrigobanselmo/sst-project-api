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
exports.FindProfessionalResponsibleDto = exports.UpdateProfessionalResponsibleDto = exports.CreateProfessionalResponsibleDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const pagination_dto_1 = require("../../../shared/dto/pagination.dto");
const date_format_1 = require("./../../../shared/transformers/date-format");
class CreateProfessionalResponsibleDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { startDate: { required: true, type: () => Date }, companyId: { required: true, type: () => String }, professionalCouncilId: { required: true, type: () => Number }, type: { required: false, type: () => Object } };
    }
}
__decorate([
    (0, class_transformer_1.Transform)(date_format_1.DateFormat, { toClassOnly: true }),
    (0, class_validator_1.IsDate)({ message: 'Data de início inválida' }),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], CreateProfessionalResponsibleDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProfessionalResponsibleDto.prototype, "companyId", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateProfessionalResponsibleDto.prototype, "professionalCouncilId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.ProfessionalRespTypeEnum, {
        message: `Erro ao enviar tipo de profissional`,
    }),
    __metadata("design:type", String)
], CreateProfessionalResponsibleDto.prototype, "type", void 0);
exports.CreateProfessionalResponsibleDto = CreateProfessionalResponsibleDto;
class UpdateProfessionalResponsibleDto extends (0, swagger_1.PartialType)(CreateProfessionalResponsibleDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: false, type: () => Number }, startDate: { required: true, type: () => Date }, companyId: { required: true, type: () => String }, professionalCouncilId: { required: true, type: () => Number } };
    }
}
__decorate([
    (0, class_transformer_1.Transform)(date_format_1.DateFormat, { toClassOnly: true }),
    (0, class_validator_1.IsDate)({ message: 'Data de início inválida' }),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], UpdateProfessionalResponsibleDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProfessionalResponsibleDto.prototype, "companyId", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], UpdateProfessionalResponsibleDto.prototype, "professionalCouncilId", void 0);
exports.UpdateProfessionalResponsibleDto = UpdateProfessionalResponsibleDto;
class FindProfessionalResponsibleDto extends pagination_dto_1.PaginationQueryDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { search: { required: false, type: () => String }, companyId: { required: false, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FindProfessionalResponsibleDto.prototype, "search", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FindProfessionalResponsibleDto.prototype, "companyId", void 0);
exports.FindProfessionalResponsibleDto = FindProfessionalResponsibleDto;
//# sourceMappingURL=professional-responsible.dto.js.map