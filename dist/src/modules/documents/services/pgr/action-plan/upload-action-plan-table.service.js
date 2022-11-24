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
exports.PgrActionPlanUploadTableService = void 0;
const common_1 = require("@nestjs/common");
const docx_1 = require("docx");
const data_sort_1 = require("../../../../../shared/utils/sorts/data.sort");
const AmazonStorageProvider_1 = require("../../../../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider");
const getFileName_1 = require("../../../../../shared/utils/getFileName");
const RiskDocumentRepository_1 = require("../../../../sst/repositories/implementations/RiskDocumentRepository");
const RiskGroupDataRepository_1 = require("../../../../sst/repositories/implementations/RiskGroupDataRepository");
const HierarchyRepository_1 = require("../../../../company/repositories/implementations/HierarchyRepository");
const document_1 = require("../../../docx/base/config/document");
const actionPlan_section_1 = require("../../../docx/components/tables/actionPlan/actionPlan.section");
const hierarchy_converter_1 = require("../../../docx/converter/hierarchy.converter");
const DayJSProvider_1 = require("../../../../../shared/providers/DateProvider/implementations/DayJSProvider");
let PgrActionPlanUploadTableService = class PgrActionPlanUploadTableService {
    constructor(riskGroupDataRepository, riskDocumentRepository, amazonStorageProvider, hierarchyRepository) {
        this.riskGroupDataRepository = riskGroupDataRepository;
        this.riskDocumentRepository = riskDocumentRepository;
        this.amazonStorageProvider = amazonStorageProvider;
        this.hierarchyRepository = hierarchyRepository;
    }
    async execute(upsertPgrDto, userPayloadDto) {
        var _a, _b, _c;
        const companyId = userPayloadDto.targetCompanyId;
        const workspaceId = upsertPgrDto.workspaceId;
        const riskGroupData = await this.riskGroupDataRepository.findAllDataById(upsertPgrDto.riskGroupId, workspaceId, companyId);
        const version = (await this.riskDocumentRepository.findByRiskGroupAndCompany(upsertPgrDto.riskGroupId, companyId)).sort((a, b) => (0, data_sort_1.sortData)(b, a, 'created_at')) || [];
        const hierarchyHierarchy = await this.hierarchyRepository.findAllDataHierarchyByCompany(companyId, workspaceId);
        const { hierarchyTree } = (0, hierarchy_converter_1.hierarchyConverter)(hierarchyHierarchy, [], {
            workspaceId,
        });
        const sections = [(0, actionPlan_section_1.actionPlanTableSection)(riskGroupData, hierarchyTree)];
        const doc = (0, document_1.createBaseDocument)(sections);
        const b64string = await docx_1.Packer.toBase64String(doc);
        const buffer = Buffer.from(b64string, 'base64');
        const fileName = (0, getFileName_1.getDocxFileName)({
            name: version[0] ? ((_a = version[0]) === null || _a === void 0 ? void 0 : _a.name) || '' : '',
            companyName: (((_b = riskGroupData.company) === null || _b === void 0 ? void 0 : _b.fantasy) || riskGroupData.company.name) + (riskGroupData.company.initials ? '-' + riskGroupData.company.initials : ''),
            typeName: 'PGR-PLANO_DE_ACAO',
            version: version[0] ? ((_c = version[0]) === null || _c === void 0 ? void 0 : _c.version) || '0.0.0' : '0.0.0',
            date: (0, DayJSProvider_1.dayjs)(riskGroupData.documentDate || new Date()).format('MMMM-YYYY'),
        });
        await this.upload(buffer, fileName, riskGroupData.company);
        return { buffer, fileName };
    }
    async upload(fileBuffer, fileName, company) {
        const { url } = await this.amazonStorageProvider.upload({
            file: fileBuffer,
            fileName: 'temp-files-7-days/' + fileName,
        });
        return url;
    }
};
PgrActionPlanUploadTableService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [RiskGroupDataRepository_1.RiskGroupDataRepository,
        RiskDocumentRepository_1.RiskDocumentRepository,
        AmazonStorageProvider_1.AmazonStorageProvider,
        HierarchyRepository_1.HierarchyRepository])
], PgrActionPlanUploadTableService);
exports.PgrActionPlanUploadTableService = PgrActionPlanUploadTableService;
//# sourceMappingURL=upload-action-plan-table.service.js.map