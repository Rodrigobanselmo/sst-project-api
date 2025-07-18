import { UpsertDocumentDataService } from './services/documentData/upsert-document-data/upsert-document-data.service';
import { Module, forwardRef } from '@nestjs/common';
import { DayJSProvider } from '../../shared/providers/DateProvider/implementations/DayJSProvider';

import { CompanyModule } from '../company/company.module';
import { ChecklistController } from './controller/checklist/checklist.controller';
import { DocumentPgrController } from './controller/doc-version/doc-version.controller';
import { EpiController } from './controller/epi/epi.controller';
import { ExamToClinicController } from './controller/exam-to-clinic/exam-to-clinic.controller';
import { ExamRiskController } from './controller/exam-to-risk/examToRisk.controller';
import { ExamController } from './controller/exam/exam.controller';
import { GenerateSourceController } from './controller/generate-source/generate-source.controller';
import { RecMedController } from './controller/rec-med/rec-med.controller';
import { RiskDataRecController } from './controller/risk-data-rec/risk-data-rec.controller';
import { RiskDataController } from './controller/risk-data/risk-data.controller';
import { RiskDocInfoController } from './controller/risk-doc-info/risk-doc-info.controller';
import { RiskGroupDataController } from './controller/risk-group-data/risk-group-data.controller';
import { RiskController } from './controller/risk/risk.controller';
import { ChecklistRepository } from './repositories/implementations/ChecklistRepository';
import { DocumentDataRepository } from './repositories/implementations/DocumentDataRepository';
import { EpiRepository } from './repositories/implementations/EpiRepository';
import { ExamRepository } from './repositories/implementations/ExamRepository';
import { ExamRiskRepository } from './repositories/implementations/ExamRiskRepository';
import { ExamToClinicRepository } from './repositories/implementations/ExamToClinicRepository';
import { GenerateSourceRepository } from './repositories/implementations/GenerateSourceRepository';
import { RecMedRepository } from './repositories/implementations/RecMedRepository';
import { RiskDataRecRepository } from './repositories/implementations/RiskDataRecRepository';
import { RiskDataRepository } from './repositories/implementations/RiskDataRepository';
import { RiskDocInfoRepository } from './repositories/implementations/RiskDocInfoRepository';
import { RiskDocumentRepository } from './repositories/implementations/RiskDocumentRepository';
import { RiskGroupDataRepository } from './repositories/implementations/RiskGroupDataRepository';
import { RiskRepository } from './repositories/implementations/RiskRepository';
import { CreateChecklistService } from './services/checklist/create-checklist/create-checklist.service';
import { FindAvailableChecklistService } from './services/checklist/find-available-checklist/find-available-checklist.service';
import { FindChecklistDataService } from './services/checklist/find-checklist-data/find-checklist-data.service';
import { UpdateChecklistService } from './services/checklist/update-checklist/update-checklist.service';
import { CreateEpiService } from './services/epi/create-epi/create-epi.service';
import { FindByCAEpiService } from './services/epi/find-ca-epi /find-ca-epi.service';
import { FindEpiService } from './services/epi/find-epi/find-epi.service';
import { UpdateEpiService } from './services/epi/update-epi/update-epi.service';
import { CreateExamService } from './services/exam/create-exam/create-exam.service';
import { DeleteSoftExamService } from './services/exam/delete-soft-exam/delete-soft-exam.service';
import { FindExamByHierarchyService } from './services/exam/find-by-hierarchy /find-exam-by-hierarchy.service';
import { FindExamService } from './services/exam/find-exam/find-exam.service';
import { UpdateExamService } from './services/exam/update-exam/update-exam.service';
import { CopyExamToClinicService } from './services/examToClinic/copy-exam-to-clinic/copy-exam-to-clinic.service';
import { FindExamToClinicService } from './services/examToClinic/find-exam-to-clinic/find-exam-to-clinic.service';
import { UpsertExamToClinicService } from './services/examToClinic/upsert-exam-to-clinic/upsert-exam-to-clinic.service';
import { CopyExamRiskService } from './services/examToRisk/copy-exam/copy-exam.service';
import { CreateExamRiskService } from './services/examToRisk/create-exam/create-exam.service';
import { FindExamRiskService } from './services/examToRisk/find-exam/find-exam.service';
import { UpdateExamRiskService } from './services/examToRisk/update-exam/update-exam.service';
import { CreateGenerateSourceService } from './services/generate-source/create-generate-source/create-generate-source.service';
import { DeleteSoftGenerateSourceService } from './services/generate-source/delete-soft-generate-source/delete-soft-generate-source.service';
import { UpdateGenerateSourceService } from './services/generate-source/update-generate-source/update-generate-source.service';
import { FindByIdDocumentsService } from './services/docVersion/find-by-id-documents/find-by-id-documents.service';
import { FindDocumentsService } from './services/docVersion/find-documents/find-documents.service';
import { CreateRecMedService } from './services/rec-med/create-rec-med/create-rec-med.service';
import { DeleteSoftRecMedService } from './services/rec-med/delete-soft-rec-med/delete-soft-rec-med.service';
import { UpdateRecMedService } from './services/rec-med/update-rec-med/update-rec-med.service';
import { UpsertRiskDataRecService } from './services/risk-data-rec/upsert-risk-data-rec/upsert-risk-data-rec.service';
import { DeleteManyRiskDataService } from './services/risk-data/delete-many-risk-data/delete-many-risk-data.service';
import { FindAllActionPlanService } from './services/risk-data/find-all-action-plan/find-all-action-plan.service';
import { FindAllByGroupAndRiskService } from './services/risk-data/find-by-group-risk/find-by-group-risk.service';
import { FindAllByHierarchyService } from './services/risk-data/find-by-hierarchy/find-by-hierarchy.service';
import { FindAllByHomogeneousGroupService } from './services/risk-data/find-by-homogeneous-group/find-by-homogeneous-group.service';
import { UpsertManyRiskDataService } from './services/risk-data/upsert-many-risk-data/upsert-many-risk-data.service';
import { UpsertRiskDataService } from './services/risk-data/upsert-risk-data/upsert-risk.service';
import { UpsertRiskDocInfoService } from './services/risk-doc-info/upsert-risk-doc-info/upsert-risk-doc-info.service';
import { FindAllByCompanyService } from './services/risk-group-data/find-by-company/find-by-company.service';
import { FindByIdService } from './services/risk-group-data/find-by-id/find-by-id.service';
import { UpsertRiskGroupDataService } from './services/risk-group-data/upsert-risk-group-data/upsert-risk-group-data.service';
import { CreateRiskService } from './services/risk/create-risk/create-risk.service';
import { DeleteSoftRiskService } from './services/risk/delete-soft-risk/delete-soft-risk.service';
import { FindAllAvailableRiskService } from './services/risk/find-all-available-risk/find-all-available-risk.service';
import { FindRisksByCompanyService } from './services/risk/find-by-company/find-by-company.service';
import { FindRiskService } from './services/risk/find/find.service';
import { UpdateRiskService } from './services/risk/update-risk/update-risk.service';
import { FindByIdDocumentDataService } from './services/documentData/find-by-id/find-by-id.service';
import { DocumentDataController } from './controller/document-data/document-data.controller';
import { UpdateProtocolsService } from './services/protocol/update-protocol/update-protocol.service';
import { CreateProtocolsService } from './services/protocol/create-protocol/create-protocol.service';
import { FindProtocolsService } from './services/protocol/find-protocol/find-protocol.service';
import { DeleteSoftProtocolsService } from './services/protocol/delete-protocol/delete-protocol.service';
import { ProtocolController } from './controller/protocol/protocol.controller';
import { UpdateRiskProtocolsService } from './services/protocol/update-risk-protocol/update-risk-protocol.service';
import { ProtocolRepository } from './repositories/implementations/ProtocolRepository';
import { ProtocolToRiskRepository } from './repositories/implementations/ProtocolRiskRepository';
import { UpdateProtocolToRiskService } from './services/protocolToRisk/update-protocol/update-protocol.service';
import { FindProtocolToRiskService } from './services/protocolToRisk/find-protocol/find-protocol.service';
import { CopyProtocolToRiskService } from './services/protocolToRisk/copy-protocol/copy-protocol.service';
import { CreateProtocolToRiskService } from './services/protocolToRisk/create-protocol/create-protocol.service';
import { ProtocolToRiskController } from './controller/protocol-to-risk/protocolToRisk.controller';
import { FindAllRiskDataByEmployeeService } from './services/risk-data/find-by-employee/find-by-employee.service';
import { CheckEmployeeExamService } from './services/exam/check-employee-exam/check-employee-exam.service';
import { FindRiskByIdService } from './services/risk/find-one/find-one.service';
import { FindRecMedService } from './services/rec-med/find-rec-med/find-rec-med.service';
import { FindGenerateSourceService } from './services/generate-source/find-generate-source/find-generate-source.service';
import { ReloadEmployeeExamTimeService } from './services/exam/reload-employee-exam-time/reload-employee-exam-time.service';
import { DeleteExamToClinicService } from './services/examToClinic/delete-exam-to-clinic/find-exam-to-clinic.service';
import { DeleteSoftExamRiskService } from './services/examToRisk/delete-soft-exam-risk/delete-soft-exam-risk.service';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  controllers: [
    RiskController,
    RecMedController,
    ChecklistController,
    EpiController,
    GenerateSourceController,
    RiskGroupDataController,
    RiskDataController,
    DocumentPgrController,
    RiskDataRecController,
    ExamController,
    ExamToClinicController,
    ExamRiskController,
    RiskDocInfoController,
    DocumentDataController,
    ProtocolController,
    ProtocolToRiskController,
  ],
  providers: [
    ChecklistRepository,
    CreateChecklistService,
    CreateEpiService,
    CreateExamService,
    CreateGenerateSourceService,
    CreateRecMedService,
    CreateRiskService,
    DayJSProvider,
    DeleteManyRiskDataService,
    DeleteSoftExamService,
    DeleteSoftGenerateSourceService,
    DeleteSoftRecMedService,
    DeleteSoftRiskService,
    EpiRepository,
    ExamRepository,
    ExamRiskRepository,
    ExamToClinicRepository,
    FindAllActionPlanService,
    FindAllAvailableRiskService,
    FindAllByCompanyService,
    FindAllByGroupAndRiskService,
    FindAllByHierarchyService,
    FindAllByHomogeneousGroupService,
    FindAvailableChecklistService,
    FindByCAEpiService,
    FindByIdDocumentsService,
    FindByIdService,
    FindChecklistDataService,
    FindDocumentsService,
    FindEpiService,
    FindExamService,
    FindExamToClinicService,
    GenerateSourceRepository,
    RecMedRepository,
    RiskDataRecRepository,
    RiskDataRepository,
    RiskDocumentRepository,
    RiskGroupDataRepository,
    RiskRepository,
    UpdateChecklistService,
    UpdateEpiService,
    UpdateExamService,
    UpdateGenerateSourceService,
    UpdateRecMedService,
    UpdateRiskService,
    UpsertExamToClinicService,
    UpsertManyRiskDataService,
    UpsertRiskDataRecService,
    UpsertRiskDataService,
    UpsertRiskGroupDataService,
    UpdateExamRiskService,
    FindExamRiskService,
    CreateExamRiskService,
    FindExamByHierarchyService,
    RiskDocInfoRepository,
    UpsertRiskDocInfoService,
    FindRisksByCompanyService,
    CopyExamRiskService,
    CopyExamToClinicService,
    FindRiskService,
    DocumentDataRepository,
    UpsertDocumentDataService,
    FindByIdDocumentDataService,
    UpdateProtocolsService,
    CreateProtocolsService,
    FindProtocolsService,
    DeleteSoftProtocolsService,
    UpdateRiskProtocolsService,
    ProtocolRepository,
    ProtocolToRiskRepository,
    CopyProtocolToRiskService,
    CreateProtocolToRiskService,
    FindProtocolToRiskService,
    UpdateProtocolToRiskService,
    FindAllRiskDataByEmployeeService,
    CheckEmployeeExamService,
    FindRiskByIdService,
    FindRecMedService,
    FindGenerateSourceService,
    ReloadEmployeeExamTimeService,
    DeleteExamToClinicService,
    DeleteSoftExamRiskService,
  ],
  exports: [
    RiskRepository,
    RiskGroupDataRepository,
    RiskDocumentRepository,
    UpsertManyRiskDataService,
    UpsertRiskDataService,
    RiskDataRepository,
    FindExamByHierarchyService,
    FindAllRiskDataByEmployeeService,
    FindExamByHierarchyService,
    ExamRepository,
    EpiRepository,
    CheckEmployeeExamService,
    ExamToClinicRepository,
    FindAllAvailableRiskService,
    CreateRecMedService,
    CreateGenerateSourceService,
    CreateRiskService,
    ReloadEmployeeExamTimeService,
    ProtocolToRiskRepository,
  ],
  imports: [forwardRef(() => CompanyModule), CacheModule.register()],
})
export class SSTModule {}
