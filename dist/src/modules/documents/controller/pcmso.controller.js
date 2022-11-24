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
exports.DocumentsPcmsoController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const authorization_1 = require("../../../shared/constants/enum/authorization");
const permissions_decorator_1 = require("../../../shared/decorators/permissions.decorator");
const user_decorator_1 = require("../../../shared/decorators/user.decorator");
const user_payload_dto_1 = require("../../../shared/dto/user-payload.dto");
const pgr_dto_1 = require("../dto/pgr.dto");
const add_queue_doc_service_1 = require("../services/pgr/document/add-queue-doc.service");
const download_attachment_doc_service_1 = require("../services/pgr/document/download-attachment-doc.service");
const download_doc_service_1 = require("../services/pgr/document/download-doc.service");
const upload_pcmso_doc_service_1 = require("../services/pgr/document/upload-pcmso-doc.service");
let DocumentsPcmsoController = class DocumentsPcmsoController {
    constructor(pcmsoDownloadAttachmentsService, pcmsoDownloadDocService, pcmsoUploadDocService, addQueuePCMSODocumentService) {
        this.pcmsoDownloadAttachmentsService = pcmsoDownloadAttachmentsService;
        this.pcmsoDownloadDocService = pcmsoDownloadDocService;
        this.pcmsoUploadDocService = pcmsoUploadDocService;
        this.addQueuePCMSODocumentService = addQueuePCMSODocumentService;
    }
    async downloadAttachment(res, userPayloadDto, docId, attachmentId) {
        const { fileKey, fileStream } = await this.pcmsoDownloadAttachmentsService.execute(userPayloadDto, docId, attachmentId);
        res.setHeader('Content-Disposition', `attachment; filename=${fileKey.split('/')[fileKey.split('/').length - 1]}`);
        fileStream.on('error', function (e) {
            res.status(500).send(e);
        });
        fileStream.pipe(res);
    }
    async downloadPCMSO(res, userPayloadDto, docId) {
        const { fileKey, fileStream } = await this.pcmsoDownloadDocService.execute(userPayloadDto, docId);
        res.setHeader('Content-Disposition', `attachment; filename=${fileKey.split('/')[fileKey.split('/').length - 1]}`);
        fileStream.on('error', function (e) {
            res.status(500).send(e);
        });
        fileStream.pipe(res);
    }
    async uploadPCMSODoc(res, userPayloadDto, upsertPcmsoDto) {
        const { buffer: file, fileName } = await this.pcmsoUploadDocService.execute(Object.assign(Object.assign({}, upsertPcmsoDto), { companyId: userPayloadDto.targetCompanyId }));
        res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
        res.send(file);
    }
    async addQueuePCMSODoc(user, dto) {
        dto.isPCMSO = true;
        return this.addQueuePCMSODocumentService.execute(dto, user);
    }
};
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.PCMSO,
        isMember: true,
        isContract: true,
    }),
    (0, common_1.Get)('/:docId/attachment/:attachmentId/:companyId?'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, user_decorator_1.User)()),
    __param(2, (0, common_1.Param)('docId')),
    __param(3, (0, common_1.Param)('attachmentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, user_payload_dto_1.UserPayloadDto, String, String]),
    __metadata("design:returntype", Promise)
], DocumentsPcmsoController.prototype, "downloadAttachment", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.PCMSO,
        isMember: true,
        isContract: true,
    }),
    (0, common_1.Get)('/:docId/:companyId?'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, user_decorator_1.User)()),
    __param(2, (0, common_1.Param)('docId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, user_payload_dto_1.UserPayloadDto, String]),
    __metadata("design:returntype", Promise)
], DocumentsPcmsoController.prototype, "downloadPCMSO", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.PCMSO,
        isMember: true,
        isContract: true,
        crud: true,
    }),
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, user_decorator_1.User)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, user_payload_dto_1.UserPayloadDto, pgr_dto_1.UpsertPcmsoDocumentDto]),
    __metadata("design:returntype", Promise)
], DocumentsPcmsoController.prototype, "uploadPCMSODoc", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.PCMSO,
        isMember: true,
        isContract: true,
        crud: true,
    }),
    (0, common_1.Post)('/add-queue'),
    openapi.ApiResponse({ status: 201, type: require("../../sst/entities/riskDocument.entity").RiskDocumentEntity }),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_payload_dto_1.UserPayloadDto, pgr_dto_1.UpsertDocumentDto]),
    __metadata("design:returntype", Promise)
], DocumentsPcmsoController.prototype, "addQueuePCMSODoc", null);
DocumentsPcmsoController = __decorate([
    (0, common_1.Controller)('documents/pcmso'),
    __metadata("design:paramtypes", [download_attachment_doc_service_1.DownloadAttachmentsService,
        download_doc_service_1.DownloadDocumentService,
        upload_pcmso_doc_service_1.PcmsoUploadService,
        add_queue_doc_service_1.AddQueueDocumentService])
], DocumentsPcmsoController);
exports.DocumentsPcmsoController = DocumentsPcmsoController;
//# sourceMappingURL=pcmso.controller.js.map