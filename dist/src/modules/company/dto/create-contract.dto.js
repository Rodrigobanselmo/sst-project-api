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
exports.CreateContractDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_validator_2 = require("class-validator");
const create_company_dto_1 = require("./create-company.dto");
class CreateContractDto extends create_company_dto_1.CreateCompanyDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { license: { required: false }, companyId: { required: true, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsEmpty)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", void 0)
], CreateContractDto.prototype, "license", void 0);
__decorate([
    (0, class_validator_2.IsString)(),
    __metadata("design:type", String)
], CreateContractDto.prototype, "companyId", void 0);
exports.CreateContractDto = CreateContractDto;
//# sourceMappingURL=create-contract.dto.js.map