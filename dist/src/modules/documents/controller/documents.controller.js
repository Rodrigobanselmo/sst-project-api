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
exports.DocumentsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const user_decorator_1 = require("../../../shared/decorators/user.decorator");
const user_payload_dto_1 = require("../../../shared/dto/user-payload.dto");
const pgr_dto_1 = require("../dto/pgr.dto");
const download_pgr_doc_service_1 = require("../services/pgr/document/download-pgr-doc.service");
const upload_pgr_doc_service_1 = require("../services/pgr/document/upload-pgr-doc.service");
const download_pgr_table_service_1 = require("../services/pgr/tables/download-pgr-table.service");
const upload_pgr_table_service_1 = require("../services/pgr/tables/upload-pgr-table.service");
let DocumentsController = class DocumentsController {
    constructor(pgrDownloadService, pgrUploadService, pgrDownloadDocService, pgrUploadDocService) {
        this.pgrDownloadService = pgrDownloadService;
        this.pgrUploadService = pgrUploadService;
        this.pgrDownloadDocService = pgrDownloadDocService;
        this.pgrUploadDocService = pgrUploadDocService;
    }
    async downloadPGR(res, userPayloadDto, docId) {
        const { fileKey, fileStream } = await this.pgrDownloadService.execute(userPayloadDto, docId);
        res.setHeader('Content-Disposition', `attachment; filename=${fileKey}`);
        fileStream.on('error', function (e) {
            res.status(500).send(e);
        });
        fileStream.pipe(res);
    }
    async uploadPGR(res, userPayloadDto, upsertPgrDto) {
        const { buffer: file, fileName } = await this.pgrUploadService.execute(upsertPgrDto, userPayloadDto);
        res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
        res.send(file);
    }
    async uploadPGRDoc(res, userPayloadDto, upsertPgrDto) {
        const { buffer: file, fileName } = await this.pgrUploadDocService.execute(upsertPgrDto, userPayloadDto);
        res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
        res.send(file);
    }
};
__decorate([
    (0, common_1.Get)('/pgr/:docId/:companyId?'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, user_decorator_1.User)()),
    __param(2, (0, common_1.Param)('docId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, user_payload_dto_1.UserPayloadDto, String]),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "downloadPGR", null);
__decorate([
    (0, common_1.Post)('/pgr'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, user_decorator_1.User)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, user_payload_dto_1.UserPayloadDto,
        pgr_dto_1.UpsertPgrDto]),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "uploadPGR", null);
__decorate([
    (0, common_1.Post)('/pgr/doc'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, user_decorator_1.User)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, user_payload_dto_1.UserPayloadDto,
        pgr_dto_1.UpsertPgrDto]),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "uploadPGRDoc", null);
DocumentsController = __decorate([
    (0, common_1.Controller)('documents'),
    __metadata("design:paramtypes", [download_pgr_table_service_1.PgrDownloadTableService,
        upload_pgr_table_service_1.PgrUploadTableService,
        download_pgr_doc_service_1.PgrDownloadService,
        upload_pgr_doc_service_1.PgrUploadService])
], DocumentsController);
exports.DocumentsController = DocumentsController;
//# sourceMappingURL=documents.controller.js.map