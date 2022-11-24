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
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const user_decorator_1 = require("../../../../shared/decorators/user.decorator");
const user_payload_dto_1 = require("../../../../shared/dto/user-payload.dto");
const activity_dto_1 = require("../../dto/activity.dto");
const company_clinic_dto_1 = require("../../dto/company-clinic.dto");
const create_company_dto_1 = require("../../dto/create-company.dto");
const update_company_dto_1 = require("../../dto/update-company.dto");
const add_company_photo_service_1 = require("../../services/company/add-company-photo/add-company-photo.service");
const copy_company_service_1 = require("../../services/company/copy-company/copy-company.service");
const create_company_service_1 = require("../../services/company/create-company/create-company.service");
const create_contract_service_1 = require("../../services/company/create-contract/create-contract.service");
const find_all_companies_service_1 = require("../../services/company/find-all-companies/find-all-companies.service");
const find_all_companies_service_2 = require("../../services/company/find-all-user-companies /find-all-companies.service");
const find_cep_service_1 = require("../../services/company/find-cep/find-cep.service");
const find_clinic_service_1 = require("../../services/company/find-clinic/find-clinic.service");
const find_cnae_service_1 = require("../../services/company/find-cnae/find-cnae.service");
const find_cnpj_service_1 = require("../../services/company/find-cnpj/find-cnpj.service");
const find_company_service_1 = require("../../services/company/find-company/find-company.service");
const set_company_clinics_service_1 = require("../../services/company/set-company-clinics/set-company-clinics.service");
const update_company_service_1 = require("../../services/company/update-company/update-company.service");
const permissions_decorator_1 = require("../../../../shared/decorators/permissions.decorator");
const authorization_1 = require("../../../../shared/constants/enum/authorization");
const roles_decorator_1 = require("../../../../shared/decorators/roles.decorator");
const update_all_companies_service_1 = require("../../services/report/update-all-companies/update-all-companies.service");
const dashboard_dto_1 = require("../../dto/dashboard.dto");
const dashboard_company_service_1 = require("../../services/report/dashboard-company/dashboard-company.service");
let CompanyController = class CompanyController {
    constructor(createCompanyService, createContractService, addCompanyPhotoService, updateCompanyService, findAllCompaniesService, findAllUserCompaniesService, findCompanyService, findCnpjService, findCepService, findCnaeService, copyCompanyService, setCompanyClinicsService, findClinicService, dashboardCompanyService, updateAllCompaniesService) {
        this.createCompanyService = createCompanyService;
        this.createContractService = createContractService;
        this.addCompanyPhotoService = addCompanyPhotoService;
        this.updateCompanyService = updateCompanyService;
        this.findAllCompaniesService = findAllCompaniesService;
        this.findAllUserCompaniesService = findAllUserCompaniesService;
        this.findCompanyService = findCompanyService;
        this.findCnpjService = findCnpjService;
        this.findCepService = findCepService;
        this.findCnaeService = findCnaeService;
        this.copyCompanyService = copyCompanyService;
        this.setCompanyClinicsService = setCompanyClinicsService;
        this.findClinicService = findClinicService;
        this.dashboardCompanyService = dashboardCompanyService;
        this.updateAllCompaniesService = updateAllCompaniesService;
    }
    dashboard(userPayloadDto, query) {
        return this.dashboardCompanyService.execute(query, userPayloadDto);
    }
    findAll(userPayloadDto, query) {
        return this.findAllCompaniesService.execute(userPayloadDto, query);
    }
    findAllByUser(userPayloadDto, query) {
        return this.findAllUserCompaniesService.execute(userPayloadDto, query);
    }
    findCNAE(query) {
        return this.findCnaeService.execute(query);
    }
    findOne(userPayloadDto) {
        return this.findCompanyService.execute(userPayloadDto);
    }
    findClinicOne(clinicId, userPayloadDto) {
        return this.findClinicService.execute(clinicId, userPayloadDto);
    }
    findCNPJ(cnpj) {
        return this.findCnpjService.execute(cnpj);
    }
    findCEP(cep) {
        return this.findCepService.execute(cep);
    }
    create(createCompanyDto, userPayloadDto) {
        if (userPayloadDto.isMaster) {
            return this.createCompanyService.execute(createCompanyDto);
        }
        return this.createContractService.execute(createCompanyDto, userPayloadDto);
    }
    createClinic(createCompanyDto, userPayloadDto) {
        if (!createCompanyDto.isClinic)
            throw new common_1.BadRequestException('Erro ao criar clínica');
        return this.createContractService.execute(createCompanyDto, userPayloadDto);
    }
    async uploadRiskFile(file, userPayloadDto) {
        return this.addCompanyPhotoService.execute(userPayloadDto, file);
    }
    update(updateCompanyDto) {
        return this.updateCompanyService.execute(updateCompanyDto);
    }
    copy(copyFromCompanyId, riskGroupId, userPayloadDto) {
        return this.copyCompanyService.execute(copyFromCompanyId, riskGroupId, userPayloadDto);
    }
    setClinics(setCompanyClinicDto, userPayloadDto) {
        return this.setCompanyClinicsService.execute(setCompanyClinicDto, userPayloadDto);
    }
};
__decorate([
    (0, roles_decorator_1.Roles)(authorization_1.RoleEnum.COMPANY, authorization_1.RoleEnum.CONTRACTS, authorization_1.RoleEnum.CLINICS, authorization_1.RoleEnum.USER),
    (0, permissions_decorator_1.Permissions)({ isContract: true, isMember: true }),
    (0, common_1.Get)('/:companyId/dashboard'),
    openapi.ApiResponse({ status: 200, type: require("../../entities/report.entity").CompanyReportEntity }),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_payload_dto_1.UserPayloadDto, dashboard_dto_1.FindCompanyDashDto]),
    __metadata("design:returntype", void 0)
], CompanyController.prototype, "dashboard", null);
__decorate([
    (0, roles_decorator_1.Roles)(authorization_1.RoleEnum.COMPANY, authorization_1.RoleEnum.CONTRACTS, authorization_1.RoleEnum.CLINICS, authorization_1.RoleEnum.USER),
    (0, permissions_decorator_1.Permissions)({ isContract: true, isMember: true }),
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_payload_dto_1.UserPayloadDto, create_company_dto_1.FindCompaniesDto]),
    __metadata("design:returntype", void 0)
], CompanyController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('by-user'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_payload_dto_1.UserPayloadDto, create_company_dto_1.FindCompaniesDto]),
    __metadata("design:returntype", void 0)
], CompanyController.prototype, "findAllByUser", null);
__decorate([
    (0, common_1.Get)('/cnae'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [activity_dto_1.FindActivityDto]),
    __metadata("design:returntype", void 0)
], CompanyController.prototype, "findCNAE", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.COMPANY,
        isContract: true,
        isMember: true,
    }, {
        code: authorization_1.PermissionEnum.CLINIC,
        isContract: true,
        isMember: true,
    }),
    (0, common_1.Get)('/:companyId'),
    openapi.ApiResponse({ status: 200, type: require("../../entities/company.entity").CompanyEntity }),
    __param(0, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_payload_dto_1.UserPayloadDto]),
    __metadata("design:returntype", void 0)
], CompanyController.prototype, "findOne", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.COMPANY,
        isContract: true,
        isMember: true,
    }, {
        code: authorization_1.PermissionEnum.CLINIC,
        isContract: true,
        isMember: true,
    }),
    (0, common_1.Get)('/clinic/:clinicId'),
    openapi.ApiResponse({ status: 200, type: require("../../entities/company.entity").CompanyEntity }),
    __param(0, (0, common_1.Param)('clinicId')),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_payload_dto_1.UserPayloadDto]),
    __metadata("design:returntype", void 0)
], CompanyController.prototype, "findClinicOne", null);
__decorate([
    (0, common_1.Get)('cnpj/:cnpj'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('cnpj')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CompanyController.prototype, "findCNPJ", null);
__decorate([
    (0, common_1.Get)('cep/:cep'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('cep')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CompanyController.prototype, "findCEP", null);
__decorate([
    (0, roles_decorator_1.Roles)(authorization_1.RoleEnum.CONTRACTS),
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.CONTRACTS,
        isContract: true,
        isMember: true,
        crud: true,
    }),
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201, type: require("../../entities/company.entity").CompanyEntity }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_company_dto_1.CreateCompanyDto, user_payload_dto_1.UserPayloadDto]),
    __metadata("design:returntype", void 0)
], CompanyController.prototype, "create", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.CLINIC,
        isContract: true,
        isMember: true,
        crud: true,
    }),
    (0, common_1.Post)('clinic'),
    openapi.ApiResponse({ status: 201, type: require("../../entities/company.entity").CompanyEntity }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_company_dto_1.CreateCompanyDto, user_payload_dto_1.UserPayloadDto]),
    __metadata("design:returntype", void 0)
], CompanyController.prototype, "createClinic", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.COMPANY,
        isContract: true,
        isMember: true,
        crud: true,
    }),
    (0, common_1.Post)('/:companyId/photo'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, user_payload_dto_1.UserPayloadDto]),
    __metadata("design:returntype", Promise)
], CompanyController.prototype, "uploadRiskFile", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.COMPANY,
        isContract: true,
        isMember: true,
        crud: true,
    }),
    (0, common_1.Patch)(),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_company_dto_1.UpdateCompanyDto]),
    __metadata("design:returntype", void 0)
], CompanyController.prototype, "update", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.COMPANY,
        isContract: true,
        isMember: true,
        crud: true,
    }),
    (0, common_1.Post)('/copy/:copyFromCompanyId/:riskGroupId/:companyId'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('copyFromCompanyId')),
    __param(1, (0, common_1.Param)('riskGroupId')),
    __param(2, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, user_payload_dto_1.UserPayloadDto]),
    __metadata("design:returntype", void 0)
], CompanyController.prototype, "copy", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.COMPANY,
        isContract: true,
        isMember: true,
        crud: true,
    }),
    (0, common_1.Post)('/:companyId/set-clinics'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [company_clinic_dto_1.SetCompanyClinicDto, user_payload_dto_1.UserPayloadDto]),
    __metadata("design:returntype", void 0)
], CompanyController.prototype, "setClinics", null);
CompanyController = __decorate([
    (0, swagger_1.ApiTags)('company'),
    (0, common_1.Controller)('company'),
    __metadata("design:paramtypes", [create_company_service_1.CreateCompanyService,
        create_contract_service_1.CreateContractService,
        add_company_photo_service_1.AddCompanyPhotoService,
        update_company_service_1.UpdateCompanyService,
        find_all_companies_service_1.FindAllCompaniesService,
        find_all_companies_service_2.FindAllUserCompaniesService,
        find_company_service_1.FindCompanyService,
        find_cnpj_service_1.FindCnpjService,
        find_cep_service_1.FindCepService,
        find_cnae_service_1.FindCnaeService,
        copy_company_service_1.CopyCompanyService,
        set_company_clinics_service_1.SetCompanyClinicsService,
        find_clinic_service_1.FindClinicService,
        dashboard_company_service_1.DashboardCompanyService,
        update_all_companies_service_1.UpdateAllCompaniesService])
], CompanyController);
exports.CompanyController = CompanyController;
//# sourceMappingURL=company.controller.js.map