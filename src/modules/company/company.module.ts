import { UpdateManyScheduleExamHistoryService } from './services/employee/0-history/exams/update-many/update-many.service';
import { Module, forwardRef } from '@nestjs/common';

import { ExcelProvider } from '../../shared/providers/ExcelProvider/implementations/ExcelProvider';
import { AmazonStorageProvider } from '../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider';
import { RiskGroupDataRepository } from '../checklist/repositories/implementations/RiskGroupDataRepository';
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
import { RiskDataRepository } from '../checklist/repositories/implementations/RiskDataRepository';
import { UpdateSimpleManyHierarchyService } from './services/hierarchy/update-simple-many-hierarchies /upsert-many-hierarchies.service';
import { CompanyGroupController } from './controller/group/group.controller';
import { CompanyGroupRepository } from './repositories/implementations/CompanyGroupRepository';
import { FindAvailableCompanyGroupsService } from './services/group/find-company-groups-group/find-company-groups-group.service';
import { UpsertCompanyGroupsService } from './services/group/upsert-company-group/upsert-company-group.service';
import { FindAllUserCompaniesService } from './services/company/find-all-user-companies /find-all-companies.service';
import { CopyHomoGroupService } from './services/homoGroup/copy-homo-group/copy-homo-group.service';
import { ChecklistModule } from '../checklist/checklist.module';
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

@Module({
  imports: [
    forwardRef(() => ChecklistModule),
    forwardRef(() => NotificationModule),
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
    DayJSProvider,
  ],
  exports: [
    CompanyRepository,
    EmployeeRepository,
    HierarchyRepository,
    WorkspaceRepository,
    EnvironmentRepository,
    HomoGroupRepository,
    ActivityRepository,
  ],
})
export class CompanyModule {}
