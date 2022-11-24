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
exports.DownloadDocumentService = void 0;
const AmazonStorageProvider_1 = require("./../../../../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider");
const common_1 = require("@nestjs/common");
const errorMessage_1 = require("../../../../../shared/constants/enum/errorMessage");
const DocumentRepository_1 = require("../../../repositories/implementations/DocumentRepository");
let DownloadDocumentService = class DownloadDocumentService {
    constructor(documentRepository, amazonStorageProvider) {
        this.documentRepository = documentRepository;
        this.amazonStorageProvider = amazonStorageProvider;
    }
    async execute(id, user) {
        const companyId = user.targetCompanyId;
        const documentFound = await this.documentRepository.findFirstNude({
            where: {
                id,
                companyId,
            },
            select: { id: true, fileUrl: true },
        });
        if (!(documentFound === null || documentFound === void 0 ? void 0 : documentFound.id))
            throw new common_1.BadRequestException(errorMessage_1.ErrorMessageEnum.DOCUMENT_NOT_FOUND);
        const fileKey = documentFound.fileUrl.split('.com/').pop();
        const { file: fileStream } = this.amazonStorageProvider.download({
            fileKey,
        });
        return { fileStream, fileKey };
    }
};
DownloadDocumentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [DocumentRepository_1.DocumentRepository, AmazonStorageProvider_1.AmazonStorageProvider])
], DownloadDocumentService);
exports.DownloadDocumentService = DownloadDocumentService;
//# sourceMappingURL=download-document.service.js.map