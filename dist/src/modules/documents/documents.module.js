"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentsModule = void 0;
const guide_data_service_1 = require("./services/pdf/guide/guide-data.service");
const common_1 = require("@nestjs/common");
const AmazonStorageProvider_1 = require("../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider");
const ExcelProvider_1 = require("../../shared/providers/ExcelProvider/implementations/ExcelProvider");
const sst_module_1 = require("../sst/sst.module");
const company_module_1 = require("../company/company.module");
const pgr_controller_1 = require("./controller/pgr.controller");
const download_doc_service_1 = require("./services/pgr/document/download-doc.service");
const upload_pgr_doc_service_1 = require("./services/pgr/document/upload-pgr-doc.service");
const download_pgr_table_service_1 = require("./services/pgr/tables/download-pgr-table.service");
const upload_pgr_table_service_1 = require("./services/pgr/tables/upload-pgr-table.service");
const DayJSProvider_1 = require("../../shared/providers/DateProvider/implementations/DayJSProvider");
const users_module_1 = require("../users/users.module");
const download_attachment_doc_service_1 = require("./services/pgr/document/download-attachment-doc.service");
const add_queue_doc_service_1 = require("./services/pgr/document/add-queue-doc.service");
const documents_consumer_1 = require("./consumers/document/documents.consumer");
const upload_action_plan_table_service_1 = require("./services/pgr/action-plan/upload-action-plan-table.service");
const pdf_controller_1 = require("./controller/pdf.controller");
const upload_pcmso_doc_service_1 = require("./services/pgr/document/upload-pcmso-doc.service");
const pcmso_controller_1 = require("./controller/pcmso.controller");
const kit_data_service_1 = require("./services/pdf/kit/kit-data.service");
const aso_data_service_1 = require("./services/pdf/aso/aso-data.service");
const prontuario_data_service_1 = require("./services/pdf/prontuario/prontuario-data.service");
let DocumentsModule = class DocumentsModule {
};
DocumentsModule = __decorate([
    (0, common_1.Module)({
        controllers: [pgr_controller_1.DocumentsPgrController, pdf_controller_1.DocumentsPdfController, pcmso_controller_1.DocumentsPcmsoController],
        imports: [sst_module_1.SSTModule, company_module_1.CompanyModule, users_module_1.UsersModule],
        providers: [
            ExcelProvider_1.ExcelProvider,
            download_doc_service_1.DownloadDocumentService,
            upload_pgr_doc_service_1.PgrUploadService,
            download_pgr_table_service_1.PgrDownloadTableService,
            upload_pgr_table_service_1.PgrUploadTableService,
            DayJSProvider_1.DayJSProvider,
            AmazonStorageProvider_1.AmazonStorageProvider,
            download_attachment_doc_service_1.DownloadAttachmentsService,
            add_queue_doc_service_1.AddQueueDocumentService,
            documents_consumer_1.PgrConsumer,
            upload_action_plan_table_service_1.PgrActionPlanUploadTableService,
            guide_data_service_1.PdfGuideDataService,
            upload_pcmso_doc_service_1.PcmsoUploadService,
            kit_data_service_1.PdfKitDataService,
            aso_data_service_1.PdfAsoDataService,
            prontuario_data_service_1.PdfProntuarioDataService,
        ],
    })
], DocumentsModule);
exports.DocumentsModule = DocumentsModule;
//# sourceMappingURL=documents.module.js.map