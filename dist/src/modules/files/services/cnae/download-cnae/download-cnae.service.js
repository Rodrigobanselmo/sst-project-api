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
exports.DownloadCnaeService = void 0;
const common_1 = require("@nestjs/common");
const findAllCnae_1 = require("../../../utils/findAllCnae");
const workbooks_constant_1 = require("../../../../../shared/constants/workbooks/workbooks.constant");
const workbooks_enum_1 = require("../../../../../shared/constants/workbooks/workbooks.enum");
const ExcelProvider_1 = require("../../../../../shared/providers/ExcelProvider/implementations/ExcelProvider");
const donwlodExcelProvider_1 = require("../../../providers/donwlodExcelProvider");
const ActivityRepository_1 = require("../../../../company/repositories/implementations/ActivityRepository");
let DownloadCnaeService = class DownloadCnaeService {
    constructor(excelProvider, activityRepository, downloadExcelProvider) {
        this.excelProvider = excelProvider;
        this.activityRepository = activityRepository;
        this.downloadExcelProvider = downloadExcelProvider;
    }
    async execute(userPayloadDto) {
        const Workbook = workbooks_constant_1.workbooksConstant[workbooks_enum_1.WorkbooksEnum.CNAE];
        const companyId = userPayloadDto.targetCompanyId;
        return this.downloadExcelProvider.newTableData({
            findAll: (sheet) => (0, findAllCnae_1.findAllCnaes)(this.excelProvider, this.activityRepository, sheet),
            Workbook,
            companyId,
        });
    }
};
DownloadCnaeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ExcelProvider_1.ExcelProvider,
        ActivityRepository_1.ActivityRepository,
        donwlodExcelProvider_1.DownloadExcelProvider])
], DownloadCnaeService);
exports.DownloadCnaeService = DownloadCnaeService;
//# sourceMappingURL=download-cnae.service.js.map