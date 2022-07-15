import { Module } from '@nestjs/common';

import { CompanyModule } from '../company/company.module';
import { ChecklistController } from './controller/checklist/checklist.controller';
import { DocumentPgrController } from './controller/doc-pgr/doc-pgr.controller';
import { EpiController } from './controller/epi/epi.controller';
import { GenerateSourceController } from './controller/generate-source/generate-source.controller';
import { RecMedController } from './controller/rec-med/rec-med.controller';
import { RiskDataController } from './controller/risk-data/risk-data.controller';
import { RiskGroupDataController } from './controller/risk-group-data/risk-group-data.controller';
import { RiskController } from './controller/risk/risk.controller';
import { ChecklistRepository } from './repositories/implementations/ChecklistRepository';
import { EpiRepository } from './repositories/implementations/EpiRepository';
import { GenerateSourceRepository } from './repositories/implementations/GenerateSourceRepository';
import { RecMedRepository } from './repositories/implementations/RecMedRepository';
import { RiskDataRepository } from './repositories/implementations/RiskDataRepository';
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
import { CreateGenerateSourceService } from './services/generate-source/create-generate-source/create-generate-source.service';
import { DeleteSoftGenerateSourceService } from './services/generate-source/delete-soft-generate-source/delete-soft-generate-source.service';
import { UpdateGenerateSourceService } from './services/generate-source/update-generate-source/update-generate-source.service';
import { FindByIdDocumentsService } from './services/pgr-doc/find-by-id-documents/find-by-id-documents.service';
import { FindDocumentsService } from './services/pgr-doc/find-documents/find-documents.service';
import { CreateRecMedService } from './services/rec-med/create-rec-med/create-rec-med.service';
import { DeleteSoftRecMedService } from './services/rec-med/delete-soft-rec-med/delete-soft-rec-med.service';
import { UpdateRecMedService } from './services/rec-med/update-rec-med/update-rec-med.service';
import { DeleteManyRiskDataService } from './services/risk-data/delete-many-risk-data/delete-many-risk-data.service';
import { FindAllByGroupAndRiskService } from './services/risk-data/find-by-group-risk/find-by-group-risk.service';
import { FindAllByHomogeneousGroupService } from './services/risk-data/find-by-homogeneous-group/find-by-homogeneous-group.service';
import { UpsertManyRiskDataService } from './services/risk-data/upsert-many-risk-data/upsert-many-risk-data.service';
import { UpsertRiskDataService } from './services/risk-data/upsert-risk-data/upsert-risk.service';
import { FindAllByCompanyService } from './services/risk-group-data/find-by-company/find-by-company.service';
import { FindByIdService } from './services/risk-group-data/find-by-id/find-by-id.service';
import { UpsertRiskGroupDataService } from './services/risk-group-data/upsert-risk-group-data/upsert-risk-group-data.service';
import { CreateRiskService } from './services/risk/create-risk/create-risk.service';
import { DeleteSoftRiskService } from './services/risk/delete-soft-risk/delete-soft-risk.service';
import { FindAllAvailableRiskService } from './services/risk/find-all-available-risk/find-all-available-risk.service';
import { UpdateRiskService } from './services/risk/update-risk/update-risk.service';

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
  ],
  providers: [
    CreateChecklistService,
    RiskRepository,
    CreateRiskService,
    UpdateRiskService,
    RecMedRepository,
    DeleteSoftGenerateSourceService,
    EpiRepository,
    CreateRecMedService,
    UpdateRecMedService,
    CreateEpiService,
    UpdateEpiService,
    GenerateSourceRepository,
    CreateGenerateSourceService,
    UpdateGenerateSourceService,
    ChecklistRepository,
    FindAvailableChecklistService,
    FindChecklistDataService,
    FindAllByHomogeneousGroupService,
    UpdateChecklistService,
    FindAllAvailableRiskService,
    FindByCAEpiService,
    FindDocumentsService,
    FindEpiService,
    DeleteSoftRiskService,
    DeleteSoftRecMedService,
    FindAllByGroupAndRiskService,
    UpsertRiskDataService,
    FindAllByCompanyService,
    UpsertRiskGroupDataService,
    RiskDataRepository,
    RiskGroupDataRepository,
    RiskDocumentRepository,
    FindByIdService,
    UpsertManyRiskDataService,
    DeleteManyRiskDataService,
    FindByIdDocumentsService,
  ],
  exports: [RiskRepository, RiskGroupDataRepository, RiskDocumentRepository],
  imports: [CompanyModule],
})
export class ChecklistModule {}
