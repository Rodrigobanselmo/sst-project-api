import { PdfGuideDataService } from './services/pdf/guide/guide-data.service';
import { Module } from '@nestjs/common';
import { AmazonStorageProvider } from '../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider';

import { ExcelProvider } from '../../shared/providers/ExcelProvider/implementations/ExcelProvider';
import { SSTModule } from '../sst/sst.module';
import { CompanyModule } from '../company/company.module';
import { DocumentsPgrController } from './controller/pgr.controller';
import { DownloadDocumentService } from './services/document/document/download-doc.service';
import { PgrUploadService } from './services/document/document/upload-pgr-doc.service';
import { PgrDownloadTableService } from './services/document/tables/download-pgr-table.service';
import { DayJSProvider } from '../../shared/providers/DateProvider/implementations/DayJSProvider';
import { UsersModule } from '../users/users.module';
import { DownloadAttachmentsService } from './services/document/document/download-attachment-doc.service';
import { AddQueueDocumentService } from './services/document/document/add-queue-doc.service';
import { PgrConsumer } from './consumers/document/documents.consumer';
import { PgrActionPlanUploadTableService } from './services/document/action-plan/upload-action-plan-table.service';
import { DocumentsPdfController } from './controller/pdf.controller';
import { PcmsoUploadService } from './services/document/document/upload-pcmso-doc.service';
import { PdfKitDataService } from './services/pdf/kit/kit-data.service';
import { PdfAsoDataService } from './services/pdf/aso/aso-data.service';
import { PdfProntuarioDataService } from './services/pdf/prontuario/prontuario-data.service';
import { PdfOsDataService } from './services/pdf/os/os-data.service';
import { PdfEvaluationDataService } from './services/pdf/evaluation/evaluation-data.service';
import { DocumentPGRFactory } from './factories/document/products/PGR/DocumentPGRFactory';
import { DocumentsBaseController } from './controller/doc.controller';
import { GetDocVariablesService } from './services/document/document/get-doc-variables.service';

@Module({
  controllers: [DocumentsPgrController, DocumentsPdfController, DocumentsBaseController],
  imports: [SSTModule, CompanyModule, UsersModule],
  providers: [
    ExcelProvider,
    DownloadDocumentService,
    PgrUploadService,
    PgrDownloadTableService,
    DayJSProvider,
    AmazonStorageProvider,
    DownloadAttachmentsService,
    AddQueueDocumentService,
    PgrConsumer,
    PgrActionPlanUploadTableService,
    PdfGuideDataService,
    PcmsoUploadService,
    PdfKitDataService,
    PdfAsoDataService,
    PdfProntuarioDataService,
    PdfOsDataService,
    PdfEvaluationDataService,
    DocumentPGRFactory,
    GetDocVariablesService,
  ],
})
export class DocumentsModule {}
