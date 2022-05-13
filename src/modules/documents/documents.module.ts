import { Module } from '@nestjs/common';

import { ExcelProvider } from '../../shared/providers/ExcelProvider/implementations/ExcelProvider';
import { ChecklistModule } from '../checklist/checklist.module';
import { CompanyModule } from '../company/company.module';
import { DocumentsController } from './controller/documents.controller';
import { PgrDownloadService } from './services/pgr/download-pgr.service';

@Module({
  controllers: [DocumentsController],
  imports: [ChecklistModule, CompanyModule],
  providers: [ExcelProvider, PgrDownloadService],
})
export class DocumentsModule {}
