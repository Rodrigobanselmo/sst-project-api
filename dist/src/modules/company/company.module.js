"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyModule = void 0;
const employee_exam_cron_1 = require("./crons/employee-exam/employee-exam.cron");
const delete_exam_file_service_1 = require("./services/employee/0-history/exams/delete-exam-file/delete-exam-file.service");
const download_exam_service_1 = require("./services/employee/0-history/exams/download-exam/download-exam.service");
const upload_exam_file_service_1 = require("./services/employee/0-history/exams/upload-exam-file/upload-exam-file.service");
const update_many_service_1 = require("./services/employee/0-history/exams/update-many/update-many.service");
const common_1 = require("@nestjs/common");
const ExcelProvider_1 = require("../../shared/providers/ExcelProvider/implementations/ExcelProvider");
const AmazonStorageProvider_1 = require("../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider");
const RiskGroupDataRepository_1 = require("../sst/repositories/implementations/RiskGroupDataRepository");
const characterization_controller_1 = require("./controller/characterization/characterization.controller");
const company_controller_1 = require("./controller/company/company.controller");
const employee_controller_1 = require("./controller/employee/employee.controller");
const environment_controller_1 = require("./controller/environment/environment.controller");
const hierarchy_controller_1 = require("./controller/hierarchy/hierarchy.controller");
const HomoGroups_controller_1 = require("./controller/HomoGroups/HomoGroups.controller");
const ActivityRepository_1 = require("./repositories/implementations/ActivityRepository");
const CharacterizationPhotoRepository_1 = require("./repositories/implementations/CharacterizationPhotoRepository");
const CharacterizationRepository_1 = require("./repositories/implementations/CharacterizationRepository");
const CompanyRepository_1 = require("./repositories/implementations/CompanyRepository");
const EmployeeRepository_1 = require("./repositories/implementations/EmployeeRepository");
const CompanyClinicRepository_1 = require("./repositories/implementations/CompanyClinicRepository");
const EnvironmentPhotoRepository_1 = require("./repositories/implementations/EnvironmentPhotoRepository");
const EnvironmentRepository_1 = require("./repositories/implementations/EnvironmentRepository");
const HierarchyRepository_1 = require("./repositories/implementations/HierarchyRepository");
const HomoGroupRepository_1 = require("./repositories/implementations/HomoGroupRepository");
const LicenseRepository_1 = require("./repositories/implementations/LicenseRepository");
const WorkspaceRepository_1 = require("./repositories/implementations/WorkspaceRepository");
const add_characterization_photo_service_1 = require("./services/characterization/add-characterization-photo/add-characterization-photo.service");
const delete_characterization_photo_service_1 = require("./services/characterization/delete-characterization-photo/delete-characterization-photo.service");
const delete_characterization_service_1 = require("./services/characterization/delete-characterization/delete-characterization.service");
const find_all_characterization_service_1 = require("./services/characterization/find-all-characterization/find-all-characterization.service");
const find_by_id_characterization_service_1 = require("./services/characterization/find-by-id-characterization/find-by-id-characterization.service");
const upsert_characterization_service_1 = require("./services/characterization/upsert-characterization/upsert-characterization.service");
const add_company_photo_service_1 = require("./services/company/add-company-photo/add-company-photo.service");
const copy_company_service_1 = require("./services/company/copy-company/copy-company.service");
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
const add_environment_photo_service_1 = require("./services/environment/add-environment-photo/add-environment-photo.service");
const delete_environment_photo_service_1 = require("./services/environment/delete-environment-photo/delete-environment-photo.service");
const delete_environment_service_1 = require("./services/environment/delete-environment/delete-environment.service");
const find_all_environment_service_1 = require("./services/environment/find-all-environment/find-all-environment.service");
const find_by_id_environment_service_1 = require("./services/environment/find-by-id-environment/find-by-id-environment.service");
const upsert_environment_service_1 = require("./services/environment/upsert-environment/upsert-environment.service");
const find_hierarchy_service_1 = require("./services/hierarchy/find-hierarchy/find-hierarchy.service");
const create_hierarchies_service_1 = require("./services/hierarchy/create-hierarchies/create-hierarchies.service");
const delete_hierarchies_service_1 = require("./services/hierarchy/delete-hierarchies/delete-hierarchies.service");
const find_all_hierarchies_service_1 = require("./services/hierarchy/find-all-hierarchies/find-all-hierarchies.service");
const update_hierarchies_service_1 = require("./services/hierarchy/update-hierarchies/update-hierarchies.service");
const upsert_many_hierarchies_service_1 = require("./services/hierarchy/upsert-many-hierarchies/upsert-many-hierarchies.service");
const create_homo_group_service_1 = require("./services/homoGroup/create-homo-group/create-homo-group.service");
const delete_homo_group_service_1 = require("./services/homoGroup/delete-homo-group/delete-homo-group.service");
const find_by_company_homo_group_service_1 = require("./services/homoGroup/find-by-company-homo-group/find-by-company-homo-group.service");
const update_homo_group_service_1 = require("./services/homoGroup/update-homo-group/update-homo-group.service");
const update_environment_photo_service_1 = require("./services/environment/update-environment-photo/update-environment-photo.service");
const update_characterization_photo_service_1 = require("./services/characterization/update-characterization-photo/update-characterization-photo.service");
const RiskDataRepository_1 = require("../sst/repositories/implementations/RiskDataRepository");
const upsert_many_hierarchies_service_2 = require("./services/hierarchy/update-simple-many-hierarchies /upsert-many-hierarchies.service");
const group_controller_1 = require("./controller/group/group.controller");
const CompanyGroupRepository_1 = require("./repositories/implementations/CompanyGroupRepository");
const find_company_groups_group_service_1 = require("./services/group/find-company-groups-group/find-company-groups-group.service");
const upsert_company_group_service_1 = require("./services/group/upsert-company-group/upsert-company-group.service");
const find_all_companies_service_2 = require("./services/company/find-all-user-companies /find-all-companies.service");
const copy_homo_group_service_1 = require("./services/homoGroup/copy-homo-group/copy-homo-group.service");
const sst_module_1 = require("../sst/sst.module");
const create_sub_hierarchies_service_1 = require("./services/hierarchy/create-sub-hierarchies/create-sub-hierarchies.service");
const delete_sub_office_employee_service_1 = require("./services/employee/delete-sub-office-employee/delete-sub-office-employee.service");
const ContactRepository_1 = require("./repositories/implementations/ContactRepository");
const update_contact_service_1 = require("./services/contact/update-contact/update-contact.service");
const find_company_groups_group_service_2 = require("./services/contact/find-contact/find-company-groups-group.service");
const create_contact_service_1 = require("./services/contact/create-contact/create-contact.service");
const contact_controller_1 = require("./controller/contact/contact.controller");
const delete_contact_service_1 = require("./services/contact/delete-contact/delete-contact.service");
const find_cnae_service_1 = require("./services/company/find-cnae/find-cnae.service");
const create_service_1 = require("./services/employee/0-history/hierarchy/create/create.service");
const delete_service_1 = require("./services/employee/0-history/hierarchy/delete/delete.service");
const find_service_1 = require("./services/employee/0-history/hierarchy/find/find.service");
const EmployeeHierarchyHistoryRepository_1 = require("./repositories/implementations/EmployeeHierarchyHistoryRepository");
const employee_hierarchy_history_controller_1 = require("./controller/employee/employee-hierarchy-history.controller");
const update_service_1 = require("./services/employee/0-history/hierarchy/update/update.service");
const set_company_clinics_service_1 = require("./services/company/set-company-clinics/set-company-clinics.service");
const find_service_2 = require("./services/employee/0-history/exams/find/find.service");
const EmployeeExamsHistoryRepository_1 = require("./repositories/implementations/EmployeeExamsHistoryRepository");
const create_service_2 = require("./services/employee/0-history/exams/create/create.service");
const update_service_2 = require("./services/employee/0-history/exams/update/update.service");
const delete_service_2 = require("./services/employee/0-history/exams/delete/delete.service");
const employee_exam_history_controller_1 = require("./controller/employee/employee-exam-history.controller");
const find_by_id_service_1 = require("./services/employee/0-history/exams/find-by-id/find-by-id.service");
const DayJSProvider_1 = require("../../shared/providers/DateProvider/implementations/DayJSProvider");
const find_clinic_service_1 = require("./services/company/find-clinic/find-clinic.service");
const find_schedule_service_1 = require("./services/employee/0-history/exams/find-schedule/find-schedule.service");
const find_clinic_schedules_service_1 = require("./services/employee/0-history/exams/find-clinic-schedules/find-clinic-schedules.service");
const notifications_module_1 = require("../notifications/notifications.module");
const find_company_schedules_service_1 = require("./services/employee/0-history/exams/find-company-schedules/find-company-schedules.service");
const DocumentRepository_1 = require("./repositories/implementations/DocumentRepository");
const document_controller_1 = require("./controller/document/document.controller");
const delete_document_service_1 = require("./services/document/delete-document/delete-document.service");
const find_document_service_1 = require("./services/document/find-document/find-document.service");
const create_document_service_1 = require("./services/document/create-document/create-document.service");
const update_document_service_1 = require("./services/document/update-document/update-document.service");
const find_by_id_document_service_1 = require("./services/document/find-by-id-document/find-by-id-document.service");
const download_document_service_1 = require("./services/document/download-document/download-document.service");
const update_all_companies_service_1 = require("./services/report/update-all-companies/update-all-companies.service");
const dashboard_company_service_1 = require("./services/report/dashboard-company/dashboard-company.service");
const nestjs_telegram_1 = require("nestjs-telegram");
const CompanyReportRepository_1 = require("./repositories/implementations/CompanyReportRepository");
const copy_characterization_service_1 = require("./services/characterization/copy-characterization/copy-characterization.service");
const CidRepository_1 = require("./repositories/implementations/CidRepository");
const update_hierarchy_homo_group_service_1 = require("./services/homoGroup/update-hierarchy-homo-group/update-hierarchy-homo-group.service");
const find_homo_group_service_1 = require("./services/homoGroup/find-homo-group/find-homo-group.service");
const find_homo_group_by_id_service_1 = require("./services/homoGroup/find-homo-group-by-id/find-homo-group-by-id.service");
const esocial_module_1 = require("../esocial/esocial.module");
const update_esocial_report_service_1 = require("./services/report/update-esocial-report/update-esocial-report.service");
const EmployeePPPHistoryRepository_1 = require("./repositories/implementations/EmployeePPPHistoryRepository");
let CompanyModule = class CompanyModule {
};
CompanyModule = __decorate([
    (0, common_1.Module)({
        imports: [
            (0, common_1.forwardRef)(() => sst_module_1.SSTModule),
            (0, common_1.forwardRef)(() => notifications_module_1.NotificationModule),
            (0, common_1.forwardRef)(() => esocial_module_1.EsocialModule),
            nestjs_telegram_1.TelegramModule.forRoot({
                botKey: process.env.TELEGRAM_TOKEN,
            }),
        ],
        controllers: [
            company_controller_1.CompanyController,
            employee_controller_1.EmployeeController,
            hierarchy_controller_1.HierarchyController,
            HomoGroups_controller_1.HomoGroupsController,
            environment_controller_1.EnvironmentController,
            characterization_controller_1.CharacterizationController,
            group_controller_1.CompanyGroupController,
            contact_controller_1.ContactController,
            employee_hierarchy_history_controller_1.EmployeeHierarchyHistoryController,
            employee_exam_history_controller_1.EmployeeExamHistoryController,
            document_controller_1.DocumentController,
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
            upsert_environment_service_1.UpsertEnvironmentService,
            find_all_environment_service_1.FindAllEnvironmentService,
            delete_environment_service_1.DeleteEnvironmentService,
            EnvironmentRepository_1.EnvironmentRepository,
            AmazonStorageProvider_1.AmazonStorageProvider,
            EnvironmentPhotoRepository_1.EnvironmentPhotoRepository,
            add_environment_photo_service_1.AddEnvironmentPhotoService,
            delete_environment_photo_service_1.DeleteEnvironmentPhotoService,
            add_company_photo_service_1.AddCompanyPhotoService,
            upsert_characterization_service_1.UpsertCharacterizationService,
            find_all_characterization_service_1.FindAllCharacterizationService,
            delete_characterization_service_1.DeleteCharacterizationService,
            CharacterizationPhotoRepository_1.CharacterizationPhotoRepository,
            add_characterization_photo_service_1.AddCharacterizationPhotoService,
            delete_characterization_photo_service_1.DeleteCharacterizationPhotoService,
            CharacterizationRepository_1.CharacterizationRepository,
            copy_company_service_1.CopyCompanyService,
            RiskGroupDataRepository_1.RiskGroupDataRepository,
            RiskDataRepository_1.RiskDataRepository,
            ActivityRepository_1.ActivityRepository,
            find_by_id_environment_service_1.FindByIdEnvironmentService,
            find_by_id_characterization_service_1.FindByIdCharacterizationService,
            find_hierarchy_service_1.FindHierarchyService,
            update_environment_photo_service_1.UpdateEnvironmentPhotoService,
            update_characterization_photo_service_1.UpdateCharacterizationPhotoService,
            upsert_many_hierarchies_service_2.UpdateSimpleManyHierarchyService,
            CompanyGroupRepository_1.CompanyGroupRepository,
            find_company_groups_group_service_1.FindAvailableCompanyGroupsService,
            upsert_company_group_service_1.UpsertCompanyGroupsService,
            find_all_companies_service_2.FindAllUserCompaniesService,
            copy_homo_group_service_1.CopyHomoGroupService,
            create_sub_hierarchies_service_1.CreateSubHierarchyService,
            delete_sub_office_employee_service_1.DeleteSubOfficeEmployeeService,
            ContactRepository_1.ContactRepository,
            update_contact_service_1.UpdateContactsService,
            create_contact_service_1.CreateContactsService,
            find_company_groups_group_service_2.FindContactsService,
            delete_contact_service_1.DeleteContactsService,
            update_document_service_1.UpdateDocumentService,
            create_document_service_1.CreateDocumentService,
            find_document_service_1.FindDocumentService,
            delete_document_service_1.DeleteDocumentService,
            find_cnae_service_1.FindCnaeService,
            EmployeeHierarchyHistoryRepository_1.EmployeeHierarchyHistoryRepository,
            create_service_1.CreateEmployeeHierarchyHistoryService,
            create_service_1.CreateEmployeeHierarchyHistoryService,
            delete_service_1.DeleteEmployeeHierarchyHistoryService,
            find_service_1.FindEmployeeHierarchyHistoryService,
            update_service_1.UpdateEmployeeHierarchyHistoryService,
            set_company_clinics_service_1.SetCompanyClinicsService,
            CompanyClinicRepository_1.CompanyClinicRepository,
            find_service_2.FindEmployeeExamHistoryService,
            EmployeeExamsHistoryRepository_1.EmployeeExamsHistoryRepository,
            create_service_2.CreateEmployeeExamHistoryService,
            update_service_2.UpdateEmployeeExamHistoryService,
            delete_service_2.DeleteEmployeeExamHistoryService,
            find_by_id_service_1.FindByIdEmployeeExamHistoryService,
            find_schedule_service_1.FindScheduleEmployeeExamHistoryService,
            update_many_service_1.UpdateManyScheduleExamHistoryService,
            find_clinic_service_1.FindClinicService,
            find_clinic_schedules_service_1.FindClinicScheduleEmployeeExamHistoryService,
            find_company_schedules_service_1.FindCompanyScheduleEmployeeExamHistoryService,
            DocumentRepository_1.DocumentRepository,
            find_by_id_document_service_1.FindByIdDocumentService,
            DayJSProvider_1.DayJSProvider,
            download_document_service_1.DownloadDocumentService,
            upload_exam_file_service_1.UploadExamFileService,
            delete_exam_file_service_1.DeleteExamFileService,
            download_exam_service_1.DownloadExamService,
            update_all_companies_service_1.UpdateAllCompaniesService,
            employee_exam_cron_1.UpdateCompaniesReportCron,
            dashboard_company_service_1.DashboardCompanyService,
            CompanyReportRepository_1.CompanyReportRepository,
            copy_characterization_service_1.CopyCharacterizationService,
            CidRepository_1.CidRepository,
            update_hierarchy_homo_group_service_1.UpdateHierarchyHomoGroupService,
            find_homo_group_service_1.FindHomogenousGroupService,
            find_homo_group_by_id_service_1.FindHomogenousGroupByIdService,
            update_esocial_report_service_1.UpdateESocialReportService,
            EmployeePPPHistoryRepository_1.EmployeePPPHistoryRepository,
        ],
        exports: [
            CompanyRepository_1.CompanyRepository,
            EmployeeRepository_1.EmployeeRepository,
            HierarchyRepository_1.HierarchyRepository,
            WorkspaceRepository_1.WorkspaceRepository,
            EnvironmentRepository_1.EnvironmentRepository,
            HomoGroupRepository_1.HomoGroupRepository,
            ActivityRepository_1.ActivityRepository,
            CidRepository_1.CidRepository,
            EmployeeExamsHistoryRepository_1.EmployeeExamsHistoryRepository,
            EmployeeHierarchyHistoryRepository_1.EmployeeHierarchyHistoryRepository,
            CompanyReportRepository_1.CompanyReportRepository,
            update_esocial_report_service_1.UpdateESocialReportService,
            EmployeePPPHistoryRepository_1.EmployeePPPHistoryRepository,
        ],
    })
], CompanyModule);
exports.CompanyModule = CompanyModule;
//# sourceMappingURL=company.module.js.map