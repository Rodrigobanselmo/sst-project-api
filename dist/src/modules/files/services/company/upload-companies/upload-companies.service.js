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
exports.UploadCompaniesService = void 0;
const common_1 = require("@nestjs/common");
const CompanyRepository_1 = require("../../../../../modules/company/repositories/implementations/CompanyRepository");
const uploadExcelProvider_1 = require("../../../../../modules/files/providers/uploadExcelProvider");
const findAllCompanies_1 = require("../../../../../modules/files/utils/findAllCompanies");
const workbooks_constant_1 = require("../../../../../shared/constants/workbooks/workbooks.constant");
const workbooks_enum_1 = require("../../../../../shared/constants/workbooks/workbooks.enum");
const ExcelProvider_1 = require("../../../../../shared/providers/ExcelProvider/implementations/ExcelProvider");
const DatabaseTableRepository_1 = require("../../../repositories/implementations/DatabaseTableRepository");
let UploadCompaniesService = class UploadCompaniesService {
    constructor(excelProvider, companyRepository, databaseTableRepository, uploadExcelProvider) {
        this.excelProvider = excelProvider;
        this.companyRepository = companyRepository;
        this.databaseTableRepository = databaseTableRepository;
        this.uploadExcelProvider = uploadExcelProvider;
    }
    async execute(file, userPayloadDto) {
        if (!file)
            throw new common_1.BadRequestException(`file is not available`);
        const buffer = file.buffer;
        const Workbook = workbooks_constant_1.workbooksConstant[workbooks_enum_1.WorkbooksEnum.COMPANIES];
        const system = userPayloadDto.isMaster;
        const companyId = userPayloadDto.targetCompanyId;
        const DatabaseTable = await this.databaseTableRepository.findByNameAndCompany(Workbook.name, companyId);
        const allCompanies = await this.uploadExcelProvider.getAllData({
            buffer,
            Workbook,
            read,
            DatabaseTable,
        });
        await this.companyRepository.upsertMany(allCompanies);
        return await this.uploadExcelProvider.newTableData({
            findAll: (sheet) => (0, findAllCompanies_1.findAllCompanies)(this.excelProvider, this.companyRepository, sheet, companyId, userPayloadDto.isMaster),
            Workbook,
            system,
            companyId,
            DatabaseTable,
        });
    }
};
UploadCompaniesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ExcelProvider_1.ExcelProvider,
        CompanyRepository_1.CompanyRepository,
        DatabaseTableRepository_1.DatabaseTableRepository,
        uploadExcelProvider_1.UploadExcelProvider])
], UploadCompaniesService);
exports.UploadCompaniesService = UploadCompaniesService;
const read = async (readFileData, excelProvider, sheet, databaseTable) => {
    const table = readFileData.find((data) => data.name === sheet.name);
    if (!table)
        throw new common_1.BadRequestException('The table you trying to insert has a different sheet name');
    const database = await excelProvider.transformToTableData(table, sheet.columns);
    if ((databaseTable === null || databaseTable === void 0 ? void 0 : databaseTable.version) && database.version !== databaseTable.version)
        throw new common_1.BadRequestException('The table you trying to insert has a different version, make sure you have the newest table version');
    return database.rows;
};
//# sourceMappingURL=upload-companies.service.js.map