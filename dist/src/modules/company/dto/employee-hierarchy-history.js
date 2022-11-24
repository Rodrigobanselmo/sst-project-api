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
exports.FindEmployeeHierarchyHistoryDto = exports.UpdateEmployeeHierarchyHistoryDto = exports.CreateEmployeeHierarchyHistoryDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const pagination_dto_1 = require("./../../../shared/dto/pagination.dto");
const date_format_1 = require("./../../../shared/transformers/date-format");
const string_uppercase_transform_1 = require("./../../../shared/transformers/string-uppercase.transform");
class CreateEmployeeHierarchyHistoryDto {
}
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateEmployeeHierarchyHistoryDto.prototype, "employeeId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateEmployeeHierarchyHistoryDto.prototype, "hierarchyId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateEmployeeHierarchyHistoryDto.prototype, "subOfficeId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(date_format_1.DateFormat, { toClassOnly: true }),
    (0, class_validator_1.IsDate)({ message: 'Data de realização de exame inválida' }),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], CreateEmployeeHierarchyHistoryDto.prototype, "startDate", void 0);
__decorate([
    (0, class_transformer_1.Transform)(string_uppercase_transform_1.StringUppercaseTransform, { toClassOnly: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEnum)(client_1.EmployeeHierarchyMotiveTypeEnum, {
        message: `tipo de motivo inválido`,
    }),
    __metadata("design:type", String)
], CreateEmployeeHierarchyHistoryDto.prototype, "motive", void 0);
exports.CreateEmployeeHierarchyHistoryDto = CreateEmployeeHierarchyHistoryDto;
class UpdateEmployeeHierarchyHistoryDto extends (0, swagger_1.PartialType)(CreateEmployeeHierarchyHistoryDto) {
}
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateEmployeeHierarchyHistoryDto.prototype, "id", void 0);
exports.UpdateEmployeeHierarchyHistoryDto = UpdateEmployeeHierarchyHistoryDto;
class FindEmployeeHierarchyHistoryDto extends pagination_dto_1.PaginationQueryDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FindEmployeeHierarchyHistoryDto.prototype, "companyId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FindEmployeeHierarchyHistoryDto.prototype, "hierarchyId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], FindEmployeeHierarchyHistoryDto.prototype, "employeeId", void 0);
exports.FindEmployeeHierarchyHistoryDto = FindEmployeeHierarchyHistoryDto;
//# sourceMappingURL=employee-hierarchy-history.js.map