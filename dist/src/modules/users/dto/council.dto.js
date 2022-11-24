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
exports.CouncilDto = void 0;
const openapi = require("@nestjs/swagger");
const string_uppercase_transform_1 = require("./../../../shared/transformers/string-uppercase.transform");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class CouncilDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { councilType: { required: true, type: () => String }, councilUF: { required: false, type: () => String }, councilId: { required: true, type: () => String }, professionalId: { required: false, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CouncilDto.prototype, "councilType", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => o.councilUF != ''),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(string_uppercase_transform_1.StringUppercaseTransform, { toClassOnly: true }),
    (0, class_validator_1.IsEnum)(client_1.UfStateEnum, {
        message: `UF inválido`,
    }),
    __metadata("design:type", String)
], CouncilDto.prototype, "councilUF", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CouncilDto.prototype, "councilId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CouncilDto.prototype, "professionalId", void 0);
exports.CouncilDto = CouncilDto;
//# sourceMappingURL=council.dto.js.map