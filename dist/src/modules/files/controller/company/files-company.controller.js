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
exports.FilesCompanyController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const user_decorator_1 = require("../../../../shared/decorators/user.decorator");
const user_payload_dto_1 = require("../../../../shared/dto/user-payload.dto");
const download_companies_service_1 = require("../../services/company/download-companies/download-companies.service");
const download_employees_service_1 = require("../../services/company/download-employees/download-employees.service");
const download_hierarchies_service_1 = require("../../services/company/download-hierarchies/download-hierarchies.service");
const download_unique_company_service_1 = require("../../services/company/download-unique-company/download-unique-company.service");
const upload_companies_service_1 = require("../../services/company/upload-companies/upload-companies.service");
const upload_employees_service_1 = require("../../services/company/upload-employees/upload-employees.service");
const upload_hierarchies_service_1 = require("../../services/company/upload-hierarchies/upload-hierarchies.service");
const upload_unique_company_service_1 = require("../../services/company/upload-unique-company/upload-unique-company.service");
const permissions_decorator_1 = require("../../../../shared/decorators/permissions.decorator");
const authorization_1 = require("../../../../shared/constants/enum/authorization");
const roles_decorator_1 = require("../../../../shared/decorators/roles.decorator");
let FilesCompanyController = class FilesCompanyController {
    constructor(downloadCompaniesService, uploadCompaniesService, downloadUniqueCompanyService, uploadUniqueCompanyService, uploadEmployeesService, downloadEmployeesService, uploadHierarchiesService, downloadHierarchiesService) {
        this.downloadCompaniesService = downloadCompaniesService;
        this.uploadCompaniesService = uploadCompaniesService;
        this.downloadUniqueCompanyService = downloadUniqueCompanyService;
        this.uploadUniqueCompanyService = uploadUniqueCompanyService;
        this.uploadEmployeesService = uploadEmployeesService;
        this.downloadEmployeesService = downloadEmployeesService;
        this.uploadHierarchiesService = uploadHierarchiesService;
        this.downloadHierarchiesService = downloadHierarchiesService;
    }
    async uploadCompanyFile(file, userPayloadDto, res) {
        const { workbook, filename } = await this.uploadUniqueCompanyService.execute(file, userPayloadDto);
        res.attachment(filename);
        workbook.xlsx.write(res).then(function () {
            res.end();
        });
    }
    async uploadEmployeesFile(file, userPayloadDto, res) {
        const { workbook, filename } = await this.uploadEmployeesService.execute(file, userPayloadDto);
        res.attachment(filename);
        workbook.xlsx.write(res).then(function () {
            res.end();
        });
    }
    async uploadHierarchiesFile(file, userPayloadDto) {
        await this.uploadHierarchiesService.execute(file, userPayloadDto);
        return 'sucesso';
    }
    async uploadFile(file, userPayloadDto, res) {
        const { workbook, filename } = await this.uploadCompaniesService.execute(file, userPayloadDto);
        res.attachment(filename);
        workbook.xlsx.write(res).then(function () {
            res.end();
        });
    }
    async download(userPayloadDto, res) {
        const { workbook, filename } = await this.downloadCompaniesService.execute(userPayloadDto);
        res.attachment(filename);
        workbook.xlsx.write(res).then(function () {
            res.end();
        });
    }
    async downloadUnique(userPayloadDto, res) {
        const { workbook, filename } = await this.downloadUniqueCompanyService.execute(userPayloadDto);
        res.attachment(filename);
        workbook.xlsx.write(res).then(function () {
            res.end();
        });
    }
    async downloadEmployees(userPayloadDto, res) {
        const { workbook, filename } = await this.downloadEmployeesService.execute(userPayloadDto);
        res.attachment(filename);
        workbook.xlsx.write(res).then(function () {
            res.end();
        });
    }
    async downloadHierarchies(userPayloadDto, res) {
        const { workbook, filename } = await this.downloadHierarchiesService.execute(userPayloadDto);
        res.attachment(filename);
        workbook.xlsx.write(res).then(function () {
            res.end();
        });
    }
};
__decorate([
    (0, roles_decorator_1.Roles)(authorization_1.RoleEnum.DATABASE),
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.COMPANY,
        isContract: true,
        isMember: true,
    }),
    (0, common_1.Post)('/upload/unique'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, user_decorator_1.User)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, user_payload_dto_1.UserPayloadDto, Object]),
    __metadata("design:returntype", Promise)
], FilesCompanyController.prototype, "uploadCompanyFile", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.EMPLOYEE,
        isContract: true,
        isMember: true,
    }),
    (0, common_1.Post)('employees/upload/:companyId?'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, user_decorator_1.User)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, user_payload_dto_1.UserPayloadDto, Object]),
    __metadata("design:returntype", Promise)
], FilesCompanyController.prototype, "uploadEmployeesFile", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.EMPLOYEE,
        isContract: true,
        isMember: true,
        crud: true,
    }),
    (0, common_1.Post)('hierarchies/upload/:companyId?'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    openapi.ApiResponse({ status: 201, type: String }),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, user_payload_dto_1.UserPayloadDto]),
    __metadata("design:returntype", Promise)
], FilesCompanyController.prototype, "uploadHierarchiesFile", null);
__decorate([
    (0, roles_decorator_1.Roles)(authorization_1.RoleEnum.DATABASE),
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.COMPANY,
        isContract: true,
        isMember: true,
        crud: true,
    }),
    (0, common_1.Post)('/upload/:companyId?'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, user_decorator_1.User)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, user_payload_dto_1.UserPayloadDto, Object]),
    __metadata("design:returntype", Promise)
], FilesCompanyController.prototype, "uploadFile", null);
__decorate([
    (0, roles_decorator_1.Roles)(authorization_1.RoleEnum.DATABASE),
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.COMPANY,
        isContract: true,
        isMember: true,
    }),
    (0, common_1.Get)('/download/:companyId?'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_payload_dto_1.UserPayloadDto, Object]),
    __metadata("design:returntype", Promise)
], FilesCompanyController.prototype, "download", null);
__decorate([
    (0, roles_decorator_1.Roles)(authorization_1.RoleEnum.DATABASE),
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.COMPANY,
        isContract: true,
        isMember: true,
    }),
    (0, common_1.Get)('/download/unique/:companyId?'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_payload_dto_1.UserPayloadDto, Object]),
    __metadata("design:returntype", Promise)
], FilesCompanyController.prototype, "downloadUnique", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.EMPLOYEE,
        isContract: true,
        isMember: true,
    }),
    (0, common_1.Get)('/employees/download/:companyId?'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_payload_dto_1.UserPayloadDto, Object]),
    __metadata("design:returntype", Promise)
], FilesCompanyController.prototype, "downloadEmployees", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.EMPLOYEE,
        isContract: true,
        isMember: true,
    }),
    (0, common_1.Get)('/hierarchies/download/:companyId?'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_payload_dto_1.UserPayloadDto, Object]),
    __metadata("design:returntype", Promise)
], FilesCompanyController.prototype, "downloadHierarchies", null);
FilesCompanyController = __decorate([
    (0, common_1.Controller)('files/company'),
    __metadata("design:paramtypes", [download_companies_service_1.DownloadCompaniesService,
        upload_companies_service_1.UploadCompaniesService,
        download_unique_company_service_1.DownloadUniqueCompanyService,
        upload_unique_company_service_1.UploadUniqueCompanyService,
        upload_employees_service_1.UploadEmployeesService,
        download_employees_service_1.DownloadEmployeesService,
        upload_hierarchies_service_1.UploadHierarchiesService,
        download_hierarchies_service_1.DownloadHierarchiesService])
], FilesCompanyController);
exports.FilesCompanyController = FilesCompanyController;
//# sourceMappingURL=files-company.controller.js.map