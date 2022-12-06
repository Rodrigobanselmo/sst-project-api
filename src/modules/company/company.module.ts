import { UpdateCompaniesReportCron } from './crons/employee-exam/employee-exam.cron';
import { DeleteExamFileService } from './services/employee/0-history/exams/delete-exam-file/delete-exam-file.service';
import { DownloadExamService } from './services/employee/0-history/exams/download-exam/download-exam.service';
import { UploadExamFileService } from './services/employee/0-history/exams/upload-exam-file/upload-exam-file.service';
import { UpdateManyScheduleExamHistoryService } from './services/employee/0-history/exams/update-many/update-many.service';
import { Module, forwardRef } from '@nestjs/common';

import { ExcelProvider } from '../../shared/providers/ExcelProvider/implementations/ExcelProvider';
import { AmazonStorageProvider } from '../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider';
import { RiskGroupDataRepository } from '../sst/repositories/implementations/RiskGroupDataRepository';
import { CharacterizationController } from './controller/characterization/characterization.controller';
import { CompanyController } from './controller/company/company.controller';
import { EmployeeController } from './controller/employee/employee.controller';
import { EnvironmentController } from './controller/environment/environment.controller';
import { HierarchyController } from './controller/hierarchy/hierarchy.controller';
import { HomoGroupsController } from './controller/HomoGroups/HomoGroups.controller';
import { ActivityRepository } from './repositories/implementations/ActivityRepository';
import { CharacterizationPhotoRepository } from './repositories/implementations/CharacterizationPhotoRepository';
import { CharacterizationRepository } from './repositories/implementations/CharacterizationRepository';
import { CompanyRepository } from './repositories/implementations/CompanyRepository';
import { EmployeeRepository } from './repositories/implementations/EmployeeRepository';
import { CompanyClinicRepository } from './repositories/implementations/CompanyClinicRepository';
import { EnvironmentPhotoRepository } from './repositories/implementations/EnvironmentPhotoRepository';
import { EnvironmentRepository } from './repositories/implementations/EnvironmentRepository';
import { HierarchyRepository } from './repositories/implementations/HierarchyRepository';
import { HomoGroupRepository } from './repositories/implementations/HomoGroupRepository';
import { LicenseRepository } from './repositories/implementations/LicenseRepository';
import { WorkspaceRepository } from './repositories/implementations/WorkspaceRepository';
import { AddCharacterizationPhotoService } from './services/characterization/add-characterization-photo/add-characterization-photo.service';
import { DeleteCharacterizationPhotoService } from './services/characterization/delete-characterization-photo/delete-characterization-photo.service';
import { DeleteCharacterizationService } from './services/characterization/delete-characterization/delete-characterization.service';
import { FindAllCharacterizationService } from './services/characterization/find-all-characterization/find-all-characterization.service';
import { FindByIdCharacterizationService } from './services/characterization/find-by-id-characterization/find-by-id-characterization.service';
import { UpsertCharacterizationService } from './services/characterization/upsert-characterization/upsert-characterization.service';
import { AddCompanyPhotoService } from './services/company/add-company-photo/add-company-photo.service';
import { CopyCompanyService } from './services/company/copy-company/copy-company.service';
import { CreateCompanyService } from './services/company/create-company/create-company.service';
import { CreateContractService } from './services/company/create-contract/create-contract.service';
import { FindAllCompaniesService } from './services/company/find-all-companies/find-all-companies.service';
import { FindCepService } from './services/company/find-cep/find-cep.service';
import { FindCnpjService } from './services/company/find-cnpj/find-cnpj.service';
import { FindCompanyService } from './services/company/find-company/find-company.service';
import { UpdateCompanyService } from './services/company/update-company/update-company.service';
import { CreateEmployeeService } from './services/employee/create-employee/create-employee.service';
import { FindAllAvailableEmployeesService } from './services/employee/find-all-available-employees/find-all-available-employees.service';
import { FindEmployeeService } from './services/employee/find-employee/find-employee.service';
import { UpdateEmployeeService } from './services/employee/update-employee/update-employee.service';
import { AddEnvironmentPhotoService } from './services/environment/add-environment-photo/add-environment-photo.service';
import { DeleteEnvironmentPhotoService } from './services/environment/delete-environment-photo/delete-environment-photo.service';
import { DeleteEnvironmentService } from './services/environment/delete-environment/delete-environment.service';
import { FindAllEnvironmentService } from './services/environment/find-all-environment/find-all-environment.service';
import { FindByIdEnvironmentService } from './services/environment/find-by-id-environment/find-by-id-environment.service';
import { UpsertEnvironmentService } from './services/environment/upsert-environment/upsert-environment.service';
import { FindHierarchyService } from './services/hierarchy/find-hierarchy/find-hierarchy.service';
import { CreateHierarchyService } from './services/hierarchy/create-hierarchies/create-hierarchies.service';
import { DeleteHierarchyService } from './services/hierarchy/delete-hierarchies/delete-hierarchies.service';
import { FindAllHierarchyService } from './services/hierarchy/find-all-hierarchies/find-all-hierarchies.service';
import { UpdateHierarchyService } from './services/hierarchy/update-hierarchies/update-hierarchies.service';
import { UpsertManyHierarchyService } from './services/hierarchy/upsert-many-hierarchies/upsert-many-hierarchies.service';
import { CreateHomoGroupService } from './services/homoGroup/create-homo-group/create-homo-group.service';
import { DeleteHomoGroupService } from './services/homoGroup/delete-homo-group/delete-homo-group.service';
import { FindByCompanyHomoGroupService } from './services/homoGroup/find-by-company-homo-group/find-by-company-homo-group.service';
import { UpdateHomoGroupService } from './services/homoGroup/update-homo-group/update-homo-group.service';
import { UpdateEnvironmentPhotoService } from './services/environment/update-environment-photo/update-environment-photo.service';
import { UpdateCharacterizationPhotoService } from './services/characterization/update-characterization-photo/update-characterization-photo.service';
import { RiskDataRepository } from '../sst/repositories/implementations/RiskDataRepository';
import { UpdateSimpleManyHierarchyService } from './services/hierarchy/update-simple-many-hierarchies /upsert-many-hierarchies.service';
import { CompanyGroupController } from './controller/group/group.controller';
import { CompanyGroupRepository } from './repositories/implementations/CompanyGroupRepository';
import { FindAvailableCompanyGroupsService } from './services/group/find-company-groups-group/find-company-groups-group.service';
import { UpsertCompanyGroupsService } from './services/group/upsert-company-group/upsert-company-group.service';
import { FindAllUserCompaniesService } from './services/company/find-all-user-companies /find-all-companies.service';
import { CopyHomoGroupService } from './services/homoGroup/copy-homo-group/copy-homo-group.service';
import { SSTModule } from '../sst/sst.module';
import { CreateSubHierarchyService } from './services/hierarchy/create-sub-hierarchies/create-sub-hierarchies.service';
import { DeleteSubOfficeEmployeeService } from './services/employee/delete-sub-office-employee/delete-sub-office-employee.service';
import { ContactRepository } from './repositories/implementations/ContactRepository';
import { UpdateContactsService } from './services/contact/update-contact/update-contact.service';
import { FindContactsService } from './services/contact/find-contact/find-company-groups-group.service';
import { CreateContactsService } from './services/contact/create-contact/create-contact.service';
import { ContactController } from './controller/contact/contact.controller';
import { DeleteContactsService } from './services/contact/delete-contact/delete-contact.service';
import { FindCnaeService } from './services/company/find-cnae/find-cnae.service';
import { CreateEmployeeHierarchyHistoryService } from './services/employee/0-history/hierarchy/create/create.service';
import { DeleteEmployeeHierarchyHistoryService } from './services/employee/0-history/hierarchy/delete/delete.service';
import { FindEmployeeHierarchyHistoryService } from './services/employee/0-history/hierarchy/find/find.service';
import { EmployeeHierarchyHistoryRepository } from './repositories/implementations/EmployeeHierarchyHistoryRepository';
import { EmployeeHierarchyHistoryController } from './controller/employee/employee-hierarchy-history.controller';
import { UpdateEmployeeHierarchyHistoryService } from './services/employee/0-history/hierarchy/update/update.service';
import { SetCompanyClinicsService } from './services/company/set-company-clinics/set-company-clinics.service';
import { FindEmployeeExamHistoryService } from './services/employee/0-history/exams/find/find.service';
import { EmployeeExamsHistoryRepository } from './repositories/implementations/EmployeeExamsHistoryRepository';
import { CreateEmployeeExamHistoryService } from './services/employee/0-history/exams/create/create.service';
import { UpdateEmployeeExamHistoryService } from './services/employee/0-history/exams/update/update.service';
import { DeleteEmployeeExamHistoryService } from './services/employee/0-history/exams/delete/delete.service';
import { EmployeeExamHistoryController } from './controller/employee/employee-exam-history.controller';
import { FindByIdEmployeeExamHistoryService } from './services/employee/0-history/exams/find-by-id/find-by-id.service';
import { DayJSProvider } from '../../shared/providers/DateProvider/implementations/DayJSProvider';
import { FindClinicService } from './services/company/find-clinic/find-clinic.service';
import { FindScheduleEmployeeExamHistoryService } from './services/employee/0-history/exams/find-schedule/find-schedule.service';
import { FindClinicScheduleEmployeeExamHistoryService } from './services/employee/0-history/exams/find-clinic-schedules/find-clinic-schedules.service';
import { NotificationModule } from '../notifications/notifications.module';
import { FindCompanyScheduleEmployeeExamHistoryService } from './services/employee/0-history/exams/find-company-schedules/find-company-schedules.service';
import { DocumentRepository } from './repositories/implementations/DocumentRepository';
import { DocumentController } from './controller/document/document.controller';
import { DeleteDocumentService } from './services/document/delete-document/delete-document.service';
import { FindDocumentService } from './services/document/find-document/find-document.service';
import { CreateDocumentService } from './services/document/create-document/create-document.service';
import { UpdateDocumentService } from './services/document/update-document/update-document.service';
import { FindByIdDocumentService } from './services/document/find-by-id-document/find-by-id-document.service';
import { DownloadDocumentService } from './services/document/download-document/download-document.service';
import { UpdateAllCompaniesService } from './services/report/update-all-companies/update-all-companies.service';
import { DashboardCompanyService } from './services/report/dashboard-company/dashboard-company.service';
import { TelegramModule } from 'nestjs-telegram';
import { CompanyReportRepository } from './repositories/implementations/CompanyReportRepository';
import { CopyCharacterizationService } from './services/characterization/copy-characterization/copy-characterization.service';
import { CidRepository } from './repositories/implementations/CidRepository';
import { UpdateHierarchyHomoGroupService } from './services/homoGroup/update-hierarchy-homo-group/update-hierarchy-homo-group.service';
import { FindHomogenousGroupService } from './services/homoGroup/find-homo-group/find-homo-group.service';
import { FindHomogenousGroupByIdService } from './services/homoGroup/find-homo-group-by-id/find-homo-group-by-id.service';
import { EsocialModule } from '../esocial/esocial.module';
import { UpdateESocialReportService } from './services/report/update-esocial-report/update-esocial-report.service';
import { EmployeePPPHistoryRepository } from './repositories/implementations/EmployeePPPHistoryRepository';
import { CreateAbsenteeismsService } from './services/absenteeism/create-absenteeism/create-absenteeism.service';
import { DeleteAbsenteeismsService } from './services/absenteeism/delete-absenteeism/delete-absenteeism.service';
import { FindAbsenteeismsService } from './services/absenteeism/find-absenteeism/find-absenteeism.service';
import { UpdateAbsenteeismsService } from './services/absenteeism/update-absenteeism/update-absenteeism.service';
import { AbsenteeismRepository } from './repositories/implementations/AbsenteeismRepository';
import { UpdateCatsService } from './services/cat/update-cat/update-cat.service';
import { FindCatsService } from './services/cat/find-cat/find-cat.service';
import { DeleteCatsService } from './services/cat/delete-cat/delete-cat.service';
import { CreateCatsService } from './services/cat/create-cat/create-cat.service';
import { CatRepository } from './repositories/implementations/CatRepository';
import { AbsenteeismController } from './controller/absenteeism/absenteeism.controller';
import { CatController } from './controller/cat/cat.controller';
import { FindOneAbsenteeismsService } from './services/absenteeism/find-one-absenteeism/find-one-absenteeism.service';
import { FindOneCatsService } from './services/cat/find-one-cat/find-one-cat.service';
import { DeleteHierarchyHomoGroupService } from './services/homoGroup/delete-hierarchy-homo-group/update-hierarchy-homo-group.service';
import { CompanyOSRepository } from './repositories/implementations/CompanyOSRepository';
import { FindOneCompanyOSService } from './services/os/find-os/find-os.service';
import { UpsertCompanyOSService } from './services/os/upsert-os/upsert-os.service';
import { CompanyOSController } from './controller/os/os.controller';
import { DeleteCompanyOSService } from './services/os/delete-os/delete-os.service';
import { CopyCompanyOSService } from './services/os/copy-os/copy-os.service';

