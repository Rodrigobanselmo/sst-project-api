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
const docx_1 = require("docx");
const RiskDocumentRepository_1 = require("../../../../modules/checklist/repositories/implementations/RiskDocumentRepository");
const RiskGroupDataRepository_1 = require("../../../../modules/checklist/repositories/implementations/RiskGroupDataRepository");
const HierarchyRepository_1 = require("../../../../modules/company/repositories/implementations/HierarchyRepository");
const AmazonStorageProvider_1 = require("../../../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider");
const stream_1 = require("stream");
const actionPlan_section_1 = require("../../utils/sections/tables/actionPlan/actionPlan.section");
const riskInventory_section_1 = require("../../utils/sections/tables/riskInventory/riskInventory.section");
let PgrUploadService = class PgrUploadService {
    constructor(riskGroupDataRepository, riskDocumentRepository, amazonStorageProvider, hierarchyRepository) {
        this.riskGroupDataRepository = riskGroupDataRepository;
        this.riskDocumentRepository = riskDocumentRepository;
        this.amazonStorageProvider = amazonStorageProvider;
        this.hierarchyRepository = hierarchyRepository;
    }
    async execute(upsertPgrDto, userPayloadDto) {
        const companyId = userPayloadDto.targetCompanyId;
        const workspaceId = upsertPgrDto.workspaceId;
        console.log('companyId', 1);
        const riskGroupData = await this.riskGroupDataRepository.findAllDataById(upsertPgrDto.riskGroupId, companyId);
        console.log('companyId', 2);
        const hierarchyData = await this.hierarchyRepository.findAllDataHierarchyByCompany(companyId, workspaceId);
        const doc = new docx_1.Document({
            sections: [
                (0, actionPlan_section_1.actionPlanTableSection)(riskGroupData),
                ...(0, riskInventory_section_1.riskInventoryTableSection)(riskGroupData, hierarchyData),
            ],
        });
        console.log('companyId', 3);
        const buffer = await docx_1.Packer.toBuffer(doc);
        console.log('companyId', 4);
        const docName = upsertPgrDto.name.replace(/\s+/g, '');
        const fileName = `${docName.length > 0 ? docName + '-' : ''}${riskGroupData.company.name.replace(/\s+/g, '')}-v${upsertPgrDto.version}.docx`;
        await this.upload(buffer, fileName, upsertPgrDto, riskGroupData.company);
        return { buffer, fileName };
    }
    async upload(fileBuffer, fileName, upsertPgrDto, company) {
        const stream = stream_1.Readable.from(fileBuffer);
        const { url } = await this.amazonStorageProvider.upload({
            file: stream,
            fileName,
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