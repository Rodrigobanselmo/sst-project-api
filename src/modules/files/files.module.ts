import { DownaldRiskModelFactory } from './factories/report/products/DownaldRiskModelFactory';
import { DayJSProvider } from '../../shared/providers/DateProvider/implementations/DayJSProvider';
import { Module } from '@nestjs/common';
import { ExcelProvider } from '../../shared/providers/ExcelProvider/implementations/ExcelProvider';
import { SSTModule } from '../sst/sst.module';
import { FilesChecklistController } from './controller/managment/files-checklist.controller';
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
import { EpiRepository } from '../sst/repositories/implementations/EpiRepository';
import { WorkspaceRepository } from '../company/repositories/implementations/WorkspaceRepository';
import { DownloadEmployeesService } from './services/company/download-employees/download-employees.service';
import { UploadEmployeesService } from './services/company/upload-employees/upload-employees.service';
import { UploadHierarchiesService } from './services/company/upload-hierarchies/upload-hierarchies.service';
import { DownloadHierarchiesService } from './services/company/download-hierarchies/download-hierarchies.service';
import { DownloadCnaeService } from './services/cnae/download-cnae/download-cnae.service';
import { UploadCnaeDataService } from './services/cnae/upload-cnae/upload-cnae.service';
import { FilesCnaeController } from './controller/cnae/files-cnae.controller';
import { UploadCidDataService } from './services/cid/upload-cid/upload-cid.service';
import { DownloadCidService } from './services/cid/download-cid/download-cid.service';
import { FilesCidController } from './controller/cid/files-cid.controller';
import { ReportClinicFactory } from './factories/report/products/ReportClinicFactory';
import { ReportExpiredExamFactory } from './factories/report/products/ReportExpiredExamFactory';
import { ClinicReportService } from './services/reports/clinic-report/clinic-report.service';
import { ReportsController } from './controller/reports/reports.controller';
import { ExpiredExamReportService } from './services/reports/expired-exam-report/expired-exam-report.service';
import { ReportDoneExamFactory } from './factories/report/products/ReportDoneExamFactory';
import { DoneExamReportService } from './services/reports/done-exam-report/done-exam-report.service';
import { FileCompanyStructureFactory } from './factories/upload/products/CompanyStructure/FileCompanyStructureFactory';
import { UploadCompanyStructureService } from './services/company/upload-structure/upload-structure.service';
import { HierarchyExcelProvider } from './providers/HierarchyExcelProvider';
import { FileHelperProvider } from './providers/FileHelperProvider';
import { ReportRiskStructureFactory } from './factories/report/products/ReportRiskStructureFactory';
import { RiskStructureReportService } from './services/reports/risk-structure-report/risk-structure-report.service';
import { DownaldEmployeeModelFactory } from './factories/report/products/DownaldEmployeeModelFactory';
import { ModelsUploadsController } from './controller/models/models.controller';
import { ReportExpiredComplementaryExamFactory } from './factories/report/products/ReportExpiredComplementaryExamFactory';
import { ExamComplementaryReportService } from './services/reports/exam-complementary-report/exam-complementary-report.service';
import { EmployeeReportService } from './services/reports/employee-report/employee-report.service';
import { EmployeeRepository } from '../company/repositories/implementations/EmployeeRepository';
import { ReportEmployeeModelFactory } from './factories/report/products/ReportEmployeeFactory';
import { DocumentsModule } from '../documents/documents.module';
import { ReportRiskStructureRsDataFactory } from './factories/report/products/ReportRiskStructureRsData/ReportRiskStructureFactory.rsdata';

@Module({
  controllers: [FilesChecklistController, ModelsUploadsController, ReportsController, FilesCompanyController, FilesCnaeController, FilesController, FilesCidController],
  imports: [SSTModule, CompanyModule, DocumentsModule],
  providers: [
    DayJSProvider,
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
    DownloadCnaeService,
    UploadCnaeDataService,
    DownloadCidService,
    UploadCidDataService,
    ReportClinicFactory,
    ClinicReportService,
    DoneExamReportService,
    ExpiredExamReportService,
    ReportExpiredExamFactory,
    ReportDoneExamFactory,
    FileCompanyStructureFactory,
    UploadCompanyStructureService,
    HierarchyExcelProvider,
    FileHelperProvider,
    ReportRiskStructureFactory,
    ReportRiskStructureRsDataFactory,
    RiskStructureReportService,
    DownaldRiskModelFactory,
    DownaldEmployeeModelFactory,
    ReportExpiredComplementaryExamFactory,
    ExamComplementaryReportService,
    EmployeeReportService,
    EmployeeRepository,
    ReportEmployeeModelFactory,
  ],
})
export class FilesModule { }
