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
exports.UploadEpiDataService = void 0;
const common_1 = require("@nestjs/common");
const EpiRepository_1 = require("../../../../checklist/repositories/implementations/EpiRepository");
const findAllEpis_1 = require("../../../utils/findAllEpis");
const epiSheet_constant_1 = require("../../../../../shared/constants/workbooks/sheets/epi/epiSheet.constant");
const removeDuplicate_1 = require("../../../../../shared/utils/removeDuplicate");
const workbooks_constant_1 = require("../../../../../shared/constants/workbooks/workbooks.constant");
const workbooks_enum_1 = require("../../../../../shared/constants/workbooks/workbooks.enum");
const ExcelProvider_1 = require("../../../../../shared/providers/ExcelProvider/implementations/ExcelProvider");
const uploadExcelProvider_1 = require("../../../providers/uploadExcelProvider");
const DatabaseTableRepository_1 = require("../../../repositories/implementations/DatabaseTableRepository");
let UploadEpiDataService = class UploadEpiDataService {
    constructor(excelProvider, epiRepository, databaseTableRepository, uploadExcelProvider) {
        this.excelProvider = excelProvider;
        this.epiRepository = epiRepository;
        this.databaseTableRepository = databaseTableRepository;
        this.uploadExcelProvider = uploadExcelProvider;
    }
    async execute(file, userPayloadDto) {
        if (!file)
            throw new common_1.BadRequestException(`file is not available`);
        const buffer = file.buffer;
        const riskWorkbook = workbooks_constant_1.workbooksConstant[workbooks_enum_1.WorkbooksEnum.EPI];
        const system = userPayloadDto.isMaster;
        const companyId = userPayloadDto.targetCompanyId;
        const riskDatabaseTable = await this.databaseTableRepository.findByNameAndCompany(riskWorkbook.name, companyId);
        const allEpi = await this.uploadExcelProvider.getAllData({
            buffer,
            Workbook: riskWorkbook,
            read: readEpis,
            DatabaseTable: riskDatabaseTable,
        });
        console.log('remove duplicates');
        const duplicates = (0, removeDuplicate_1.removeDuplicate)(allEpi, { removeById: 'ca' });
        console.log('reduce');
        const arr = duplicates.reduce((acc, epi, index) => {
            const i = Math.floor(index / 1000);
            if (!acc[i])
                acc[i] = [];
            acc[i].push(epi);
            return acc;
        }, []);
        console.log('start');
        await Promise.all(arr.map(async (data) => await this.epiRepository.upsertMany(data)));
        console.log('done');
        return await this.uploadExcelProvider.newTableData({
            findAll: (sheet) => (0, findAllEpis_1.findAllEpis)(this.excelProvider, this.epiRepository, sheet),
            Workbook: riskWorkbook,
            system,
            companyId,
            DatabaseTable: riskDatabaseTable,
        });
    }
};
UploadEpiDataService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ExcelProvider_1.ExcelProvider,
        EpiRepository_1.EpiRepository,
        DatabaseTableRepository_1.DatabaseTableRepository,
        uploadExcelProvider_1.UploadExcelProvider])
], UploadEpiDataService);
exports.UploadEpiDataService = UploadEpiDataService;
const readEpis = async (readFileData, excelProvider, epiSheet, databaseTable) => {
    const episTable = readFileData.find((data) => data.name === epiSheet.name);
    if (!episTable)
        throw new common_1.BadRequestException(`The table you trying to insert has a different sheet name: ${readFileData.join(', ')} than the expected: ${epiSheet.name}`);
    const epiDatabase = await excelProvider.transformToTableData(episTable, epiSheet.columns);
    if ((databaseTable === null || databaseTable === void 0 ? void 0 : databaseTable.version) && epiDatabase.version !== databaseTable.version)
        throw new common_1.BadRequestException('The table you trying to insert has a different version, make sure you have the newest table version');
    return epiDatabase.rows;
};
//# sourceMappingURL=upload-epi-data.service.js.map