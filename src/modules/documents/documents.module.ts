import { PdfGuideDataService } from './services/pdf/guide/guide-data.service';
import { Module } from '@nestjs/common';
import { AmazonStorageProvider } from '../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider';

import { ExcelProvider } from '../../shared/providers/ExcelProvider/implementations/ExcelProvider';
import { ChecklistModule } from '../checklist/checklist.module';
import { CompanyModule } from '../company/company.module';
import { DocumentsPgrController } from './controller/pgr.controller';
import { DownloadDocumentService } from './services/pgr/document/download-doc.service';
import { PgrUploadService } from './services/pgr/document/upload-pgr-doc.service';
import { PgrDownloadTableService } from './services/pgr/tables/download-pgr-table.service';
import { PgrUploadTableService } from './services/pgr/tables/upload-pgr-table.service';
import { DayJSProvider } from '../../shared/providers/DateProvider/implementations/DayJSProvider';
import { UsersModule } from '../users/users.module';
import { DownloadAttachmentsService } from './services/pgr/document/download-attachment-doc.service';
import { AddQueueDocumentService } from './services/pgr/document/add-queue-doc.service';
import { PgrConsumer } from './consumers/document/documents.consumer';
import { PgrActionPlanUploadTableService } from './services/pgr/action-plan/upload-action-plan-table.service';
import { DocumentsPdfController } from './controller/pdf.controller';
import { PcmsoUploadService } from './services/pgr/document/upload-pcmso-doc.service';
import { DocumentsPcmsoController } from './controller/pcmso.controller';
// import { DocumentsBaseController } from './controller/doc.controller';

@Module({
  controllers: [
    DocumentsPgrController,
    DocumentsPdfController,
    DocumentsPcmsoController,
  ],
  imports: [ChecklistModule, CompanyModule, UsersModule],
  providers: [
    ExcelProvider,
    DownloadDocumentService,
    PgrUploadService,
    PgrDownloadTableService,
    PgrUploadTableService,
    DayJSProvider,
    AmazonStorageProvider,
    DownloadAttachmentsService,
    AddQueueDocumentService,
    PgrConsumer,
    PgrActionPlanUploadTableService,
    PdfGuideDataService,
    PcmsoUploadService,
    // DocumentsBaseController,
  ],
})
export class DocumentsModule {}