@Module({
  imports: [
    forwardRef(() => SSTModule),
    forwardRef(() => NotificationModule),
    forwardRef(() => EsocialModule),
    TelegramModule.forRoot({
      botKey: process.env.TELEGRAM_TOKEN,
    }),
  ],
  controllers: [
    CompanyController,
    EmployeeController,
    HierarchyController,
    HomoGroupsController,
    EnvironmentController,
    CharacterizationController,
    CompanyGroupController,
    ContactController,
    EmployeeHierarchyHistoryController,
    EmployeeExamHistoryController,
    DocumentController,
    CatController,
    AbsenteeismController,
    CompanyOSController,
  ],
  providers: [
    CreateCompanyService,
    UpdateCompanyService,
    CreateContractService,
    WorkspaceRepository,
    CompanyRepository,
    LicenseRepository,
    EmployeeRepository,
    HierarchyRepository,
    HomoGroupRepository,
    ExcelProvider,
    FindAllCompaniesService,
    FindCompanyService,
    FindEmployeeService,
    CreateEmployeeService,
    UpdateEmployeeService,
    FindAllAvailableEmployeesService,
    FindAllHierarchyService,
    CreateHierarchyService,
    UpdateHierarchyService,
    DeleteHierarchyService,
    UpsertManyHierarchyService,
    CreateHomoGroupService,
    UpdateHomoGroupService,
    DeleteHomoGroupService,
    FindByCompanyHomoGroupService,
    FindCnpjService,
    FindCepService,
    UpsertEnvironmentService,
    FindAllEnvironmentService,
    DeleteEnvironmentService,
    EnvironmentRepository,
    AmazonStorageProvider,
    EnvironmentPhotoRepository,
    AddEnvironmentPhotoService,
    DeleteEnvironmentPhotoService,
    AddCompanyPhotoService,
    UpsertCharacterizationService,
    FindAllCharacterizationService,
    DeleteCharacterizationService,
    CharacterizationPhotoRepository,
    AddCharacterizationPhotoService,
    DeleteCharacterizationPhotoService,
    CharacterizationRepository,
    CopyCompanyService,
    RiskGroupDataRepository,
    RiskDataRepository,
    ActivityRepository,
    FindByIdEnvironmentService,
    FindByIdCharacterizationService,
    FindHierarchyService,
    UpdateEnvironmentPhotoService,
    UpdateCharacterizationPhotoService,
    UpdateSimpleManyHierarchyService,
    CompanyGroupRepository,
    FindAvailableCompanyGroupsService,
    UpsertCompanyGroupsService,
    FindAllUserCompaniesService,
    CopyHomoGroupService,
    CreateSubHierarchyService,
    DeleteSubOfficeEmployeeService,
    ContactRepository,
    UpdateContactsService,
    CreateContactsService,
    FindContactsService,
    DeleteContactsService,
    UpdateDocumentService,
    CreateDocumentService,
    FindDocumentService,
    DeleteDocumentService,
    FindCnaeService,
    EmployeeHierarchyHistoryRepository,
    CreateEmployeeHierarchyHistoryService,
    CreateEmployeeHierarchyHistoryService,
    DeleteEmployeeHierarchyHistoryService,
    FindEmployeeHierarchyHistoryService,
    UpdateEmployeeHierarchyHistoryService,
    SetCompanyClinicsService,
    CompanyClinicRepository,
    FindEmployeeExamHistoryService,
    EmployeeExamsHistoryRepository,
    CreateEmployeeExamHistoryService,
    UpdateEmployeeExamHistoryService,
    DeleteEmployeeExamHistoryService,
    FindByIdEmployeeExamHistoryService,
    FindScheduleEmployeeExamHistoryService,
    UpdateManyScheduleExamHistoryService,
    FindClinicService,
    FindClinicScheduleEmployeeExamHistoryService,
    FindCompanyScheduleEmployeeExamHistoryService,
    DocumentRepository,
    FindByIdDocumentService,
    DayJSProvider,
    DownloadDocumentService,
    UploadExamFileService,
    DeleteExamFileService,
    DownloadExamService,
    UpdateAllCompaniesService,
    UpdateCompaniesReportCron,
    DashboardCompanyService,
    CompanyReportRepository,
    CopyCharacterizationService,
    CidRepository,
    UpdateHierarchyHomoGroupService,
    FindHomogenousGroupService,
    FindHomogenousGroupByIdService,
    UpdateESocialReportService,
    EmployeePPPHistoryRepository,
    UpdateAbsenteeismsService,
    FindAbsenteeismsService,
    DeleteAbsenteeismsService,
    CreateAbsenteeismsService,
    AbsenteeismRepository,
    UpdateCatsService,
    FindCatsService,
    DeleteCatsService,
    CreateCatsService,
    CatRepository,
    FindOneAbsenteeismsService,
    FindOneCatsService,
    DeleteHierarchyHomoGroupService,
    CompanyOSRepository,
    FindOneCompanyOSService,
    DeleteCompanyOSService,
    UpsertCompanyOSService,
    CopyCompanyOSService,
  ],
  exports: [
    CompanyRepository,
    EmployeeRepository,
    HierarchyRepository,
    WorkspaceRepository,
    EnvironmentRepository,
    HomoGroupRepository,
    ActivityRepository,
    CidRepository,
    EmployeeExamsHistoryRepository,
    EmployeeHierarchyHistoryRepository,
    CompanyReportRepository,
    UpdateESocialReportService,
    EmployeePPPHistoryRepository,
  ],
})
export class CompanyModule {}
