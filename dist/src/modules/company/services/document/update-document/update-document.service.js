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
exports.UpdateDocumentService = void 0;
const errorMessage_1 = require("../../../../../shared/constants/enum/errorMessage");
const AmazonStorageProvider_1 = require("./../../../../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider");
const DocumentRepository_1 = require("../../../repositories/implementations/DocumentRepository");
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
let UpdateDocumentService = class UpdateDocumentService {
    constructor(documentRepository, amazonStorageProvider) {
        this.documentRepository = documentRepository;
        this.amazonStorageProvider = amazonStorageProvider;
    }
    async execute(updateDto, user, file) {
        const companyId = user.targetCompanyId;
        const documentFound = await this.documentRepository.findFirstNude({
            where: {
                id: updateDto.id,
                companyId,
            },
            select: { id: true, fileUrl: true },
        });
        if (!(documentFound === null || documentFound === void 0 ? void 0 : documentFound.id))
            throw new common_1.BadRequestException(errorMessage_1.ErrorMessageEnum.DOCUMENT_NOT_FOUND);
        let url;
        if (file) {
            url = await this.upload(companyId, file, documentFound);
        }
        const document = await this.documentRepository.update(Object.assign(Object.assign({}, updateDto), { companyId: user.targetCompanyId, fileUrl: url }));
        return document;
    }
    async upload(companyId, file, documentFound) {
        if (documentFound === null || documentFound === void 0 ? void 0 : documentFound.fileUrl) {
            const splitUrl = documentFound.fileUrl.split('.com/');
            await this.amazonStorageProvider.delete({
                fileName: splitUrl[splitUrl.length - 1],
            });
        }
        const fileType = file.originalname.split('.')[file.originalname.split('.').length - 1];
        const path = companyId + '/documents/' + `${(documentFound === null || documentFound === void 0 ? void 0 : documentFound.name) || ''}-${(0, uuid_1.v4)()}` + '.' + fileType;
        const { url } = await this.amazonStorageProvider.upload({
            file: file.buffer,
            fileName: path,
        });
        return url;
    }
};
UpdateDocumentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [DocumentRepository_1.DocumentRepository, AmazonStorageProvider_1.AmazonStorageProvider])
], UpdateDocumentService);
exports.UpdateDocumentService = UpdateDocumentService;
//# sourceMappingURL=update-document.service.js.map