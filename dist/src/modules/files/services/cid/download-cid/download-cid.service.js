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
exports.DownloadCidService = void 0;
const common_1 = require("@nestjs/common");
const workbooks_constant_1 = require("../../../../../shared/constants/workbooks/workbooks.constant");
const workbooks_enum_1 = require("../../../../../shared/constants/workbooks/workbooks.enum");
const ExcelProvider_1 = require("../../../../../shared/providers/ExcelProvider/implementations/ExcelProvider");
const CidRepository_1 = require("../../../../company/repositories/implementations/CidRepository");
const donwlodExcelProvider_1 = require("../../../providers/donwlodExcelProvider");
const findAllCids_1 = require("./../../../utils/findAllCids");
let DownloadCidService = class DownloadCidService {
    constructor(excelProvider, cidRepository, downloadExcelProvider) {
        this.excelProvider = excelProvider;
        this.cidRepository = cidRepository;
        this.downloadExcelProvider = downloadExcelProvider;
    }
    async execute(userPayloadDto) {
        const Workbook = workbooks_constant_1.workbooksConstant[workbooks_enum_1.WorkbooksEnum.CID];
        const companyId = userPayloadDto.targetCompanyId;
        return this.downloadExcelProvider.newTableData({
            findAll: (sheet) => (0, findAllCids_1.findAllCids)(this.excelProvider, this.cidRepository, sheet),
            Workbook,
            companyId,
        });
    }
};
DownloadCidService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ExcelProvider_1.ExcelProvider,
        CidRepository_1.CidRepository,
        donwlodExcelProvider_1.DownloadExcelProvider])
], DownloadCidService);
exports.DownloadCidService = DownloadCidService;
//# sourceMappingURL=download-cid.service.js.map