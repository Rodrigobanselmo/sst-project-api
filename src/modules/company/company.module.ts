import { Module } from '@nestjs/common';
import { AmazonStorageProvider } from '../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider';

import { ExcelProvider } from '../../shared/providers/ExcelProvider/implementations/ExcelProvider';
import { CompanyController } from './controller/company/company.controller';
import { EmployeeController } from './controller/employee/employee.controller';
import { EnvironmentController } from './controller/environment/environment.controller';
import { HierarchyController } from './controller/hierarchy/hierarchy.controller';
import { HomoGroupsController } from './controller/HomoGroups/HomoGroups.controller';
import { CompanyRepository } from './repositories/implementations/CompanyRepository';
import { EmployeeRepository } from './repositories/implementations/EmployeeRepository';
import { EnvironmentRepository } from './repositories/implementations/EnvironmentRepository';
import { HierarchyRepository } from './repositories/implementations/HierarchyRepository';
import { HomoGroupRepository } from './repositories/implementations/HomoGroupRepository';
import { LicenseRepository } from './repositories/implementations/LicenseRepository';
import { WorkspaceRepository } from './repositories/implementations/WorkspaceRepository';
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
import { DeleteEnvironmentService } from './services/environment/delete-environment/delete-environment.service';
import { FindAllEnvironmentService } from './services/environment/find-all-environment/find-all-environment.service';
import { UpsertEnvironmentService } from './services/environment/upsert-environment/upsert-environment.service';
import { CreateHierarchyService } from './services/hierarchy/create-hierarchies/create-hierarchies.service';
import { DeleteHierarchyService } from './services/hierarchy/delete-hierarchies/delete-hierarchies.service';
import { FindAllHierarchyService } from './services/hierarchy/find-all-hierarchies/find-all-hierarchies.service';
import { UpdateHierarchyService } from './services/hierarchy/update-hierarchies/update-hierarchies.service';
import { UpsertManyHierarchyService } from './services/hierarchy/upsert-many-hierarchies/upsert-many-hierarchies.service';
import { CreateHomoGroupService } from './services/homoGroup/create-homo-group/create-homo-group.service';
import { DeleteHomoGroupService } from './services/homoGroup/delete-homo-group/delete-homo-group.service';
import { FindByCompanyHomoGroupService } from './services/homoGroup/find-by-company-homo-group/find-by-company-homo-group.service';
import { UpdateHomoGroupService } from './services/homoGroup/update-homo-group/update-homo-group.service';
import { EnvironmentPhotoRepository } from './repositories/implementations/EnvironmentPhotoRepository';
import { AddEnvironmentPhotoService } from './services/environment/add-environment-photo/add-environment-photo.service';
import { DeleteEnvironmentPhotoService } from './services/environment/delete-environment-photo/delete-environment-photo.service';
import { AddCompanyPhotoService } from './services/company/add-company-photo/add-company-photo.service';
import { UpsertCharacterizationService } from './services/characterization/upsert-characterization/upsert-characterization.service';
import { FindAllCharacterizationService } from './services/characterization/find-all-characterization/find-all-characterization.service';
import { DeleteCharacterizationService } from './services/characterization/delete-characterization/delete-characterization.service';
import { CharacterizationPhotoRepository } from './repositories/implementations/CharacterizationPhotoRepository';
import { AddCharacterizationPhotoService } from './services/characterization/add-characterization-photo/add-characterization-photo.service';
import { DeleteCharacterizationPhotoService } from './services/characterization/delete-characterization-photo/delete-characterization-photo.service';
import { CharacterizationRepository } from './repositories/implementations/CharacterizationRepository';
import { CharacterizationController } from './controller/characterization/characterization.controller';

@Module({
  controllers: [
    CompanyController,
    EmployeeController,
    HierarchyController,
    HomoGroupsController,
    EnvironmentController,
    CharacterizationController,
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
  ],
  exports: [
    CompanyRepository,
    EmployeeRepository,
    HierarchyRepository,
    WorkspaceRepository,
    EnvironmentRepository,
    HomoGroupRepository,
  ],
})
export class CompanyModule {}
