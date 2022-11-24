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
exports.UpsertAddCertDto = exports.AddCertDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class AddCertDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { password: { required: true, type: () => String }, companyId: { required: true, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddCertDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddCertDto.prototype, "companyId", void 0);
exports.AddCertDto = AddCertDto;
class UpsertAddCertDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { certificate: { required: true, type: () => String }, key: { required: true, type: () => String }, notAfter: { required: true, type: () => Date }, notBefore: { required: true, type: () => Date }, companyId: { required: true, type: () => String } };
    }
}
exports.UpsertAddCertDto = UpsertAddCertDto;
//# sourceMappingURL=add-cert.dto.js.map