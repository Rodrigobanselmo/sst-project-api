import { Module } from '@nestjs/common';
import { AmazonStorageProvider } from '../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider';

import { ExcelProvider } from '../../shared/providers/ExcelProvider/implementations/ExcelProvider';
import { ChecklistModule } from '../checklist/checklist.module';
import { CompanyModule } from '../company/company.module';
import { DocumentsController } from './controller/documents.controller';
import { PgrDownloadService } from './services/pgr/document/download-pgr-doc.service';
import { PgrUploadService } from './services/pgr/document/upload-pgr-doc.service';
import { PgrDownloadTableService } from './services/pgr/tables/download-pgr-table.service';
import { PgrUploadTableService } from './services/pgr/tables/upload-pgr-table.service';

@Module({
  controllers: [DocumentsController],
  imports: [ChecklistModule, CompanyModule],
  providers: [
    ExcelProvider,
    PgrDownloadService,
    PgrUploadService,
    PgrDownloadTableService,
    PgrUploadTableService,
    AmazonStorageProvider,
  ],
})
export class DocumentsModule {}
