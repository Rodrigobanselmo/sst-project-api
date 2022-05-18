import { Module } from '@nestjs/common';

import { ExcelProvider } from '../../shared/providers/ExcelProvider/implementations/ExcelProvider';
import { CompanyController } from './controller/company/company.controller';
import { EmployeeController } from './controller/employee/employee.controller';
import { HierarchyController } from './controller/hierarchy/hierarchy.controller';
import { HomoGroupsController } from './controller/HomoGroups/HomoGroups.controller';
import { CompanyRepository } from './repositories/implementations/CompanyRepository';
import { EmployeeRepository } from './repositories/implementations/EmployeeRepository';
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
import { CreateHierarchyService } from './services/hierarchy/create-hierarchies/create-hierarchies.service';
import { DeleteHierarchyService } from './services/hierarchy/delete-hierarchies/delete-hierarchies.service';
import { FindAllHierarchyService } from './services/hierarchy/find-all-hierarchies/find-all-hierarchies.service';
import { UpdateHierarchyService } from './services/hierarchy/update-hierarchies/update-hierarchies.service';
import { UpsertManyHierarchyService } from './services/hierarchy/upsert-many-hierarchies/upsert-many-hierarchies.service';
import { CreateHomoGroupService } from './services/homoGroup/create-homo-group/create-homo-group.service';
import { DeleteHomoGroupService } from './services/homoGroup/delete-homo-group/delete-homo-group.service';
import { FindByCompanyHomoGroupService } from './services/homoGroup/find-by-company-homo-group/find-by-company-homo-group.service';
import { UpdateHomoGroupService } from './services/homoGroup/update-homo-group/update-homo-group.service';

@Module({
  controllers: [
    CompanyController,
    EmployeeController,
    HierarchyController,
    HomoGroupsController,
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
  ],
  exports: [CompanyRepository, EmployeeRepository, HierarchyRepository],
})
export class CompanyModule {}
