import { CacheModule, forwardRef, Module } from '@nestjs/common';
import { TelegramModule } from 'nestjs-telegram';

import { DayJSProvider } from '../../shared/providers/DateProvider/implementations/DayJSProvider';
import { ExcelProvider } from '../../shared/providers/ExcelProvider/implementations/ExcelProvider';
import { SendGridProvider } from '../../shared/providers/MailProvider/implementations/SendGrid/SendGridProvider';
import { AmazonStorageProvider } from '../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider';
import { EsocialModule } from '../esocial/esocial.module';
import { NotificationModule } from '../notifications/notifications.module';
import { RiskDataRepository } from '../sst/repositories/implementations/RiskDataRepository';
import { RiskGroupDataRepository } from '../sst/repositories/implementations/RiskGroupDataRepository';
import { SSTModule } from '../sst/sst.module';
import { AbsenteeismController } from './controller/absenteeism/absenteeism.controller';
import { AlertController } from './controller/alert/alert.controller';
import { CatController } from './controller/cat/cat.controller';
import { CharacterizationController } from './controller/characterization/characterization.controller';
import { CompanyController } from './controller/company/company.controller';
import { ContactController } from './controller/contact/contact.controller';
import { DocumentController } from './controller/document/document.controller';
import { EmployeeExamHistoryController } from './controller/employee/employee-exam-history.controller';
import { EmployeeHierarchyHistoryController } from './controller/employee/employee-hierarchy-history.controller';
import { EmployeeController } from './controller/employee/employee.controller';
import { CompanyGroupController } from './controller/group/group.controller';
import { HierarchyController } from './controller/hierarchy/hierarchy.controller';
import { HomoGroupsController } from './controller/HomoGroups/HomoGroups.controller';
import { CompanyOSController } from './controller/os/os.controller';
import { ScheduleBlockController } from './controller/scheduleBlock/scheduleBlock.controller';
import { AlertReportCron } from './crons/alerts/alerts.cron';
import { UpdateCompaniesReportCron } from './crons/employee-exam/employee-exam.cron';
import { AbsenteeismRepository } from './repositories/implementations/AbsenteeismRepository';
import { ActivityRepository } from './repositories/implementations/ActivityRepository';
import { AlertRepository } from './repositories/implementations/AlertRepository';
import { CatRepository } from './repositories/implementations/CatRepository';
import { CharacterizationPhotoRepository } from './repositories/implementations/CharacterizationPhotoRepository';
import { CharacterizationRepository } from './repositories/implementations/CharacterizationRepository';
import { CidRepository } from './repositories/implementations/CidRepository';
import { CompanyClinicRepository } from './repositories/implementations/CompanyClinicRepository';
import { CompanyGroupRepository } from './repositories/implementations/CompanyGroupRepository';
import { CompanyOSRepository } from './repositories/implementations/CompanyOSRepository';
import { CompanyReportRepository } from './repositories/implementations/CompanyReportRepository';
import { CompanyRepository } from './repositories/implementations/CompanyRepository';
import { ContactRepository } from './repositories/implementations/ContactRepository';
import { DocumentRepository } from './repositories/implementations/DocumentRepository';
import { EmployeeExamsHistoryRepository } from './repositories/implementations/EmployeeExamsHistoryRepository';
import { EmployeeHierarchyHistoryRepository } from './repositories/implementations/EmployeeHierarchyHistoryRepository';
import { EmployeePPPHistoryRepository } from './repositories/implementations/EmployeePPPHistoryRepository';
import { EmployeeRepository } from './repositories/implementations/EmployeeRepository';
import { HierarchyRepository } from './repositories/implementations/HierarchyRepository';
import { HomoGroupRepository } from './repositories/implementations/HomoGroupRepository';
import { LicenseRepository } from './repositories/implementations/LicenseRepository';
import { ScheduleBlockRepository } from './repositories/implementations/ScheduleBlockRepository';
import { WorkspaceRepository } from './repositories/implementations/WorkspaceRepository';
import { CreateAbsenteeismsService } from './services/absenteeism/create-absenteeism/create-absenteeism.service';
import { DeleteAbsenteeismsService } from './services/absenteeism/delete-absenteeism/delete-absenteeism.service';
import { FindAbsenteeismsService } from './services/absenteeism/find-absenteeism/find-absenteeism.service';
import { FindOneAbsenteeismsService } from './services/absenteeism/find-one-absenteeism/find-one-absenteeism.service';
import { UpdateAbsenteeismsService } from './services/absenteeism/update-absenteeism/update-absenteeism.service';
import { DeleteAlertService } from './services/alert/delete-alert/delete-alert.service';
import { FindOneAlertService } from './services/alert/find-alert/find-alert.service';
import { FindAlertsByTimeService } from './services/alert/find-alerts-by-time/find-alerts-by-time.service';
import { SendAlertService } from './services/alert/send-alert/send-alert.service';
import { UpsertAlertService } from './services/alert/upsert-alert/upsert-alert.service';
import { CreateCatsService } from './services/cat/create-cat/create-cat.service';
import { DeleteCatsService } from './services/cat/delete-cat/delete-cat.service';
import { FindCatsService } from './services/cat/find-cat/find-cat.service';
import { FindOneCatsService } from './services/cat/find-one-cat/find-one-cat.service';
import { UpdateCatsService } from './services/cat/update-cat/update-cat.service';
import { AddCharacterizationPhotoService } from './services/characterization/add-characterization-photo/add-characterization-photo.service';
import { CopyCharacterizationService } from './services/characterization/copy-characterization/copy-characterization.service';
import { DeleteCharacterizationPhotoService } from './services/characterization/delete-characterization-photo/delete-characterization-photo.service';
import { DeleteCharacterizationService } from './services/characterization/delete-characterization/delete-characterization.service';
import { FindAllCharacterizationService } from './services/characterization/find-all-characterization/find-all-characterization.service';
import { FindByIdCharacterizationService } from './services/characterization/find-by-id-characterization/find-by-id-characterization.service';
import { UpdateCharacterizationPhotoService } from './services/characterization/update-characterization-photo/update-characterization-photo.service';
import { UpsertCharacterizationService } from './services/characterization/upsert-characterization/upsert-characterization.service';
import { AddCompanyPhotoService } from './services/company/add-company-photo/add-company-photo.service';
import { CopyCompanyService } from './services/company/copy-company/copy-company.service';
import { CreateCompanyService } from './services/company/create-company/create-company.service';
import { CreateContractService } from './services/company/create-contract/create-contract.service';
import { FindAllCompaniesService } from './services/company/find-all-companies/find-all-companies.service';
import { FindAllUserCompaniesService } from './services/company/find-all-user-companies /find-all-companies.service';
import { FindCepService } from './services/company/find-cep/find-cep.service';
import { FindCnaeService } from './services/company/find-cnae/find-cnae.service';
import { FindCnpjService } from './services/company/find-cnpj/find-cnpj.service';
import { FindClinicService } from './services/company/find-one-clinic/find-clinic.service';
import { FindCompanyService } from './services/company/find-one-company/find-company.service';
import { SetCompanyClinicsService } from './services/company/set-company-clinics/set-company-clinics.service';
import { UpdateApplyServiceCompanyService } from './services/company/update-apply-service-company/update-apply-service-company.service';
import { UpdateCompanyService } from './services/company/update-company/update-company.service';
import { CreateContactsService } from './services/contact/create-contact/create-contact.service';
import { DeleteContactsService } from './services/contact/delete-contact/delete-contact.service';
import { FindContactsService } from './services/contact/find-contact/find-company-groups-group.service';
import { UpdateContactsService } from './services/contact/update-contact/update-contact.service';
import { CreateDocumentService } from './services/document/create-document/create-document.service';
import { DeleteDocumentService } from './services/document/delete-document/delete-document.service';
import { DownloadDocumentService } from './services/document/download-document/download-document.service';
import { FindByIdDocumentService } from './services/document/find-by-id-document/find-by-id-document.service';
import { FindDocumentService } from './services/document/find-document/find-document.service';
import { UpdateDocumentService } from './services/document/update-document/update-document.service';
import { CreateEmployeeExamHistoryService } from './services/employee/0-history/exams/create/create.service';
import { DeleteExamFileService } from './services/employee/0-history/exams/delete-exam-file/delete-exam-file.service';
import { DeleteEmployeeExamHistoryService } from './services/employee/0-history/exams/delete/delete.service';
import { DownloadExamService } from './services/employee/0-history/exams/download-exam/download-exam.service';
import { FindByIdEmployeeExamHistoryService } from './services/employee/0-history/exams/find-by-id/find-by-id.service';
import { FindClinicScheduleEmployeeExamHistoryService } from './services/employee/0-history/exams/find-clinic-schedules/find-clinic-schedules.service';
import { FindClinicScheduleTimeService } from './services/employee/0-history/exams/find-clinic-time/find-clinic-time.service';
import { FindCompanyScheduleEmployeeExamHistoryService } from './services/employee/0-history/exams/find-company-schedules/find-company-schedules.service';
import { FindScheduleEmployeeExamHistoryService } from './services/employee/0-history/exams/find-schedule/find-schedule.service';
import { FindEmployeeExamHistoryService } from './services/employee/0-history/exams/find/find.service';
import { UpdateManyScheduleExamHistoryService } from './services/employee/0-history/exams/update-many/update-many.service';
import { UpdateEmployeeExamHistoryService } from './services/employee/0-history/exams/update/update.service';
import { UploadExamFileService } from './services/employee/0-history/exams/upload-exam-file/upload-exam-file.service';
import { CreateEmployeeHierarchyHistoryService } from './services/employee/0-history/hierarchy/create/create.service';
import { DeleteEmployeeHierarchyHistoryService } from './services/employee/0-history/hierarchy/delete/delete.service';
import { FindEmployeeHierarchyHistoryService } from './services/employee/0-history/hierarchy/find/find.service';
import { UpdateEmployeeHierarchyHistoryService } from './services/employee/0-history/hierarchy/update/update.service';
import { UpsertEmployeeHierarchyHistoryService } from './services/employee/0-history/hierarchy/upsert/upsert.service';
import { CreateEmployeeService } from './services/employee/create-employee/create-employee.service';
import { DeleteSubOfficeEmployeeService } from './services/employee/delete-sub-office-employee/delete-sub-office-employee.service';
import { FindAllAvailableEmployeesService } from './services/employee/find-all-available-employees/find-all-available-employees.service';
import { FindEmployeeService } from './services/employee/find-employee/find-employee.service';
import { UpdateEmployeeService } from './services/employee/update-employee/update-employee.service';
import { FindAvailableCompanyGroupsService } from './services/group/find-company-groups-group/find-company-groups-group.service';
import { UpsertCompanyGroupsService } from './services/group/upsert-company-group/upsert-company-group.service';
import { CreateHierarchyService } from './services/hierarchy/create-hierarchies/create-hierarchies.service';
import { CreateSubHierarchyService } from './services/hierarchy/create-sub-hierarchies/create-sub-hierarchies.service';
import { DeleteHierarchyService } from './services/hierarchy/delete-hierarchies/delete-hierarchies.service';
import { FindAllHierarchyService } from './services/hierarchy/find-all-hierarchies/find-all-hierarchies.service';
import { FindHierarchyService } from './services/hierarchy/find-hierarchy/find-hierarchy.service';
import { UpdateHierarchyService } from './services/hierarchy/update-hierarchies/update-hierarchies.service';
import { UpdateSimpleManyHierarchyService } from './services/hierarchy/update-simple-many-hierarchies /upsert-many-hierarchies.service';
import { UpsertManyHierarchyService } from './services/hierarchy/upsert-many-hierarchies/upsert-many-hierarchies.service';
import { CopyHomoGroupService } from './services/homoGroup/copy-homo-group/copy-homo-group.service';
import { CreateHomoGroupService } from './services/homoGroup/create-homo-group/create-homo-group.service';
import { DeleteHierarchyHomoGroupService } from './services/homoGroup/delete-hierarchy-homo-group/delete-hierarchy-homo-group.service';
import { DeleteHomoGroupService } from './services/homoGroup/delete-homo-group/delete-homo-group.service';
import { FindByCompanyHomoGroupService } from './services/homoGroup/find-by-company-homo-group/find-by-company-homo-group.service';
import { FindHomogenousGroupByIdService } from './services/homoGroup/find-homo-group-by-id/find-homo-group-by-id.service';
import { FindHomogenousGroupService } from './services/homoGroup/find-homo-group/find-homo-group.service';
import { UpdateHierarchyHomoGroupService } from './services/homoGroup/update-hierarchy-homo-group/update-hierarchy-homo-group.service';
import { UpdateHomoGroupService } from './services/homoGroup/update-homo-group/update-homo-group.service';
import { CopyCompanyOSService } from './services/os/copy-os/copy-os.service';
import { DeleteCompanyOSService } from './services/os/delete-os/delete-os.service';
import { FindOneCompanyOSService } from './services/os/find-os/find-os.service';
import { UpsertCompanyOSService } from './services/os/upsert-os/upsert-os.service';
import { DashboardCompanyService } from './services/report/dashboard-company/dashboard-company.service';
import { UpdateAllCompaniesService } from './services/report/update-all-companies/update-all-companies.service';
import { UpdateESocialReportService } from './services/report/update-esocial-report/update-esocial-report.service';
import { CreateScheduleBlocksService } from './services/scheduleBlock/create-schedule-block/create-schedule-block.service';
import { DeleteScheduleBlocksService } from './services/scheduleBlock/delete-schedule-block/delete-schedule-block.service';
import { FindOneScheduleBlocksService } from './services/scheduleBlock/find-one-schedule-block/find-one-schedule-block.service';
import { FindScheduleBlocksService } from './services/scheduleBlock/find-schedule-block/find-schedule-block.service';
import { UpdateScheduleBlocksService } from './services/scheduleBlock/update-schedule-block/update-schedule-block.service';
import { DeleteCompanyService } from './services/company/delete-company/delete-company.service';
import { ScheduleMedicalVisitRepository } from './repositories/implementations/ScheduleMedicalVisitRepository';
import { FindScheduleMedicalVisitsService } from './services/scheduleMedicalVisit/find-schedule-medical-visit/find-schedule-medical-visit.service';
import { CreateScheduleMedicalVisitsService } from './services/scheduleMedicalVisit/create-schedule-medical-visit/create-schedule-medical-visit.service';
import { UpdateScheduleMedicalVisitsService } from './services/scheduleMedicalVisit/update-schedule-medical-visit/update-schedule-medical-visit.service';
import { DeleteScheduleMedicalVisitsService } from './services/scheduleMedicalVisit/delete-schedule-medical-visit/delete-schedule-medical-visit.service';
import { ScheduleMedicalVisitController } from './controller/scheduleMedicalVisit/scheduleMedicalVisit.controller';
import { FindOneScheduleMedicalVisitsService } from './services/scheduleMedicalVisit/find-one-schedule-medical-visit/find-one-schedule-medical-visit.service';

