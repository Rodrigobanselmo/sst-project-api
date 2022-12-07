import { PdfGuideDataService } from './services/pdf/guide/guide-data.service';
import { Module } from '@nestjs/common';
import { AmazonStorageProvider } from '../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider';

import { ExcelProvider } from '../../shared/providers/ExcelProvider/implementations/ExcelProvider';
import { SSTModule } from '../sst/sst.module';
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
import { PdfKitDataService } from './services/pdf/kit/kit-data.service';
import { PdfAsoDataService } from './services/pdf/aso/aso-data.service';
import { PdfProntuarioDataService } from './services/pdf/prontuario/prontuario-data.service';
import { PdfOsDataService } from './services/pdf/os/os-data.service';
// import { DocumentsBaseController } from './controller/doc.controller';

@Module({
  controllers: [DocumentsPgrController, DocumentsPdfController, DocumentsPcmsoController],
  imports: [SSTModule, CompanyModule, UsersModule],
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
    PdfKitDataService,
    PdfAsoDataService,
    PdfProntuarioDataService,
    PdfOsDataService,
    // DocumentsBaseController,
  ],
})
export class DocumentsModule {}
