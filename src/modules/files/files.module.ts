import { Module } from '@nestjs/common';
import { ExcelProvider } from '../../shared/providers/ExcelProvider/implementations/ExcelProvider';
import { ChecklistModule } from '../checklist/checklist.module';
import { FilesChecklistController } from './controller/checklist/files-checklist.controller';
import { DatabaseTableRepository } from './repositories/implementations/DatabaseTableRepository';
import { UploadChecklistDataService } from './services/checklist/upload-checklist-data/upload-checklist-data.service';
import { DownloadRiskDataService } from './services/checklist/download-risk-data/download-risk-data.service';
import { UploadCompaniesService } from './services/company/upload-companies/upload-companies.service';
import { DownloadCompaniesService } from './services/company/download-companies/download-companies.service';
import { FilesCompanyController } from './controller/company/files-company.controller';
import { FilesController } from './controller/files.controller';
import { CompanyModule } from '../company/company.module';
import { UploadExcelProvider } from './providers/uploadExcelProvider';
import { DownloadUniqueCompanyService } from './services/company/download-unique-company/download-unique-company.service';
import { UploadUniqueCompanyService } from './services/company/upload-unique-company/upload-unique-company.service';
import { DownloadExcelProvider } from './providers/donwlodExcelProvider';

@Module({
  controllers: [
    FilesChecklistController,
    FilesCompanyController,
    FilesController,
  ],
  imports: [ChecklistModule, CompanyModule],
  providers: [
    DownloadExcelProvider,
    UploadExcelProvider,
    UploadChecklistDataService,
    ExcelProvider,
    DatabaseTableRepository,
    DownloadRiskDataService,
    UploadCompaniesService,
    DownloadCompaniesService,
    DownloadUniqueCompanyService,
    UploadUniqueCompanyService,
  ],
})
export class FilesModule {}
