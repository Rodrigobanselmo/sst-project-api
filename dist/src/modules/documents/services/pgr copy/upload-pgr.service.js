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
exports.PgrUploadService = void 0;
const common_1 = require("@nestjs/common");
const stream_1 = require("stream");
const RiskDocumentRepository_1 = require("../../../../modules/checklist/repositories/implementations/RiskDocumentRepository");
const RiskGroupDataRepository_1 = require("../../../../modules/checklist/repositories/implementations/RiskGroupDataRepository");
const HierarchyRepository_1 = require("../../../../modules/company/repositories/implementations/HierarchyRepository");
const AmazonStorageProvider_1 = require("../../../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider");
let PgrUploadService = class PgrUploadService {
    constructor(riskGroupDataRepository, riskDocumentRepository, amazonStorageProvider, hierarchyRepository) {
        this.riskGroupDataRepository = riskGroupDataRepository;
        this.riskDocumentRepository = riskDocumentRepository;
        this.amazonStorageProvider = amazonStorageProvider;
        this.hierarchyRepository = hierarchyRepository;
    }
    async execute(upsertPgrDto, userPayloadDto) {
    }
    async upload(fileBuffer, fileName, upsertPgrDto, company) {
        const stream = stream_1.Readable.from(fileBuffer);
        const { url } = await this.amazonStorageProvider.upload({
            file: stream,
            fileName: company.id + '/pgr/' + fileName,
        });
        const doc = await this.riskDocumentRepository.upsert(Object.assign(Object.assign({}, upsertPgrDto), { companyId: company.id, fileUrl: url }));
        return doc;
    }
};
PgrUploadService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [RiskGroupDataRepository_1.RiskGroupDataRepository,
        RiskDocumentRepository_1.RiskDocumentRepository,
        AmazonStorageProvider_1.AmazonStorageProvider,
        HierarchyRepository_1.HierarchyRepository])
], PgrUploadService);
exports.PgrUploadService = PgrUploadService;
//# sourceMappingURL=upload-pgr.service.js.map