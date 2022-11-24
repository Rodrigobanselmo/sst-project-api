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
exports.CreateCompanyService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const CompanyRepository_1 = require("../../../repositories/implementations/CompanyRepository");
let CreateCompanyService = class CreateCompanyService {
    constructor(companyRepository) {
        this.companyRepository = companyRepository;
    }
    async execute(createCompanyDto) {
        var _a;
        const statusLicense = (createCompanyDto === null || createCompanyDto === void 0 ? void 0 : createCompanyDto.license) ? (_a = createCompanyDto === null || createCompanyDto === void 0 ? void 0 : createCompanyDto.license) === null || _a === void 0 ? void 0 : _a.status : client_1.StatusEnum.ACTIVE;
        const company = await this.companyRepository.create(Object.assign({ license: {
                status: statusLicense,
            } }, createCompanyDto));
        return company;
    }
};
CreateCompanyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [CompanyRepository_1.CompanyRepository])
], CreateCompanyService);
exports.CreateCompanyService = CreateCompanyService;
//# sourceMappingURL=create-company.service.js.map