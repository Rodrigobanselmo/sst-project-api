import { Module } from '@nestjs/common';

import { ExcelProvider } from '../../shared/providers/ExcelProvider/implementations/ExcelProvider';
import { CompanyController } from './controller/company/company.controller';
import { CompanyRepository } from './repositories/implementations/CompanyRepository';
import { LicenseRepository } from './repositories/implementations/LicenseRepository';
import { CreateCompanyService } from './services/company/create-company/create-company.service';
import { CreateContractService } from './services/company/create-contract/create-contract.service';
import { UpdateCompanyService } from './services/company/update-company/update-company.service';
import { FindAllCompaniesService } from './services/company/find-all-companies/find-all-companies.service';
import { EmployeeRepository } from './repositories/implementations/EmployeeRepository';
import { EmployeeController } from './controller/employee/employee.controller';
import { FindEmployeeService } from './services/employee/find-employee/find-employee.service';
import { UpdateEmployeeService } from './services/employee/update-employee/update-employee.service';
import { FindAllAvailableEmployeesService } from './services/employee/find-all-available-employees/find-all-available-employees.service';
import { HierarchyRepository } from './repositories/implementations/HierarchyRepository';
import { CreateEmployeeService } from './services/employee/create-employee/create-employee.service';
import { HierarchyController } from './controller/hierarchy/hierarchy.controller';
import { FindAllHierarchyService } from './services/hierarchy/find-all-hierarchies/find-all-hierarchies.service';
import { FindCompanyService } from './services/company/find-company/find-company.service';
import { CreateHierarchyService } from './services/hierarchy/create-hierarchies/create-hierarchies.service';
import { UpdateHierarchyService } from './services/hierarchy/update-hierarchies/update-hierarchies.service';
import { DeleteHierarchyService } from './services/hierarchy/delete-hierarchies/delete-hierarchies.service';
import { UpsertManyHierarchyService } from './services/hierarchy/upsert-many-hierarchies/upsert-many-hierarchies.service';

@Module({
  controllers: [CompanyController, EmployeeController, HierarchyController],
  providers: [
    CreateCompanyService,
    UpdateCompanyService,
    CreateContractService,
    CompanyRepository,
    LicenseRepository,
    EmployeeRepository,
    HierarchyRepository,
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
  ],
  exports: [CompanyRepository, EmployeeRepository, HierarchyRepository],
})
export class CompanyModule {}
