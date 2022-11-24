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
exports.CreateContractService = void 0;
const common_1 = require("@nestjs/common");
const CompanyRepository_1 = require("../../../repositories/implementations/CompanyRepository");
const LicenseRepository_1 = require("../../../repositories/implementations/LicenseRepository");
let CreateContractService = class CreateContractService {
    constructor(companyRepository, licenseRepository) {
        this.companyRepository = companyRepository;
        this.licenseRepository = licenseRepository;
    }
    async execute(createContractDto, user) {
        if ('isConsulting' in createContractDto)
            delete createContractDto.isConsulting;
        const license = await this.licenseRepository.findByCompanyId(user.companyId);
        if (!(license === null || license === void 0 ? void 0 : license.id))
            throw new common_1.BadRequestException('license not found');
        const company = await this.companyRepository.create(Object.assign(Object.assign({}, createContractDto), { companyId: user.companyId, license }));
        return company;
    }
};
CreateContractService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [CompanyRepository_1.CompanyRepository, LicenseRepository_1.LicenseRepository])
], CreateContractService);
exports.CreateContractService = CreateContractService;
//# sourceMappingURL=create-contract.service.js.map