@Module({
  imports: [
    CacheModule.register(),
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
    CharacterizationController,
    CompanyGroupController,
    ContactController,
    EmployeeHierarchyHistoryController,
    EmployeeExamHistoryController,
    DocumentController,
    CatController,
    AbsenteeismController,
    CompanyOSController,
    ScheduleBlockController,
    AlertController,
    ScheduleMedicalVisitController,
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
    AmazonStorageProvider,
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
    FindByIdCharacterizationService,
    FindHierarchyService,
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
    FindOneCatsService,
    FindOneAbsenteeismsService,
    DeleteHierarchyHomoGroupService,
    CompanyOSRepository,
    FindOneCompanyOSService,
    DeleteCompanyOSService,
    UpsertCompanyOSService,
    CopyCompanyOSService,
    FindClinicScheduleTimeService,
    ScheduleBlockRepository,
    UpdateScheduleBlocksService,
    FindScheduleBlocksService,
    DeleteScheduleBlocksService,
    CreateScheduleBlocksService,
    FindOneScheduleBlocksService,
    AlertRepository,
    UpsertAlertService,
    FindOneAlertService,
    DeleteAlertService,
    SendGridProvider,
    SendAlertService,
    FindAlertsByTimeService,
    AlertReportCron,
    UpdateApplyServiceCompanyService,
    UpsertEmployeeHierarchyHistoryService,
    DeleteCompanyService,
    ScheduleMedicalVisitRepository,
    FindScheduleMedicalVisitsService,
    CreateScheduleMedicalVisitsService,
    UpdateScheduleMedicalVisitsService,
    DeleteScheduleMedicalVisitsService,
    FindOneScheduleMedicalVisitsService,
  ],
  exports: [
    CompanyRepository,
    EmployeeRepository,
    HierarchyRepository,
    WorkspaceRepository,
    HomoGroupRepository,
    ActivityRepository,
    CidRepository,
    EmployeeExamsHistoryRepository,
    EmployeeHierarchyHistoryRepository,
    CompanyReportRepository,
    UpdateESocialReportService,
    EmployeePPPHistoryRepository,
    CatRepository,
    DeleteHomoGroupService,
    ScheduleBlockRepository,
    UpsertEmployeeHierarchyHistoryService,
    CreateEmployeeService,
    FindAllAvailableEmployeesService,
  ],
})
export class CompanyModule {}
