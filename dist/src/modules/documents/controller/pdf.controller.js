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
exports.DocumentsPdfController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const user_decorator_1 = require("../../../shared/decorators/user.decorator");
const user_payload_dto_1 = require("../../../shared/dto/user-payload.dto");
const guide_data_service_1 = require("../services/pdf/guide/guide-data.service");
const authorization_1 = require("../../../shared/constants/enum/authorization");
const permissions_decorator_1 = require("../../../shared/decorators/permissions.decorator");
const kit_data_service_1 = require("../services/pdf/kit/kit-data.service");
const prontuario_data_service_1 = require("../services/pdf/prontuario/prontuario-data.service");
const aso_data_service_1 = require("../services/pdf/aso/aso-data.service");
let DocumentsPdfController = class DocumentsPdfController {
    constructor(pdfGuideDataService, pdfKitDataService, pdfAsoDataService, pdfProntuarioDataService) {
        this.pdfGuideDataService = pdfGuideDataService;
        this.pdfKitDataService = pdfKitDataService;
        this.pdfAsoDataService = pdfAsoDataService;
        this.pdfProntuarioDataService = pdfProntuarioDataService;
    }
    async guide(userPayloadDto, employeeId) {
        return this.pdfGuideDataService.execute(employeeId, userPayloadDto);
    }
    async aso(userPayloadDto, employeeId, asoId) {
        return this.pdfAsoDataService.execute(employeeId, userPayloadDto, asoId ? Number(asoId) : asoId);
    }
    async prontuario(userPayloadDto, employeeId) {
        return this.pdfProntuarioDataService.execute(employeeId, userPayloadDto);
    }
    async kit(userPayloadDto, employeeId, asoId) {
        return this.pdfKitDataService.execute(employeeId, userPayloadDto, asoId ? Number(asoId) : asoId);
    }
};
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.EMPLOYEE_HISTORY,
        isMember: true,
        isContract: true,
    }, {
        code: authorization_1.PermissionEnum.COMPANY_SCHEDULE,
        isMember: true,
        isContract: true,
    }),
    (0, common_1.Get)('guide/:employeeId/:companyId'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Param)('employeeId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_payload_dto_1.UserPayloadDto, Number]),
    __metadata("design:returntype", Promise)
], DocumentsPdfController.prototype, "guide", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.EMPLOYEE_HISTORY,
        isMember: true,
        isContract: true,
    }, {
        code: authorization_1.PermissionEnum.COMPANY_SCHEDULE,
        isMember: true,
        isContract: true,
    }),
    (0, common_1.Get)('aso/:employeeId/:companyId/:asoId?'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Param)('employeeId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Param)('asoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_payload_dto_1.UserPayloadDto, Number, Number]),
    __metadata("design:returntype", Promise)
], DocumentsPdfController.prototype, "aso", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.EMPLOYEE_HISTORY,
        isMember: true,
        isContract: true,
    }, {
        code: authorization_1.PermissionEnum.COMPANY_SCHEDULE,
        isMember: true,
        isContract: true,
    }),
    (0, common_1.Get)('prontuario/:employeeId/:companyId'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Param)('employeeId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_payload_dto_1.UserPayloadDto, Number]),
    __metadata("design:returntype", Promise)
], DocumentsPdfController.prototype, "prontuario", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.EMPLOYEE_HISTORY,
        isMember: true,
        isContract: true,
    }, {
        code: authorization_1.PermissionEnum.COMPANY_SCHEDULE,
        isMember: true,
        isContract: true,
    }),
    (0, common_1.Get)('kit/:employeeId/:companyId/:asoId?'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Param)('employeeId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Param)('asoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_payload_dto_1.UserPayloadDto, Number, Number]),
    __metadata("design:returntype", Promise)
], DocumentsPdfController.prototype, "kit", null);
DocumentsPdfController = __decorate([
    (0, common_1.Controller)('documents/pdf'),
    __metadata("design:paramtypes", [guide_data_service_1.PdfGuideDataService,
        kit_data_service_1.PdfKitDataService,
        aso_data_service_1.PdfAsoDataService,
        prontuario_data_service_1.PdfProntuarioDataService])
], DocumentsPdfController);
exports.DocumentsPdfController = DocumentsPdfController;
//# sourceMappingURL=pdf.controller.js.map