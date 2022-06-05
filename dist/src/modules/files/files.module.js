"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilesModule = void 0;
const common_1 = require("@nestjs/common");
const ExcelProvider_1 = require("../../shared/providers/ExcelProvider/implementations/ExcelProvider");
const checklist_module_1 = require("../checklist/checklist.module");
const files_checklist_controller_1 = require("./controller/checklist/files-checklist.controller");
const DatabaseTableRepository_1 = require("./repositories/implementations/DatabaseTableRepository");
const upload_risk_data_service_1 = require("./services/checklist/upload-risk-data/upload-risk-data.service");
const download_risk_data_service_1 = require("./services/checklist/download-risk-data/download-risk-data.service");
const upload_companies_service_1 = require("./services/company/upload-companies/upload-companies.service");
const download_companies_service_1 = require("./services/company/download-companies/download-companies.service");
const files_company_controller_1 = require("./controller/company/files-company.controller");
const files_controller_1 = require("./controller/files.controller");
const company_module_1 = require("../company/company.module");
const uploadExcelProvider_1 = require("./providers/uploadExcelProvider");
const download_unique_company_service_1 = require("./services/company/download-unique-company/download-unique-company.service");
const upload_unique_company_service_1 = require("./services/company/upload-unique-company/upload-unique-company.service");
const donwlodExcelProvider_1 = require("./providers/donwlodExcelProvider");
const upload_epi_data_service_1 = require("./services/checklist/upload-epi-data/upload-epi-data.service");
const EpiRepository_1 = require("../checklist/repositories/implementations/EpiRepository");
const WorkspaceRepository_1 = require("../company/repositories/implementations/WorkspaceRepository");
const download_employees_service_1 = require("./services/company/download-employees/download-employees.service");
const upload_employees_service_1 = require("./services/company/upload-employees/upload-employees.service");
const upload_hierarchies_service_1 = require("./services/company/upload-hierarchies/upload-hierarchies.service");
const download_hierarchies_service_1 = require("./services/company/download-hierarchies/download-hierarchies.service");
let FilesModule = class FilesModule {
};
FilesModule = __decorate([
    (0, common_1.Module)({
        controllers: [
            files_checklist_controller_1.FilesChecklistController,
            files_company_controller_1.FilesCompanyController,
            files_controller_1.FilesController,
        ],
        imports: [checklist_module_1.ChecklistModule, company_module_1.CompanyModule],
        providers: [
            donwlodExcelProvider_1.DownloadExcelProvider,
            uploadExcelProvider_1.UploadExcelProvider,
            upload_risk_data_service_1.UploadChecklistDataService,
            ExcelProvider_1.ExcelProvider,
            DatabaseTableRepository_1.DatabaseTableRepository,
            download_risk_data_service_1.DownloadRiskDataService,
            upload_companies_service_1.UploadCompaniesService,
            download_companies_service_1.DownloadCompaniesService,
            download_unique_company_service_1.DownloadUniqueCompanyService,
            upload_unique_company_service_1.UploadUniqueCompanyService,
            upload_epi_data_service_1.UploadEpiDataService,
            EpiRepository_1.EpiRepository,
            WorkspaceRepository_1.WorkspaceRepository,
            download_employees_service_1.DownloadEmployeesService,
            upload_employees_service_1.UploadEmployeesService,
            upload_hierarchies_service_1.UploadHierarchiesService,
            download_hierarchies_service_1.DownloadHierarchiesService,
        ],
    })
], FilesModule);
exports.FilesModule = FilesModule;
//# sourceMappingURL=files.module.js.map