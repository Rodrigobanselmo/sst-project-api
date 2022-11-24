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
exports.AddressDto = void 0;
const openapi = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const cep_format_transform_1 = require("../../../shared/transformers/cep-format.transform");
const number_format_1 = require("../../../shared/transformers/number-format");
const string_capitalize_1 = require("../../../shared/transformers/string-capitalize");
const string_uppercase_transform_1 = require("../../../shared/transformers/string-uppercase.transform");
class AddressDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { number: { required: true, type: () => String }, cep: { required: true, type: () => String }, street: { required: true, type: () => String }, complement: { required: true, type: () => String }, neighborhood: { required: true, type: () => String }, city: { required: true, type: () => String }, state: { required: true, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.Matches)(/[1-9][0-9]*/, {
        message: 'The number address has an invalid format',
    }),
    (0, class_validator_1.Length)(1, 12),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(number_format_1.NumberFormat, { toClassOnly: true }),
    __metadata("design:type", String)
], AddressDto.prototype, "number", void 0);
__decorate([
    (0, class_transformer_1.Transform)(cep_format_transform_1.CepFormatTransform, { toClassOnly: true }),
    (0, class_validator_1.Length)(8, 8),
    __metadata("design:type", String)
], AddressDto.prototype, "cep", void 0);
__decorate([
    (0, class_transformer_1.Transform)(string_capitalize_1.StringCapitalizeTransform, { toClassOnly: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AddressDto.prototype, "street", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AddressDto.prototype, "complement", void 0);
__decorate([
    (0, class_transformer_1.Transform)(string_capitalize_1.StringCapitalizeTransform, { toClassOnly: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddressDto.prototype, "neighborhood", void 0);
__decorate([
    (0, class_transformer_1.Transform)(string_capitalize_1.StringCapitalizeTransform, { toClassOnly: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddressDto.prototype, "city", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(string_uppercase_transform_1.StringUppercaseTransform, { toClassOnly: true }),
    (0, class_validator_1.IsEnum)(client_1.UfStateEnum, {
        message: `UF inválido`,
        each: true,
    }),
    __metadata("design:type", String)
], AddressDto.prototype, "state", void 0);
exports.AddressDto = AddressDto;
//# sourceMappingURL=address.dto.js.map