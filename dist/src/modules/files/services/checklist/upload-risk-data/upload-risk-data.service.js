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
exports.UploadChecklistDataService = void 0;
const common_1 = require("@nestjs/common");
const RiskRepository_1 = require("../../../../sst/repositories/implementations/RiskRepository");
const uploadExcelProvider_1 = require("../../../providers/uploadExcelProvider");
const workbooks_constant_1 = require("../../../../../shared/constants/workbooks/workbooks.constant");
const workbooks_enum_1 = require("../../../../../shared/constants/workbooks/workbooks.enum");
const ExcelProvider_1 = require("../../../../../shared/providers/ExcelProvider/implementations/ExcelProvider");
const DatabaseTableRepository_1 = require("../../../repositories/implementations/DatabaseTableRepository");
const findAllRisks_1 = require("../../../utils/findAllRisks");
let UploadChecklistDataService = class UploadChecklistDataService {
    constructor(excelProvider, riskRepository, databaseTableRepository, uploadExcelProvider) {
        this.excelProvider = excelProvider;
        this.riskRepository = riskRepository;
        this.databaseTableRepository = databaseTableRepository;
        this.uploadExcelProvider = uploadExcelProvider;
    }
    async execute(file, userPayloadDto) {
        if (!file)
            throw new common_1.BadRequestException(`file is not available`);
        const buffer = file.buffer;
        const riskWorkbook = workbooks_constant_1.workbooksConstant[workbooks_enum_1.WorkbooksEnum.RISK];
        const system = userPayloadDto.isSystem;
        const companyId = userPayloadDto.targetCompanyId;
        const riskDatabaseTable = await this.databaseTableRepository.findByNameAndCompany(riskWorkbook.name, companyId);
        const allRisks = await this.uploadExcelProvider.getAllData({
            buffer,
            Workbook: riskWorkbook,
            read: readRisks,
            DatabaseTable: riskDatabaseTable,
        });
        await this.riskRepository.upsertMany(allRisks, system, companyId);
        return await this.uploadExcelProvider.newTableData({
            findAll: (sheet) => (0, findAllRisks_1.findAllRisks)(this.excelProvider, this.riskRepository, sheet, companyId),
            Workbook: riskWorkbook,
            system,
            companyId,
            DatabaseTable: riskDatabaseTable,
        });
    }
};
UploadChecklistDataService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ExcelProvider_1.ExcelProvider,
        RiskRepository_1.RiskRepository,
        DatabaseTableRepository_1.DatabaseTableRepository,
        uploadExcelProvider_1.UploadExcelProvider])
], UploadChecklistDataService);
exports.UploadChecklistDataService = UploadChecklistDataService;
const readRisks = async (readFileData, excelProvider, riskSheet, databaseTable) => {
    const risksTable = readFileData.find((data) => data.name === riskSheet.name);
    if (!risksTable)
        throw new common_1.BadRequestException('The table you trying to insert has a different sheet name');
    const riskDatabase = await excelProvider.transformToTableData(risksTable, riskSheet.columns);
    if ((databaseTable === null || databaseTable === void 0 ? void 0 : databaseTable.version) && riskDatabase.version !== databaseTable.version)
        throw new common_1.BadRequestException('The table you trying to insert has a different version, make sure you have the newest table version');
    return riskDatabase.rows.map((risk) => (Object.assign({ type: riskSheet.type }, risk)));
};
//# sourceMappingURL=upload-risk-data.service.js.map