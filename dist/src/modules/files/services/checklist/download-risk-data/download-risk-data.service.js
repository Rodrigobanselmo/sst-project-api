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
exports.DownloadRiskDataService = void 0;
const common_1 = require("@nestjs/common");
const RiskRepository_1 = require("../../../../../modules/checklist/repositories/implementations/RiskRepository");
const donwlodExcelProvider_1 = require("../../../../../modules/files/providers/donwlodExcelProvider");
const workbooks_constant_1 = require("../../../../../shared/constants/workbooks/workbooks.constant");
const workbooks_enum_1 = require("../../../../../shared/constants/workbooks/workbooks.enum");
const ExcelProvider_1 = require("../../../../../shared/providers/ExcelProvider/implementations/ExcelProvider");
const findAllRisks_1 = require("../../../utils/findAllRisks");
let DownloadRiskDataService = class DownloadRiskDataService {
    constructor(excelProvider, riskRepository, downloadExcelProvider) {
        this.excelProvider = excelProvider;
        this.riskRepository = riskRepository;
        this.downloadExcelProvider = downloadExcelProvider;
    }
    async execute(userPayloadDto) {
        const Workbook = workbooks_constant_1.workbooksConstant[workbooks_enum_1.WorkbooksEnum.RISK];
        const companyId = userPayloadDto.companyId;
        return this.downloadExcelProvider.newTableData({
            findAll: (sheet) => (0, findAllRisks_1.findAllRisks)(this.excelProvider, this.riskRepository, sheet, companyId),
            Workbook,
            companyId,
        });
    }
};
DownloadRiskDataService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ExcelProvider_1.ExcelProvider,
        RiskRepository_1.RiskRepository,
        donwlodExcelProvider_1.DownloadExcelProvider])
], DownloadRiskDataService);
exports.DownloadRiskDataService = DownloadRiskDataService;
//# sourceMappingURL=download-risk-data.service.js.map