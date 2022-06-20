"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentsModule = void 0;
const common_1 = require("@nestjs/common");
const AmazonStorageProvider_1 = require("../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider");
const ExcelProvider_1 = require("../../shared/providers/ExcelProvider/implementations/ExcelProvider");
const checklist_module_1 = require("../checklist/checklist.module");
const company_module_1 = require("../company/company.module");
const documents_controller_1 = require("./controller/documents.controller");
const download_pgr_doc_service_1 = require("./services/pgr/document/download-pgr-doc.service");
const upload_pgr_doc_service_1 = require("./services/pgr/document/upload-pgr-doc.service");
const download_pgr_table_service_1 = require("./services/pgr/tables/download-pgr-table.service");
const upload_pgr_table_service_1 = require("./services/pgr/tables/upload-pgr-table.service");
let DocumentsModule = class DocumentsModule {
};
DocumentsModule = __decorate([
    (0, common_1.Module)({
        controllers: [documents_controller_1.DocumentsController],
        imports: [checklist_module_1.ChecklistModule, company_module_1.CompanyModule],
        providers: [
            ExcelProvider_1.ExcelProvider,
            download_pgr_doc_service_1.PgrDownloadService,
            upload_pgr_doc_service_1.PgrUploadService,
            download_pgr_table_service_1.PgrDownloadTableService,
            upload_pgr_table_service_1.PgrUploadTableService,
            AmazonStorageProvider_1.AmazonStorageProvider,
        ],
    })
], DocumentsModule);
exports.DocumentsModule = DocumentsModule;
//# sourceMappingURL=documents.module.js.map