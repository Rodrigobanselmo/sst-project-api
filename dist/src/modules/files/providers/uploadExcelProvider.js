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
exports.UploadExcelProvider = void 0;
const common_1 = require("@nestjs/common");
const ExcelProvider_1 = require("../../../shared/providers/ExcelProvider/implementations/ExcelProvider");
const number_sort_1 = require("../../../shared/utils/sorts/number.sort");
const DatabaseTableRepository_1 = require("../repositories/implementations/DatabaseTableRepository");
let UploadExcelProvider = class UploadExcelProvider {
    constructor(databaseTableRepository, excelProvider) {
        this.databaseTableRepository = databaseTableRepository;
        this.excelProvider = excelProvider;
    }
    async getAllData({ buffer, Workbook, read, DatabaseTable }) {
        const readFileData = await this.excelProvider.read(buffer);
        const allSeparatedArray = await Promise.all(Object.values(Workbook.sheets).map(async (sheet) => {
            return await read(readFileData, this.excelProvider, sheet, DatabaseTable);
        }));
        const allData = [];
        allSeparatedArray.forEach((data) => {
            allData.push(...data);
        });
        return allData;
    }
    async newTableData({ findAll, Workbook, system, companyId, DatabaseTable }) {
        const allSheets = await Promise.all(Object.values(Workbook.sheets)
            .sort((a, b) => (0, number_sort_1.sortNumber)(a, b, 'id'))
            .map(async (sheet) => {
            return await findAll(sheet);
        }));
        const databaseTable = await this.databaseTableRepository.upsert({
            name: Workbook.name,
            companyId,
            version: DatabaseTable.version ? Number(DatabaseTable.version) + 1 : 1,
        }, companyId, system, DatabaseTable.id);
        const newExcelFile = await this.excelProvider.create({
            fileName: Workbook.name,
            version: databaseTable.version,
            lastUpdate: new Date(databaseTable.updated_at),
            sheets: allSheets,
        });
        return newExcelFile;
    }
};
UploadExcelProvider = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [DatabaseTableRepository_1.DatabaseTableRepository,
        ExcelProvider_1.ExcelProvider])
], UploadExcelProvider);
exports.UploadExcelProvider = UploadExcelProvider;
//# sourceMappingURL=uploadExcelProvider.js.map