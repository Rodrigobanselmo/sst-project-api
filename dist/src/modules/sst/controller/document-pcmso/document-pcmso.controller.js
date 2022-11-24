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
exports.DocumentPCMSOController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const authorization_1 = require("../../../../shared/constants/enum/authorization");
const permissions_decorator_1 = require("../../../../shared/decorators/permissions.decorator");
const user_decorator_1 = require("../../../../shared/decorators/user.decorator");
const user_payload_dto_1 = require("../../../../shared/dto/user-payload.dto");
const document_pcmso_dto_1 = require("../../dto/document-pcmso.dto");
const find_by_id_service_1 = require("../../services/documentPcmso/find-by-id/find-by-id.service");
const upsert_document_pcmso_service_1 = require("../../services/documentPcmso/upsert-document-pcmso/upsert-document-pcmso.service");
let DocumentPCMSOController = class DocumentPCMSOController {
    constructor(upsertDocumentPCMSOService, findByIdService) {
        this.upsertDocumentPCMSOService = upsertDocumentPCMSOService;
        this.findByIdService = findByIdService;
    }
    upsert(dto) {
        return this.upsertDocumentPCMSOService.execute(dto);
    }
    findById(userPayloadDto) {
        const companyId = userPayloadDto.targetCompanyId;
        return this.findByIdService.execute(companyId);
    }
};
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.COMPANY,
        isContract: true,
        isMember: true,
        crud: 'cu',
    }),
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201, type: require("../../entities/documentPCMSO.entity").DocumentPCMSOEntity }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [document_pcmso_dto_1.UpsertDocumentPCMSODto]),
    __metadata("design:returntype", void 0)
], DocumentPCMSOController.prototype, "upsert", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.COMPANY,
        isContract: true,
        isMember: true,
    }),
    (0, common_1.Get)('/:companyId'),
    openapi.ApiResponse({ status: 200, type: require("../../entities/documentPCMSO.entity").DocumentPCMSOEntity }),
    __param(0, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_payload_dto_1.UserPayloadDto]),
    __metadata("design:returntype", void 0)
], DocumentPCMSOController.prototype, "findById", null);
DocumentPCMSOController = __decorate([
    (0, common_1.Controller)('document-pcmso'),
    __metadata("design:paramtypes", [upsert_document_pcmso_service_1.UpsertDocumentPCMSOService, find_by_id_service_1.FindByIdDocumentPCMSOService])
], DocumentPCMSOController);
exports.DocumentPCMSOController = DocumentPCMSOController;
//# sourceMappingURL=document-pcmso.controller.js.map