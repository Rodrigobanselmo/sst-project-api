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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteDocumentService = void 0;
const AmazonStorageProvider_1 = require("./../../../../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider");
const common_1 = require("@nestjs/common");
const errorMessage_1 = require("../../../../../shared/constants/enum/errorMessage");
const DocumentRepository_1 = require("../../../repositories/implementations/DocumentRepository");
let DeleteDocumentService = class DeleteDocumentService {
    constructor(documentRepository, amazonStorageProvider) {
        this.documentRepository = documentRepository;
        this.amazonStorageProvider = amazonStorageProvider;
    }
    async execute(id, user) {
        const documentFound = await this.documentRepository.findFirstNude({
            where: {
                id,
                companyId: user.targetCompanyId,
            },
            select: { id: true, oldDocuments: { select: { _count: true }, take: 1 } },
        });
        if (!(documentFound === null || documentFound === void 0 ? void 0 : documentFound.id))
            throw new common_1.BadRequestException(errorMessage_1.ErrorMessageEnum.DOCUMENT_NOT_FOUND);
        if (!(documentFound === null || documentFound === void 0 ? void 0 : documentFound.parentDocumentId) && (documentFound === null || documentFound === void 0 ? void 0 : documentFound.oldDocuments) && documentFound.oldDocuments.length != 0)
            throw new common_1.BadRequestException(errorMessage_1.ErrorMessageEnum.DOCUMENT_IS_PRINCIPAL);
        if (documentFound === null || documentFound === void 0 ? void 0 : documentFound.fileUrl) {
            const splitUrl = documentFound.fileUrl.split('.com/');
            await this.amazonStorageProvider.delete({
                fileName: splitUrl[splitUrl.length - 1],
            });
        }
        const document = await this.documentRepository.delete(id, user.targetCompanyId);
        return document;
    }
};
DeleteDocumentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [DocumentRepository_1.DocumentRepository, AmazonStorageProvider_1.AmazonStorageProvider])
], DeleteDocumentService);
exports.DeleteDocumentService = DeleteDocumentService;
//# sourceMappingURL=delete-document.service.js.map