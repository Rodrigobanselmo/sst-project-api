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
exports.DocumentController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const authorization_1 = require("../../../../shared/constants/enum/authorization");
const permissions_decorator_1 = require("../../../../shared/decorators/permissions.decorator");
const user_decorator_1 = require("../../../../shared/decorators/user.decorator");
const user_payload_dto_1 = require("../../../../shared/dto/user-payload.dto");
const document_dto_1 = require("../../dto/document.dto");
const create_document_service_1 = require("../../services/document/create-document/create-document.service");
const delete_document_service_1 = require("../../services/document/delete-document/delete-document.service");
const download_document_service_1 = require("../../services/document/download-document/download-document.service");
const find_by_id_document_service_1 = require("../../services/document/find-by-id-document/find-by-id-document.service");
const find_document_service_1 = require("../../services/document/find-document/find-document.service");
const update_document_service_1 = require("../../services/document/update-document/update-document.service");
let DocumentController = class DocumentController {
    constructor(updateDocumentService, createDocumentService, findDocumentService, findByIdDocumentService, deleteDocumentService, downloadDocumentService) {
        this.updateDocumentService = updateDocumentService;
        this.createDocumentService = createDocumentService;
        this.findDocumentService = findDocumentService;
        this.findByIdDocumentService = findByIdDocumentService;
        this.deleteDocumentService = deleteDocumentService;
        this.downloadDocumentService = downloadDocumentService;
    }
    find(userPayloadDto, query) {
        return this.findDocumentService.execute(query, userPayloadDto);
    }
    findById(userPayloadDto, id) {
        return this.findByIdDocumentService.execute(id, userPayloadDto);
    }
    async download(res, userPayloadDto, id) {
        const { fileKey, fileStream } = await this.downloadDocumentService.execute(id, userPayloadDto);
        res.setHeader('Content-Disposition', `attachment; filename=${fileKey.split('/')[fileKey.split('/').length - 1]}`);
        fileStream.on('error', function (e) {
            res.status(500).send(e);
        });
        fileStream.pipe(res);
    }
    create(file, createDto, userPayloadDto) {
        return this.createDocumentService.execute(createDto, userPayloadDto, file);
    }
    update(file, update, userPayloadDto, id) {
        return this.updateDocumentService.execute(Object.assign(Object.assign({}, update), { id }), userPayloadDto, file);
    }
    delete(userPayloadDto, id) {
        return this.deleteDocumentService.execute(id, userPayloadDto);
    }
};
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.DOCUMENTS,
        isContract: true,
        isMember: true,
        crud: true,
    }),
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_payload_dto_1.UserPayloadDto, document_dto_1.FindDocumentDto]),
    __metadata("design:returntype", void 0)
], DocumentController.prototype, "find", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.DOCUMENTS,
        isContract: true,
        isMember: true,
        crud: true,
    }),
    (0, common_1.Get)('/:id'),
    openapi.ApiResponse({ status: 200, type: require("../../entities/document.entity").DocumentEntity }),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_payload_dto_1.UserPayloadDto, Number]),
    __metadata("design:returntype", void 0)
], DocumentController.prototype, "findById", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.DOCUMENTS,
        isContract: true,
        isMember: true,
        crud: true,
    }),
    (0, common_1.Get)('/:id/download'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, user_decorator_1.User)()),
    __param(2, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, user_payload_dto_1.UserPayloadDto, Number]),
    __metadata("design:returntype", Promise)
], DocumentController.prototype, "download", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.DOCUMENTS,
        isContract: true,
        isMember: true,
        crud: true,
    }),
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', { limits: { fileSize: 1000000000 } })),
    openapi.ApiResponse({ status: 201, type: require("../../entities/document.entity").DocumentEntity }),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, document_dto_1.CreateDocumentDto, user_payload_dto_1.UserPayloadDto]),
    __metadata("design:returntype", void 0)
], DocumentController.prototype, "create", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.DOCUMENTS,
        isContract: true,
        isMember: true,
        crud: true,
    }),
    (0, common_1.Patch)('/:id'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', { limits: { fileSize: 1000000000 } })),
    openapi.ApiResponse({ status: 200, type: require("../../entities/document.entity").DocumentEntity }),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, user_decorator_1.User)()),
    __param(3, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, document_dto_1.UpdateDocumentDto, user_payload_dto_1.UserPayloadDto, Number]),
    __metadata("design:returntype", void 0)
], DocumentController.prototype, "update", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({
        code: authorization_1.PermissionEnum.DOCUMENTS,
        isContract: true,
        isMember: true,
        crud: true,
    }),
    (0, common_1.Delete)('/:id'),
    openapi.ApiResponse({ status: 200, type: require("../../entities/document.entity").DocumentEntity }),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_payload_dto_1.UserPayloadDto, Number]),
    __metadata("design:returntype", void 0)
], DocumentController.prototype, "delete", null);
DocumentController = __decorate([
    (0, swagger_1.ApiTags)('document'),
    (0, common_1.Controller)('company/:companyId/document'),
    __metadata("design:paramtypes", [update_document_service_1.UpdateDocumentService,
        create_document_service_1.CreateDocumentService,
        find_document_service_1.FindDocumentService,
        find_by_id_document_service_1.FindByIdDocumentService,
        delete_document_service_1.DeleteDocumentService,
        download_document_service_1.DownloadDocumentService])
], DocumentController);
exports.DocumentController = DocumentController;
//# sourceMappingURL=document.controller.js.map