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
exports.UploadCidDataService = void 0;
const findAllCids_1 = require("./../../../utils/findAllCids");
const errorMessage_1 = require("../../../../../shared/constants/enum/errorMessage");
const CidRepository_1 = require("../../../../company/repositories/implementations/CidRepository");
const common_1 = require("@nestjs/common");
const removeDuplicate_1 = require("../../../../../shared/utils/removeDuplicate");
const workbooks_constant_1 = require("../../../../../shared/constants/workbooks/workbooks.constant");
const workbooks_enum_1 = require("../../../../../shared/constants/workbooks/workbooks.enum");
const ExcelProvider_1 = require("../../../../../shared/providers/ExcelProvider/implementations/ExcelProvider");
const uploadExcelProvider_1 = require("../../../providers/uploadExcelProvider");
const DatabaseTableRepository_1 = require("../../../repositories/implementations/DatabaseTableRepository");
let UploadCidDataService = class UploadCidDataService {
    constructor(excelProvider, cidRepo, databaseTableRepository, uploadExcelProvider) {
        this.excelProvider = excelProvider;
        this.cidRepo = cidRepo;
        this.databaseTableRepository = databaseTableRepository;
        this.uploadExcelProvider = uploadExcelProvider;
    }
    async execute(file, userPayloadDto) {
        if (!file)
            throw new common_1.BadRequestException(`file is not available`);
        const buffer = file.buffer;
        const riskWorkbook = workbooks_constant_1.workbooksConstant[workbooks_enum_1.WorkbooksEnum.CID];
        const system = userPayloadDto.isSystem;
        const companyId = userPayloadDto.targetCompanyId;
        const riskDatabaseTable = await this.databaseTableRepository.findByNameAndCompany(riskWorkbook.name, companyId);
        const allCid = await this.uploadExcelProvider.getAllData({
            buffer,
            Workbook: riskWorkbook,
            read: readCids,
            DatabaseTable: riskDatabaseTable,
        });
        console.log('remove duplicates');
        const duplicates = (0, removeDuplicate_1.removeDuplicate)(allCid, { removeById: 'code' });
        console.log('reduce');
        const arr = duplicates.reduce((acc, cid, index) => {
            const i = Math.floor(index / 500);
            if (!acc[i])
                acc[i] = [];
            acc[i].push(cid);
            return acc;
        }, []);
        console.log('start');
        await Promise.all(arr.map(async (data) => await this.cidRepo.upsertMany(data)));
        console.log('done');
        return await this.uploadExcelProvider.newTableData({
            findAll: (sheet) => (0, findAllCids_1.findAllCids)(this.excelProvider, this.cidRepo, sheet),
            Workbook: riskWorkbook,
            system,
            companyId,
            DatabaseTable: riskDatabaseTable,
        });
    }
};
UploadCidDataService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ExcelProvider_1.ExcelProvider,
        CidRepository_1.CidRepository,
        DatabaseTableRepository_1.DatabaseTableRepository,
        uploadExcelProvider_1.UploadExcelProvider])
], UploadCidDataService);
exports.UploadCidDataService = UploadCidDataService;
const readCids = async (readFileData, excelProvider, cidSheet, databaseTable) => {
    const cidsTable = readFileData.find((data) => data.name === cidSheet.name);
    if (!cidsTable)
        throw new common_1.BadRequestException(errorMessage_1.ErrorFilesEnum.WRONG_TABLE_SHEET.replace('??FOUND??', readFileData.join(', ')).replace('??EXPECTED??', cidSheet.name));
    const cidDatabase = await excelProvider.transformToTableData(cidsTable, cidSheet.columns);
    if ((databaseTable === null || databaseTable === void 0 ? void 0 : databaseTable.version) && cidDatabase.version !== databaseTable.version)
        throw new common_1.BadRequestException(errorMessage_1.ErrorFilesEnum.WRONG_TABLE_VERSION);
    return cidDatabase.rows;
};
//# sourceMappingURL=upload-cid.service.js.map