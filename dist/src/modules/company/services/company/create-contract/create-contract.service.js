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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateContractService = void 0;
const LicenseRepository_1 = require("../../../repositories/implementations/LicenseRepository");
const common_1 = require("@nestjs/common");
const CompanyRepository_1 = require("../../../repositories/implementations/CompanyRepository");
let CreateContractService = class CreateContractService {
    constructor(companyRepository, licenseRepository) {
        this.companyRepository = companyRepository;
        this.licenseRepository = licenseRepository;
    }
    async execute(_a) {
        var createContractDto = __rest(_a, []);
        const license = await this.licenseRepository.findByCompanyId(createContractDto.companyId);
        if (!license)
            throw new common_1.BadRequestException('license not found');
        const company = await this.companyRepository.create(Object.assign({}, createContractDto));
        return company;
    }
};
CreateContractService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [CompanyRepository_1.CompanyRepository,
        LicenseRepository_1.LicenseRepository])
], CreateContractService);
exports.CreateContractService = CreateContractService;
//# sourceMappingURL=create-contract.service.js.map