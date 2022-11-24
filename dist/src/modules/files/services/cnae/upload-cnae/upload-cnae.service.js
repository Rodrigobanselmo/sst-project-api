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
exports.UploadCnaeDataService = void 0;
const errorMessage_1 = require("./../../../../../shared/constants/enum/errorMessage");
const findAllCnae_1 = require("./../../../utils/findAllCnae");
const ActivityRepository_1 = require("./../../../../company/repositories/implementations/ActivityRepository");
const common_1 = require("@nestjs/common");
const removeDuplicate_1 = require("../../../../../shared/utils/removeDuplicate");
const workbooks_constant_1 = require("../../../../../shared/constants/workbooks/workbooks.constant");
const workbooks_enum_1 = require("../../../../../shared/constants/workbooks/workbooks.enum");
const ExcelProvider_1 = require("../../../../../shared/providers/ExcelProvider/implementations/ExcelProvider");
const uploadExcelProvider_1 = require("../../../providers/uploadExcelProvider");
const DatabaseTableRepository_1 = require("../../../repositories/implementations/DatabaseTableRepository");
let UploadCnaeDataService = class UploadCnaeDataService {
    constructor(excelProvider, activityRepository, databaseTableRepository, uploadExcelProvider) {
        this.excelProvider = excelProvider;
        this.activityRepository = activityRepository;
        this.databaseTableRepository = databaseTableRepository;
        this.uploadExcelProvider = uploadExcelProvider;
    }
    async execute(file, userPayloadDto) {
        if (!file)
            throw new common_1.BadRequestException(`file is not available`);
        const buffer = file.buffer;
        const riskWorkbook = workbooks_constant_1.workbooksConstant[workbooks_enum_1.WorkbooksEnum.CNAE];
        const system = userPayloadDto.isSystem;
        const companyId = userPayloadDto.targetCompanyId;
        const riskDatabaseTable = await this.databaseTableRepository.findByNameAndCompany(riskWorkbook.name, companyId);
        const allCnae = await this.uploadExcelProvider.getAllData({
            buffer,
            Workbook: riskWorkbook,
            read: readCnaes,
            DatabaseTable: riskDatabaseTable,
        });
        console.log('remove duplicates');
        const duplicates = (0, removeDuplicate_1.removeDuplicate)(allCnae, { removeById: 'code' });
        console.log('reduce');
        const arr = duplicates.reduce((acc, cnae, index) => {
            const i = Math.floor(index / 500);
            if (!acc[i])
                acc[i] = [];
            acc[i].push(cnae);
            return acc;
        }, []);
        console.log('start');
        await Promise.all(arr.map(async (data) => await this.activityRepository.upsertMany(data)));
        console.log('done');
        return await this.uploadExcelProvider.newTableData({
            findAll: (sheet) => (0, findAllCnae_1.findAllCnaes)(this.excelProvider, this.activityRepository, sheet),
            Workbook: riskWorkbook,
            system,
            companyId,
            DatabaseTable: riskDatabaseTable,
        });
    }
};
UploadCnaeDataService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ExcelProvider_1.ExcelProvider,
        ActivityRepository_1.ActivityRepository,
        DatabaseTableRepository_1.DatabaseTableRepository,
        uploadExcelProvider_1.UploadExcelProvider])
], UploadCnaeDataService);
exports.UploadCnaeDataService = UploadCnaeDataService;
const readCnaes = async (readFileData, excelProvider, cnaeSheet, databaseTable) => {
    const cnaesTable = readFileData.find((data) => data.name === cnaeSheet.name);
    if (!cnaesTable)
        throw new common_1.BadRequestException(errorMessage_1.ErrorFilesEnum.WRONG_TABLE_SHEET.replace('??FOUND??', readFileData.join(', ')).replace('??EXPECTED??', cnaeSheet.name));
    const cnaeDatabase = await excelProvider.transformToTableData(cnaesTable, cnaeSheet.columns);
    if ((databaseTable === null || databaseTable === void 0 ? void 0 : databaseTable.version) && cnaeDatabase.version !== databaseTable.version)
        throw new common_1.BadRequestException(errorMessage_1.ErrorFilesEnum.WRONG_TABLE_VERSION);
    return cnaeDatabase.rows;
};
//# sourceMappingURL=upload-cnae.service.js.map