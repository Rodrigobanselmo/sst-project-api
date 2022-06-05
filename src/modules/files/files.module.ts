import { Module } from '@nestjs/common';
import { ExcelProvider } from '../../shared/providers/ExcelProvider/implementations/ExcelProvider';
import { ChecklistModule } from '../checklist/checklist.module';
import { FilesChecklistController } from './controller/checklist/files-checklist.controller';
import { DatabaseTableRepository } from './repositories/implementations/DatabaseTableRepository';
import { UploadChecklistDataService } from './services/checklist/upload-risk-data/upload-risk-data.service';
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
import { UploadEpiDataService } from './services/checklist/upload-epi-data/upload-epi-data.service';
import { EpiRepository } from '../checklist/repositories/implementations/EpiRepository';
import { WorkspaceRepository } from '../company/repositories/implementations/WorkspaceRepository';
import { DownloadEmployeesService } from './services/company/download-employees/download-employees.service';
import { UploadEmployeesService } from './services/company/upload-employees/upload-employees.service';
import { UploadHierarchiesService } from './services/company/upload-hierarchies/upload-hierarchies.service';
import { DownloadHierarchiesService } from './services/company/download-hierarchies/download-hierarchies.service';

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
    UploadEpiDataService,
    EpiRepository,
    WorkspaceRepository,
    DownloadEmployeesService,
    UploadEmployeesService,
    UploadHierarchiesService,
    DownloadHierarchiesService,
  ],
})
export class FilesModule {}
