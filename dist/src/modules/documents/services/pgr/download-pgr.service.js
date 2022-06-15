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
exports.PgrDownloadService = void 0;
const common_1 = require("@nestjs/common");
const RiskDocumentRepository_1 = require("../../../../modules/checklist/repositories/implementations/RiskDocumentRepository");
const AmazonStorageProvider_1 = require("../../../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider");
const errorMessage_1 = require("./../../../../shared/constants/enum/errorMessage");
let PgrDownloadService = class PgrDownloadService {
    constructor(amazonStorageProvider, riskDocumentRepository) {
        this.amazonStorageProvider = amazonStorageProvider;
        this.riskDocumentRepository = riskDocumentRepository;
    }
    async execute(userPayloadDto, docId) {
        const companyId = userPayloadDto.targetCompanyId;
        const riskDoc = await this.riskDocumentRepository.findById(docId, companyId);
        if (!riskDoc)
            throw new common_1.BadRequestException(errorMessage_1.ErrorDocumentEnum.NOT_FOUND);
        const fileKey = riskDoc.fileUrl.split('.com/').pop();
        const { file: fileStream } = this.amazonStorageProvider.download({
            fileKey,
        });
        return { fileStream, fileKey };
    }
};
PgrDownloadService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [AmazonStorageProvider_1.AmazonStorageProvider,
        RiskDocumentRepository_1.RiskDocumentRepository])
], PgrDownloadService);
exports.PgrDownloadService = PgrDownloadService;
//# sourceMappingURL=download-pgr.service.js.map