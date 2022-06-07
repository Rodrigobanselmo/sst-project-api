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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const public_decorator_1 = require("../../../../shared/decorators/public.decorator");
const user_decorator_1 = require("../../../../shared/decorators/user.decorator");
const user_payload_dto_1 = require("../../../../shared/dto/user-payload.dto");
const create_company_dto_1 = require("../../dto/create-company.dto");
const create_contract_dto_1 = require("../../dto/create-contract.dto");
const update_company_dto_1 = require("../../dto/update-company.dto");
const create_company_service_1 = require("../../services/company/create-company/create-company.service");
const create_contract_service_1 = require("../../services/company/create-contract/create-contract.service");
const find_all_companies_service_1 = require("../../services/company/find-all-companies/find-all-companies.service");
const find_cep_service_1 = require("../../services/company/find-cep/find-cep.service");
const find_cnpj_service_1 = require("../../services/company/find-cnpj/find-cnpj.service");
const find_company_service_1 = require("../../services/company/find-company/find-company.service");
const update_company_service_1 = require("../../services/company/update-company/update-company.service");
let CompanyController = class CompanyController {
    constructor(createCompanyService, createContractService, updateCompanyService, findAllCompaniesService, findCompanyService, findCnpjService, findCepService) {
        this.createCompanyService = createCompanyService;
        this.createContractService = createContractService;
        this.updateCompanyService = updateCompanyService;
        this.findAllCompaniesService = findAllCompaniesService;
        this.findCompanyService = findCompanyService;
        this.findCnpjService = findCnpjService;
        this.findCepService = findCepService;
    }
    findOne(userPayloadDto) {
        return this.findCompanyService.execute(userPayloadDto);
    }
    findAll(userPayloadDto) {
        return this.findAllCompaniesService.execute(userPayloadDto);
    }
    findCNPJ(cnpj) {
        return this.findCnpjService.execute(cnpj);
    }
    findCEP(cep) {
        return this.findCepService.execute(cep);
    }
    create(createCompanyDto) {
        return this.createCompanyService.execute(createCompanyDto);
    }
    createChild(createContractDto) {
        return this.createContractService.execute(createContractDto);
    }
    update(updateCompanyDto) {
        return this.updateCompanyService.execute(updateCompanyDto);
    }
};
__decorate([
    (0, common_1.Get)('/:companyId'),
    openapi.ApiResponse({ status: 200, type: require("../../entities/company.entity").CompanyEntity }),
    __param(0, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_payload_dto_1.UserPayloadDto]),
    __metadata("design:returntype", void 0)
], CompanyController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200, type: [require("../../entities/company.entity").CompanyEntity] }),
    __param(0, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_payload_dto_1.UserPayloadDto]),
    __metadata("design:returntype", void 0)
], CompanyController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('cnpj/:cnpj'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('cnpj')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CompanyController.prototype, "findCNPJ", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('cep/:cep'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('cep')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CompanyController.prototype, "findCEP", null);
__decorate([
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201, type: require("../../entities/company.entity").CompanyEntity }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_company_dto_1.CreateCompanyDto]),
    __metadata("design:returntype", void 0)
], CompanyController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('contract'),
    openapi.ApiResponse({ status: 201, type: require("../../entities/company.entity").CompanyEntity }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_contract_dto_1.CreateContractDto]),
    __metadata("design:returntype", void 0)
], CompanyController.prototype, "createChild", null);
__decorate([
    (0, common_1.Patch)(),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_company_dto_1.UpdateCompanyDto]),
    __metadata("design:returntype", void 0)
], CompanyController.prototype, "update", null);
CompanyController = __decorate([
    (0, swagger_1.ApiTags)('company'),
    (0, common_1.Controller)('company'),
    __metadata("design:paramtypes", [create_company_service_1.CreateCompanyService,
        create_contract_service_1.CreateContractService,
        update_company_service_1.UpdateCompanyService,
        find_all_companies_service_1.FindAllCompaniesService,
        find_company_service_1.FindCompanyService,
        find_cnpj_service_1.FindCnpjService,
        find_cep_service_1.FindCepService])
], CompanyController);
exports.CompanyController = CompanyController;
//# sourceMappingURL=company.controller.js.map