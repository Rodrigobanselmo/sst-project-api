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
exports.DocumentPgrController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const user_decorator_1 = require("../../../../shared/decorators/user.decorator");
const user_payload_dto_1 = require("../../../../shared/dto/user-payload.dto");
const find_by_id_documents_service_1 = require("../../services/docVersion/find-by-id-documents/find-by-id-documents.service");
const find_documents_service_1 = require("../../services/docVersion/find-documents/find-documents.service");
const permissions_decorator_1 = require("../../../../shared/decorators/permissions.decorator");
const authorization_1 = require("../../../../shared/constants/enum/authorization");
const doc_version_dto_1 = require("../../dto/doc-version.dto");
let DocumentPgrController = class DocumentPgrController {
    constructor(findDocumentsService, findByIdDocumentsService) {
        this.findDocumentsService = findDocumentsService;
        this.findByIdDocumentsService = findByIdDocumentsService;
    }
    find(userPayloadDto, query) {
        return this.findDocumentsService.execute(query, userPayloadDto);
    }
    findById(id, userPayloadDto) {
        const companyId = userPayloadDto.targetCompanyId;
        return this.findByIdDocumentsService.execute(id, companyId);
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
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_payload_dto_1.UserPayloadDto, doc_version_dto_1.FindDocVersionDto]),
    __metadata("design:returntype", void 0)
], DocumentPgrController.prototype, "find", null);
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
    (0, common_1.Get)('/:id'),
    openapi.ApiResponse({ status: 200, type: require("../../entities/riskDocument.entity").RiskDocumentEntity }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_payload_dto_1.UserPayloadDto]),
    __metadata("design:returntype", void 0)
], DocumentPgrController.prototype, "findById", null);
DocumentPgrController = __decorate([
    (0, common_1.Controller)('/document-version/:companyId'),
    __metadata("design:paramtypes", [find_documents_service_1.FindDocumentsService, find_by_id_documents_service_1.FindByIdDocumentsService])
], DocumentPgrController);
exports.DocumentPgrController = DocumentPgrController;
//# sourceMappingURL=doc-version.controller.js.map