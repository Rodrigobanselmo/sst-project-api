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
exports.DownloadHierarchiesService = void 0;
const common_1 = require("@nestjs/common");
const findAllHierarchies_1 = require("../../../../../modules/files/utils/findAllHierarchies");
const workbooks_constant_1 = require("../../../../../shared/constants/workbooks/workbooks.constant");
const workbooks_enum_1 = require("../../../../../shared/constants/workbooks/workbooks.enum");
const ExcelProvider_1 = require("../../../../../shared/providers/ExcelProvider/implementations/ExcelProvider");
const CompanyRepository_1 = require("../../../../company/repositories/implementations/CompanyRepository");
const HierarchyRepository_1 = require("../../../../company/repositories/implementations/HierarchyRepository");
const WorkspaceRepository_1 = require("../../../../company/repositories/implementations/WorkspaceRepository");
const donwlodExcelProvider_1 = require("../../../providers/donwlodExcelProvider");
let DownloadHierarchiesService = class DownloadHierarchiesService {
    constructor(excelProvider, companyRepository, workspaceRepository, hierarchyRepository, downloadExcelProvider) {
        this.excelProvider = excelProvider;
        this.companyRepository = companyRepository;
        this.workspaceRepository = workspaceRepository;
        this.hierarchyRepository = hierarchyRepository;
        this.downloadExcelProvider = downloadExcelProvider;
    }
    async execute(userPayloadDto) {
        const Workbook = workbooks_constant_1.workbooksConstant[workbooks_enum_1.WorkbooksEnum.HIERARCHIES];
        const companyId = userPayloadDto.targetCompanyId;
        return this.downloadExcelProvider.newTableData({
            findAll: (sheet) => (0, findAllHierarchies_1.findAllHierarchies)(this.excelProvider, this.hierarchyRepository, sheet, companyId),
            Workbook,
            companyId,
        });
    }
};
DownloadHierarchiesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ExcelProvider_1.ExcelProvider,
        CompanyRepository_1.CompanyRepository,
        WorkspaceRepository_1.WorkspaceRepository,
        HierarchyRepository_1.HierarchyRepository,
        donwlodExcelProvider_1.DownloadExcelProvider])
], DownloadHierarchiesService);
exports.DownloadHierarchiesService = DownloadHierarchiesService;
//# sourceMappingURL=download-hierarchies.service.js.map