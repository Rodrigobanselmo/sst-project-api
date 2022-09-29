import { PdfGuideDataService } from './services/pdf/guide/guide-data.service';
import { Module } from '@nestjs/common';
import { AmazonStorageProvider } from '../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider';

import { ExcelProvider } from '../../shared/providers/ExcelProvider/implementations/ExcelProvider';
import { ChecklistModule } from '../checklist/checklist.module';
import { CompanyModule } from '../company/company.module';
import { DocumentsPgrController } from './controller/pgr.controller';
import { PgrDownloadService } from './services/pgr/document/download-pgr-doc.service';
import { PgrUploadService } from './services/pgr/document/upload-pgr-doc.service';
import { PgrDownloadTableService } from './services/pgr/tables/download-pgr-table.service';
import { PgrUploadTableService } from './services/pgr/tables/upload-pgr-table.service';
import { DayJSProvider } from '../../shared/providers/DateProvider/implementations/DayJSProvider';
import { UsersModule } from '../users/users.module';
import { PgrDownloadAttachmentsService } from './services/pgr/document/download-pgr-attachment-doc.service';
import { AddQueuePGRDocumentService } from './services/pgr/document/add-queue-pgr-doc.service';
import { PgrConsumer } from './consumers/pgr/documents.consumer';
import { PgrActionPlanUploadTableService } from './services/pgr/action-plan/upload-action-plan-table.service';
import { DocumentsPdfController } from './controller/pdf.controller';

@Module({
  controllers: [DocumentsPgrController, DocumentsPdfController],
  imports: [ChecklistModule, CompanyModule, UsersModule],
  providers: [
    ExcelProvider,
    PgrDownloadService,
    PgrUploadService,
    PgrDownloadTableService,
    PgrUploadTableService,
    DayJSProvider,
    AmazonStorageProvider,
    PgrDownloadAttachmentsService,
    AddQueuePGRDocumentService,
    PgrConsumer,
    PgrActionPlanUploadTableService,
    PdfGuideDataService,
  ],
})
export class DocumentsModule {}
