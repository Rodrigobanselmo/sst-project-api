"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SSTModule = void 0;
const upsert_document_pcmso_service_1 = require("./services/documentPcmso/upsert-document-pcmso/upsert-document-pcmso.service");
const common_1 = require("@nestjs/common");
const DayJSProvider_1 = require("../../shared/providers/DateProvider/implementations/DayJSProvider");
const company_module_1 = require("../company/company.module");
const checklist_controller_1 = require("./controller/checklist/checklist.controller");
const doc_version_controller_1 = require("./controller/doc-version/doc-version.controller");
const epi_controller_1 = require("./controller/epi/epi.controller");
const exam_to_clinic_controller_1 = require("./controller/exam-to-clinic/exam-to-clinic.controller");
const examToRisk_controller_1 = require("./controller/exam-to-risk/examToRisk.controller");
const exam_controller_1 = require("./controller/exam/exam.controller");
const generate_source_controller_1 = require("./controller/generate-source/generate-source.controller");
const rec_med_controller_1 = require("./controller/rec-med/rec-med.controller");
const risk_data_rec_controller_1 = require("./controller/risk-data-rec/risk-data-rec.controller");
const risk_data_controller_1 = require("./controller/risk-data/risk-data.controller");
const risk_doc_info_controller_1 = require("./controller/risk-doc-info/risk-doc-info.controller");
const risk_group_data_controller_1 = require("./controller/risk-group-data/risk-group-data.controller");
const risk_controller_1 = require("./controller/risk/risk.controller");
const ChecklistRepository_1 = require("./repositories/implementations/ChecklistRepository");
const DocumentPCMSORepository_1 = require("./repositories/implementations/DocumentPCMSORepository");
const EpiRepository_1 = require("./repositories/implementations/EpiRepository");
const ExamRepository_1 = require("./repositories/implementations/ExamRepository");
const ExamRiskRepository_1 = require("./repositories/implementations/ExamRiskRepository");
const ExamToClinicRepository_1 = require("./repositories/implementations/ExamToClinicRepository");
const GenerateSourceRepository_1 = require("./repositories/implementations/GenerateSourceRepository");
const RecMedRepository_1 = require("./repositories/implementations/RecMedRepository");
const RiskDataRecRepository_1 = require("./repositories/implementations/RiskDataRecRepository");
const RiskDataRepository_1 = require("./repositories/implementations/RiskDataRepository");
const RiskDocInfoRepository_1 = require("./repositories/implementations/RiskDocInfoRepository");
const RiskDocumentRepository_1 = require("./repositories/implementations/RiskDocumentRepository");
const RiskGroupDataRepository_1 = require("./repositories/implementations/RiskGroupDataRepository");
const RiskRepository_1 = require("./repositories/implementations/RiskRepository");
const create_checklist_service_1 = require("./services/checklist/create-checklist/create-checklist.service");
const find_available_checklist_service_1 = require("./services/checklist/find-available-checklist/find-available-checklist.service");
const find_checklist_data_service_1 = require("./services/checklist/find-checklist-data/find-checklist-data.service");
const update_checklist_service_1 = require("./services/checklist/update-checklist/update-checklist.service");
const create_epi_service_1 = require("./services/epi/create-epi/create-epi.service");
const find_ca_epi_service_1 = require("./services/epi/find-ca-epi /find-ca-epi.service");
const find_epi_service_1 = require("./services/epi/find-epi/find-epi.service");
const update_epi_service_1 = require("./services/epi/update-epi/update-epi.service");
const create_exam_service_1 = require("./services/exam/create-exam/create-exam.service");
const delete_soft_exam_service_1 = require("./services/exam/delete-soft-exam/delete-soft-exam.service");
const find_exam_by_hierarchy_service_1 = require("./services/exam/find-by-hierarchy /find-exam-by-hierarchy.service");
const find_exam_service_1 = require("./services/exam/find-exam/find-exam.service");
const update_exam_service_1 = require("./services/exam/update-exam/update-exam.service");
const copy_exam_to_clinic_service_1 = require("./services/examToClinic/copy-exam-to-clinic/copy-exam-to-clinic.service");
const find_exam_to_clinic_service_1 = require("./services/examToClinic/find-exam-to-clinic/find-exam-to-clinic.service");
const upsert_exam_to_clinic_service_1 = require("./services/examToClinic/upsert-exam-to-clinic/upsert-exam-to-clinic.service");
const copy_exam_service_1 = require("./services/examToRisk/copy-exam/copy-exam.service");
const create_exam_service_2 = require("./services/examToRisk/create-exam/create-exam.service");
const find_exam_service_2 = require("./services/examToRisk/find-exam/find-exam.service");
const update_exam_service_2 = require("./services/examToRisk/update-exam/update-exam.service");
const create_generate_source_service_1 = require("./services/generate-source/create-generate-source/create-generate-source.service");
const delete_soft_generate_source_service_1 = require("./services/generate-source/delete-soft-generate-source/delete-soft-generate-source.service");
const update_generate_source_service_1 = require("./services/generate-source/update-generate-source/update-generate-source.service");
const find_by_id_documents_service_1 = require("./services/docVersion/find-by-id-documents/find-by-id-documents.service");
const find_documents_service_1 = require("./services/docVersion/find-documents/find-documents.service");
const create_rec_med_service_1 = require("./services/rec-med/create-rec-med/create-rec-med.service");
const delete_soft_rec_med_service_1 = require("./services/rec-med/delete-soft-rec-med/delete-soft-rec-med.service");
const update_rec_med_service_1 = require("./services/rec-med/update-rec-med/update-rec-med.service");
const upsert_risk_data_rec_service_1 = require("./services/risk-data-rec/upsert-risk-data-rec/upsert-risk-data-rec.service");
const delete_many_risk_data_service_1 = require("./services/risk-data/delete-many-risk-data/delete-many-risk-data.service");
const find_all_action_plan_service_1 = require("./services/risk-data/find-all-action-plan/find-all-action-plan.service");
const find_by_group_risk_service_1 = require("./services/risk-data/find-by-group-risk/find-by-group-risk.service");
const find_by_hierarchy_service_1 = require("./services/risk-data/find-by-hierarchy/find-by-hierarchy.service");
const find_by_homogeneous_group_service_1 = require("./services/risk-data/find-by-homogeneous-group/find-by-homogeneous-group.service");
const upsert_many_risk_data_service_1 = require("./services/risk-data/upsert-many-risk-data/upsert-many-risk-data.service");
const upsert_risk_service_1 = require("./services/risk-data/upsert-risk-data/upsert-risk.service");
const upsert_risk_doc_info_service_1 = require("./services/risk-doc-info/upsert-risk-doc-info/upsert-risk-doc-info.service");
const find_by_company_service_1 = require("./services/risk-group-data/find-by-company/find-by-company.service");
const find_by_id_service_1 = require("./services/risk-group-data/find-by-id/find-by-id.service");
const upsert_risk_group_data_service_1 = require("./services/risk-group-data/upsert-risk-group-data/upsert-risk-group-data.service");
const create_risk_service_1 = require("./services/risk/create-risk/create-risk.service");
const delete_soft_risk_service_1 = require("./services/risk/delete-soft-risk/delete-soft-risk.service");
const find_all_available_risk_service_1 = require("./services/risk/find-all-available-risk/find-all-available-risk.service");
const find_by_company_service_2 = require("./services/risk/find-by-company/find-by-company.service");
const find_service_1 = require("./services/risk/find/find.service");
const update_risk_service_1 = require("./services/risk/update-risk/update-risk.service");
const find_by_id_service_2 = require("./services/documentPcmso/find-by-id/find-by-id.service");
const document_pcmso_controller_1 = require("./controller/document-pcmso/document-pcmso.controller");
const update_protocol_service_1 = require("./services/protocol/update-protocol/update-protocol.service");
const create_protocol_service_1 = require("./services/protocol/create-protocol/create-protocol.service");
const find_protocol_service_1 = require("./services/protocol/find-protocol/find-protocol.service");
const delete_protocol_service_1 = require("./services/protocol/delete-protocol/delete-protocol.service");
const protocol_controller_1 = require("./controller/protocol/protocol.controller");
const update_risk_protocol_service_1 = require("./services/protocol/update-risk-protocol/update-risk-protocol.service");
const ProtocolRepository_1 = require("./repositories/implementations/ProtocolRepository");
const ProtocolRiskRepository_1 = require("./repositories/implementations/ProtocolRiskRepository");
const update_protocol_service_2 = require("./services/protocolToRisk/update-protocol/update-protocol.service");
const find_protocol_service_2 = require("./services/protocolToRisk/find-protocol/find-protocol.service");
const copy_protocol_service_1 = require("./services/protocolToRisk/copy-protocol/copy-protocol.service");
const create_protocol_service_2 = require("./services/protocolToRisk/create-protocol/create-protocol.service");
const protocolToRisk_controller_1 = require("./controller/protocol-to-risk/protocolToRisk.controller");
const find_by_employee_service_1 = require("./services/risk-data/find-by-employee/find-by-employee.service");
let SSTModule = class SSTModule {
};
SSTModule = __decorate([
    (0, common_1.Module)({
        controllers: [
            risk_controller_1.RiskController,
            rec_med_controller_1.RecMedController,
            checklist_controller_1.ChecklistController,
            epi_controller_1.EpiController,
            generate_source_controller_1.GenerateSourceController,
            risk_group_data_controller_1.RiskGroupDataController,
            risk_data_controller_1.RiskDataController,
            doc_version_controller_1.DocumentPgrController,
            risk_data_rec_controller_1.RiskDataRecController,
            exam_controller_1.ExamController,
            exam_to_clinic_controller_1.ExamToClinicController,
            examToRisk_controller_1.ExamRiskController,
            risk_doc_info_controller_1.RiskDocInfoController,
            document_pcmso_controller_1.DocumentPCMSOController,
            protocol_controller_1.ProtocolController,
            protocolToRisk_controller_1.ProtocolToRiskController,
        ],
        providers: [
            ChecklistRepository_1.ChecklistRepository,
            create_checklist_service_1.CreateChecklistService,
            create_epi_service_1.CreateEpiService,
            create_exam_service_1.CreateExamService,
            create_generate_source_service_1.CreateGenerateSourceService,
            create_rec_med_service_1.CreateRecMedService,
            create_risk_service_1.CreateRiskService,
            DayJSProvider_1.DayJSProvider,
            delete_many_risk_data_service_1.DeleteManyRiskDataService,
            delete_soft_exam_service_1.DeleteSoftExamService,
            delete_soft_generate_source_service_1.DeleteSoftGenerateSourceService,
            delete_soft_rec_med_service_1.DeleteSoftRecMedService,
            delete_soft_risk_service_1.DeleteSoftRiskService,
            EpiRepository_1.EpiRepository,
            ExamRepository_1.ExamRepository,
            ExamRiskRepository_1.ExamRiskRepository,
            ExamToClinicRepository_1.ExamToClinicRepository,
            find_all_action_plan_service_1.FindAllActionPlanService,
            find_all_available_risk_service_1.FindAllAvailableRiskService,
            find_by_company_service_1.FindAllByCompanyService,
            find_by_group_risk_service_1.FindAllByGroupAndRiskService,
            find_by_hierarchy_service_1.FindAllByHierarchyService,
            find_by_homogeneous_group_service_1.FindAllByHomogeneousGroupService,
            find_available_checklist_service_1.FindAvailableChecklistService,
            find_ca_epi_service_1.FindByCAEpiService,
            find_by_id_documents_service_1.FindByIdDocumentsService,
            find_by_id_service_1.FindByIdService,
            find_checklist_data_service_1.FindChecklistDataService,
            find_documents_service_1.FindDocumentsService,
            find_epi_service_1.FindEpiService,
            find_exam_service_1.FindExamService,
            find_exam_to_clinic_service_1.FindExamToClinicService,
            GenerateSourceRepository_1.GenerateSourceRepository,
            RecMedRepository_1.RecMedRepository,
            RiskDataRecRepository_1.RiskDataRecRepository,
            RiskDataRepository_1.RiskDataRepository,
            RiskDocumentRepository_1.RiskDocumentRepository,
            RiskGroupDataRepository_1.RiskGroupDataRepository,
            RiskRepository_1.RiskRepository,
            update_checklist_service_1.UpdateChecklistService,
            update_epi_service_1.UpdateEpiService,
            update_exam_service_1.UpdateExamService,
            update_generate_source_service_1.UpdateGenerateSourceService,
            update_rec_med_service_1.UpdateRecMedService,
            update_risk_service_1.UpdateRiskService,
            upsert_exam_to_clinic_service_1.UpsertExamToClinicService,
            upsert_many_risk_data_service_1.UpsertManyRiskDataService,
            upsert_risk_data_rec_service_1.UpsertRiskDataRecService,
            upsert_risk_service_1.UpsertRiskDataService,
            upsert_risk_group_data_service_1.UpsertRiskGroupDataService,
            update_exam_service_2.UpdateExamRiskService,
            find_exam_service_2.FindExamRiskService,
            create_exam_service_2.CreateExamRiskService,
            find_exam_by_hierarchy_service_1.FindExamByHierarchyService,
            RiskDocInfoRepository_1.RiskDocInfoRepository,
            upsert_risk_doc_info_service_1.UpsertRiskDocInfoService,
            find_by_company_service_2.FindRisksByCompanyService,
            copy_exam_service_1.CopyExamRiskService,
            copy_exam_to_clinic_service_1.CopyExamToClinicService,
            find_service_1.FindRiskService,
            DocumentPCMSORepository_1.DocumentPCMSORepository,
            upsert_document_pcmso_service_1.UpsertDocumentPCMSOService,
            find_by_id_service_2.FindByIdDocumentPCMSOService,
            update_protocol_service_1.UpdateProtocolsService,
            create_protocol_service_1.CreateProtocolsService,
            find_protocol_service_1.FindProtocolsService,
            delete_protocol_service_1.DeleteSoftProtocolsService,
            update_risk_protocol_service_1.UpdateRiskProtocolsService,
            ProtocolRepository_1.ProtocolRepository,
            ProtocolRiskRepository_1.ProtocolToRiskRepository,
            copy_protocol_service_1.CopyProtocolToRiskService,
            create_protocol_service_2.CreateProtocolToRiskService,
            find_protocol_service_2.FindProtocolToRiskService,
            update_protocol_service_2.UpdateProtocolToRiskService,
            find_by_employee_service_1.FindAllRiskDataByEmployeeService,
        ],
        exports: [
            RiskRepository_1.RiskRepository,
            RiskGroupDataRepository_1.RiskGroupDataRepository,
            RiskDocumentRepository_1.RiskDocumentRepository,
            upsert_many_risk_data_service_1.UpsertManyRiskDataService,
            RiskDataRepository_1.RiskDataRepository,
            find_exam_by_hierarchy_service_1.FindExamByHierarchyService,
            find_by_employee_service_1.FindAllRiskDataByEmployeeService,
            find_exam_by_hierarchy_service_1.FindExamByHierarchyService,
            ExamRepository_1.ExamRepository,
        ],
        imports: [(0, common_1.forwardRef)(() => company_module_1.CompanyModule)],
    })
], SSTModule);
exports.SSTModule = SSTModule;
//# sourceMappingURL=sst.module.js.map