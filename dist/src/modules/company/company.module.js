"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyModule = void 0;
const common_1 = require("@nestjs/common");
const ExcelProvider_1 = require("../../shared/providers/ExcelProvider/implementations/ExcelProvider");
const company_controller_1 = require("./controller/company/company.controller");
const employee_controller_1 = require("./controller/employee/employee.controller");
const hierarchy_controller_1 = require("./controller/hierarchy/hierarchy.controller");
const HomoGroups_controller_1 = require("./controller/HomoGroups/HomoGroups.controller");
const CompanyRepository_1 = require("./repositories/implementations/CompanyRepository");
const EmployeeRepository_1 = require("./repositories/implementations/EmployeeRepository");
const HierarchyRepository_1 = require("./repositories/implementations/HierarchyRepository");
const HomoGroupRepository_1 = require("./repositories/implementations/HomoGroupRepository");
const LicenseRepository_1 = require("./repositories/implementations/LicenseRepository");
const WorkspaceRepository_1 = require("./repositories/implementations/WorkspaceRepository");
const create_company_service_1 = require("./services/company/create-company/create-company.service");
const create_contract_service_1 = require("./services/company/create-contract/create-contract.service");
const find_all_companies_service_1 = require("./services/company/find-all-companies/find-all-companies.service");
const find_cep_service_1 = require("./services/company/find-cep/find-cep.service");
const find_cnpj_service_1 = require("./services/company/find-cnpj/find-cnpj.service");
const find_company_service_1 = require("./services/company/find-company/find-company.service");
const update_company_service_1 = require("./services/company/update-company/update-company.service");
const create_employee_service_1 = require("./services/employee/create-employee/create-employee.service");
const find_all_available_employees_service_1 = require("./services/employee/find-all-available-employees/find-all-available-employees.service");
const find_employee_service_1 = require("./services/employee/find-employee/find-employee.service");
const update_employee_service_1 = require("./services/employee/update-employee/update-employee.service");
const create_hierarchies_service_1 = require("./services/hierarchy/create-hierarchies/create-hierarchies.service");
const delete_hierarchies_service_1 = require("./services/hierarchy/delete-hierarchies/delete-hierarchies.service");
const find_all_hierarchies_service_1 = require("./services/hierarchy/find-all-hierarchies/find-all-hierarchies.service");
const update_hierarchies_service_1 = require("./services/hierarchy/update-hierarchies/update-hierarchies.service");
const upsert_many_hierarchies_service_1 = require("./services/hierarchy/upsert-many-hierarchies/upsert-many-hierarchies.service");
const create_homo_group_service_1 = require("./services/homoGroup/create-homo-group/create-homo-group.service");
const delete_homo_group_service_1 = require("./services/homoGroup/delete-homo-group/delete-homo-group.service");
const find_by_company_homo_group_service_1 = require("./services/homoGroup/find-by-company-homo-group/find-by-company-homo-group.service");
const update_homo_group_service_1 = require("./services/homoGroup/update-homo-group/update-homo-group.service");
let CompanyModule = class CompanyModule {
};
CompanyModule = __decorate([
    (0, common_1.Module)({
        controllers: [
            company_controller_1.CompanyController,
            employee_controller_1.EmployeeController,
            hierarchy_controller_1.HierarchyController,
            HomoGroups_controller_1.HomoGroupsController,
        ],
        providers: [
            create_company_service_1.CreateCompanyService,
            update_company_service_1.UpdateCompanyService,
            create_contract_service_1.CreateContractService,
            WorkspaceRepository_1.WorkspaceRepository,
            CompanyRepository_1.CompanyRepository,
            LicenseRepository_1.LicenseRepository,
            EmployeeRepository_1.EmployeeRepository,
            HierarchyRepository_1.HierarchyRepository,
            HomoGroupRepository_1.HomoGroupRepository,
            ExcelProvider_1.ExcelProvider,
            find_all_companies_service_1.FindAllCompaniesService,
            find_company_service_1.FindCompanyService,
            find_employee_service_1.FindEmployeeService,
            create_employee_service_1.CreateEmployeeService,
            update_employee_service_1.UpdateEmployeeService,
            find_all_available_employees_service_1.FindAllAvailableEmployeesService,
            find_all_hierarchies_service_1.FindAllHierarchyService,
            create_hierarchies_service_1.CreateHierarchyService,
            update_hierarchies_service_1.UpdateHierarchyService,
            delete_hierarchies_service_1.DeleteHierarchyService,
            upsert_many_hierarchies_service_1.UpsertManyHierarchyService,
            create_homo_group_service_1.CreateHomoGroupService,
            update_homo_group_service_1.UpdateHomoGroupService,
            delete_homo_group_service_1.DeleteHomoGroupService,
            find_by_company_homo_group_service_1.FindByCompanyHomoGroupService,
            find_cnpj_service_1.FindCnpjService,
            find_cep_service_1.FindCepService,
        ],
        exports: [CompanyRepository_1.CompanyRepository, EmployeeRepository_1.EmployeeRepository, HierarchyRepository_1.HierarchyRepository],
    })
], CompanyModule);
exports.CompanyModule = CompanyModule;
//# sourceMappingURL=company.module.js.map