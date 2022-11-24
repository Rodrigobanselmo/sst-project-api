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
exports.DocumentsBaseController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const authorization_1 = require("../../../shared/constants/enum/authorization");
const permissions_decorator_1 = require("../../../shared/decorators/permissions.decorator");
const user_decorator_1 = require("../../../shared/decorators/user.decorator");
const user_payload_dto_1 = require("../../../shared/dto/user-payload.dto");
const pgr_dto_1 = require("../dto/pgr.dto");
const upload_action_plan_table_service_1 = require("../services/pgr/action-plan/upload-action-plan-table.service");
const add_queue_doc_service_1 = require("../services/pgr/document/add-queue-doc.service");
const download_attachment_doc_service_1 = require("../services/pgr/document/download-attachment-doc.service");
const download_doc_service_1 = require("../services/pgr/document/download-doc.service");
const upload_pgr_doc_service_1 = require("../services/pgr/document/upload-pgr-doc.service");
const upload_pgr_table_service_1 = require("../services/pgr/tables/upload-pgr-table.service");
let DocumentsBaseController = class DocumentsBaseController {
    constructor(pgrDownloadAttachmentsService, pgrUploadService, pgrActionPlanUploadTableService, pgrDownloadDocService, pgrUploadDocService, addQueuePGRDocumentService) {
        this.pgrDownloadAttachmentsService = pgrDownloadAttachmentsService;
        this.pgrUploadService = pgrUploadService;
        this.pgrActionPlanUploadTableService = pgrActionPlanUploadTableService;
        this.pgrDownloadDocService = pgrDownloadDocService;
        this.pgrUploadDocService = pgrUploadDocService;
        this.addQueuePGRDocumentService = addQueuePGRDocumentService;
    }
    async downloadAttachment(res, userPayloadDto, docId, attachmentId) {
        const { fileKey, fileStream } = await this.pgrDownloadAttachmentsService.execute(userPayloadDto, docId, attachmentId);
        res.setHeader('Content-Disposition', `attachment; filename=${fileKey.split('/')[fileKey.split('/').length - 1]}`);
        fileStream.on('error', function (e) {
            res.status(500).send(e);
        });
        fileStream.pipe(res);
    }
    async downloadPGR(res, userPayloadDto, docId) {
        const { fileKey, fileStream } = await this.pgrDownloadDocService.execute(userPayloadDto, docId);
        res.setHeader('Content-Disposition', `attachment; filename=${fileKey.split('/')[fileKey.split('/').length - 1]}`);
        fileStream.on('error', function (e) {
            res.status(500).send(e);
        });
        fileStream.pipe(res);
    }
    async addQueuePGRDoc(userPayloadDto, upsertPgrDto) {
        return this.addQueuePGRDocumentService.execute(upsertPgrDto, userPayloadDto);
    }
};
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.PGR,
        isMember: true,
        isContract: true,
    }, {
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
], DocumentsBaseController.prototype, "downloadAttachment", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.PGR,
        isMember: true,
        isContract: true,
    }, {
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
], DocumentsBaseController.prototype, "downloadPGR", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.PGR,
        isMember: true,
        isContract: true,
        crud: true,
    }, {
        code: authorization_1.PermissionEnum.PCMSO,
        isMember: true,
        isContract: true,
    }),
    (0, common_1.Post)('/add-queue'),
    openapi.ApiResponse({ status: 201, type: require("../../sst/entities/riskDocument.entity").RiskDocumentEntity }),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_payload_dto_1.UserPayloadDto, pgr_dto_1.UpsertDocumentDto]),
    __metadata("design:returntype", Promise)
], DocumentsBaseController.prototype, "addQueuePGRDoc", null);
DocumentsBaseController = __decorate([
    (0, common_1.Controller)('documents/base'),
    __metadata("design:paramtypes", [download_attachment_doc_service_1.DownloadAttachmentsService,
        upload_pgr_table_service_1.PgrUploadTableService,
        upload_action_plan_table_service_1.PgrActionPlanUploadTableService,
        download_doc_service_1.DownloadDocumentService,
        upload_pgr_doc_service_1.PgrUploadService,
        add_queue_doc_service_1.AddQueueDocumentService])
], DocumentsBaseController);
exports.DocumentsBaseController = DocumentsBaseController;
//# sourceMappingURL=doc.controller.js.map