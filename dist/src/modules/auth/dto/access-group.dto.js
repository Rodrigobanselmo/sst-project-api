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
exports.FindAccessGroupDto = exports.UpsertAccessGroupDto = void 0;
const openapi = require("@nestjs/swagger");
const authorization_1 = require("./../../../shared/constants/enum/authorization");
const pagination_dto_1 = require("./../../../shared/dto/pagination.dto");
const class_validator_1 = require("class-validator");
class UpsertAccessGroupDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, name: { required: true, type: () => String }, description: { required: true, type: () => String }, companyId: { required: true, type: () => String }, permissions: { required: true, type: () => [String] }, roles: { required: false, enum: require("../../../shared/constants/enum/authorization").RoleEnum, isArray: true } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpsertAccessGroupDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpsertAccessGroupDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpsertAccessGroupDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpsertAccessGroupDto.prototype, "companyId", void 0);
__decorate([
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpsertAccessGroupDto.prototype, "permissions", void 0);
__decorate([
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsEnum)(authorization_1.RoleEnum, {
        message: `Acesso enviado inválido. `,
        each: true,
    }),
    __metadata("design:type", Array)
], UpsertAccessGroupDto.prototype, "roles", void 0);
exports.UpsertAccessGroupDto = UpsertAccessGroupDto;
class FindAccessGroupDto extends pagination_dto_1.PaginationQueryDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, search: { required: true, type: () => String }, roles: { required: true, type: () => [String] }, permissions: { required: true, type: () => [String] } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FindAccessGroupDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FindAccessGroupDto.prototype, "search", void 0);
__decorate([
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], FindAccessGroupDto.prototype, "roles", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], FindAccessGroupDto.prototype, "permissions", void 0);
exports.FindAccessGroupDto = FindAccessGroupDto;
//# sourceMappingURL=access-group.dto.js.map