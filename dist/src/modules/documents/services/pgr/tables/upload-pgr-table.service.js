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
exports.PgrUploadTableService = void 0;
const common_1 = require("@nestjs/common");
const docx_1 = require("docx");
const stream_1 = require("stream");
const RiskDocumentRepository_1 = require("../../../../../modules/checklist/repositories/implementations/RiskDocumentRepository");
const RiskGroupDataRepository_1 = require("../../../../../modules/checklist/repositories/implementations/RiskGroupDataRepository");
const HierarchyRepository_1 = require("../../../../../modules/company/repositories/implementations/HierarchyRepository");
const AmazonStorageProvider_1 = require("../../../../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider");
const document_1 = require("../../../docx/base/config/document");
const hierarchy_converter_1 = require("../../../docx/converter/hierarchy.converter");
const actionPlan_section_1 = require("../../../docx/sections/tables/actionPlan/actionPlan.section");
const hierarchyPlan_section_1 = require("../../../docx/sections/tables/hierarchyOrg/hierarchyPlan.section");
const hierarchyPrioritization_section_1 = require("../../../docx/sections/tables/hierarchyPrioritization/hierarchyPrioritization.section");
const hierarchyRisks_section_1 = require("../../../docx/sections/tables/hierarchyRisks/hierarchyRisks.section");
const riskCharacterization_section_1 = require("../../../docx/sections/tables/riskCharacterization/riskCharacterization.section");
const appr_section_1 = require("../../../docx/sections/tables/appr/appr.section");
let PgrUploadTableService = class PgrUploadTableService {
    constructor(riskGroupDataRepository, riskDocumentRepository, amazonStorageProvider, hierarchyRepository) {
        this.riskGroupDataRepository = riskGroupDataRepository;
        this.riskDocumentRepository = riskDocumentRepository;
        this.amazonStorageProvider = amazonStorageProvider;
        this.hierarchyRepository = hierarchyRepository;
    }
    async execute(upsertPgrDto, userPayloadDto) {
        const companyId = userPayloadDto.targetCompanyId;
        const workspaceId = upsertPgrDto.workspaceId;
        const riskGroupData = await this.riskGroupDataRepository.findAllDataById(upsertPgrDto.riskGroupId, companyId);
        const hierarchyHierarchy = await this.hierarchyRepository.findAllDataHierarchyByCompany(companyId, workspaceId);
        const { hierarchyData, homoGroupTree } = (0, hierarchy_converter_1.hierarchyConverter)(hierarchyHierarchy);
        const sections = [
            (0, riskCharacterization_section_1.riskCharacterizationTableSection)(riskGroupData),
            ...(0, hierarchyPrioritization_section_1.hierarchyPrioritizationTableSections)(riskGroupData, hierarchyData),
            ...(0, hierarchyRisks_section_1.hierarchyRisksTableSections)(riskGroupData, hierarchyData),
            (0, hierarchyPlan_section_1.hierarchyPlanTableSection)(hierarchyData, homoGroupTree),
            (0, actionPlan_section_1.actionPlanTableSection)(riskGroupData),
            ...(0, appr_section_1.APPRTableSection)(riskGroupData, hierarchyData, homoGroupTree),
        ];
        const doc = (0, document_1.createBaseDocument)(sections);
        const b64string = await docx_1.Packer.toBase64String(doc);
        const buffer = Buffer.from(b64string, 'base64');
        const docName = upsertPgrDto.name.replace(/\s+/g, '');
        const fileName = `${docName.length > 0 ? docName + '-' : ''}${riskGroupData.company.name.replace(/\s+/g, '')}-v${upsertPgrDto.version}.docx`;
        await this.upload(buffer, fileName, upsertPgrDto, riskGroupData.company);
        return { buffer, fileName };
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
PgrUploadTableService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [RiskGroupDataRepository_1.RiskGroupDataRepository,
        RiskDocumentRepository_1.RiskDocumentRepository,
        AmazonStorageProvider_1.AmazonStorageProvider,
        HierarchyRepository_1.HierarchyRepository])
], PgrUploadTableService);
exports.PgrUploadTableService = PgrUploadTableService;
//# sourceMappingURL=upload-pgr-table.service.js.map