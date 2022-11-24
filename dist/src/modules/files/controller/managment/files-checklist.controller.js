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
exports.FilesChecklistController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const user_decorator_1 = require("../../../../shared/decorators/user.decorator");
const user_payload_dto_1 = require("../../../../shared/dto/user-payload.dto");
const download_risk_data_service_1 = require("../../services/checklist/download-risk-data/download-risk-data.service");
const upload_risk_data_service_1 = require("../../services/checklist/upload-risk-data/upload-risk-data.service");
const upload_epi_data_service_1 = require("../../services/checklist/upload-epi-data/upload-epi-data.service");
const permissions_decorator_1 = require("../../../../shared/decorators/permissions.decorator");
const authorization_1 = require("../../../../shared/constants/enum/authorization");
const roles_decorator_1 = require("../../../../shared/decorators/roles.decorator");
let FilesChecklistController = class FilesChecklistController {
    constructor(uploadEpiDataService, uploadRiskService, downloadRiskService) {
        this.uploadEpiDataService = uploadEpiDataService;
        this.uploadRiskService = uploadRiskService;
        this.downloadRiskService = downloadRiskService;
    }
    async uploadRiskFile(file, userPayloadDto, res) {
        const { workbook, filename } = await this.uploadRiskService.execute(file, userPayloadDto);
        res.attachment(filename);
        workbook.xlsx.write(res).then(function () {
            res.end();
        });
    }
    async downloadRisks(userPayloadDto, res) {
        const { workbook, filename } = await this.downloadRiskService.execute(userPayloadDto);
        res.attachment(filename);
        workbook.xlsx.write(res).then(function () {
            res.end();
        });
    }
    async uploadEpiFile(file, userPayloadDto, res) {
        const { workbook, filename } = await this.uploadEpiDataService.execute(file, userPayloadDto);
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
], FilesChecklistController.prototype, "uploadRiskFile", null);
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
], FilesChecklistController.prototype, "downloadRisks", null);
__decorate([
    (0, roles_decorator_1.Roles)(authorization_1.RoleEnum.DATABASE),
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.COMPANY,
        isContract: true,
        isMember: true,
    }),
    (0, common_1.Post)('epi/upload/:companyId?'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, user_decorator_1.User)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, user_payload_dto_1.UserPayloadDto, Object]),
    __metadata("design:returntype", Promise)
], FilesChecklistController.prototype, "uploadEpiFile", null);
FilesChecklistController = __decorate([
    (0, common_1.Controller)('files/checklist'),
    __metadata("design:paramtypes", [upload_epi_data_service_1.UploadEpiDataService,
        upload_risk_data_service_1.UploadChecklistDataService,
        download_risk_data_service_1.DownloadRiskDataService])
], FilesChecklistController);
exports.FilesChecklistController = FilesChecklistController;
//# sourceMappingURL=files-checklist.controller.js.map