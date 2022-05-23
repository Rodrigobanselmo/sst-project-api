import { GenerateSourceController } from './controller/generate-source/generate-source.controller';
import { Module } from '@nestjs/common';
import { RiskController } from './controller/risk/risk.controller';
import { RiskRepository } from './repositories/implementations/RiskRepository';
import { CreateRiskService } from './services/risk/create-risk/create-risk.service';
import { CreateRecMedService } from './services/rec-med/create-rec-med/create-rec-med.service';
import { CreateChecklistService } from './services/checklist/create-checklist/create-checklist.service';
import { RecMedController } from './controller/rec-med/rec-med.controller';
import { ChecklistController } from './controller/checklist/checklist.controller';
import { RecMedRepository } from './repositories/implementations/RecMedRepository';
import { ChecklistRepository } from './repositories/implementations/ChecklistRepository';
import { FindAvailableChecklistService } from './services/checklist/find-available-checklist/find-available-checklist.service';
import { FindChecklistDataService } from './services/checklist/find-checklist-data/find-checklist-data.service';
import { UpdateChecklistService } from './services/checklist/update-checklist/update-checklist.service';
import { FindAllAvailableRiskService } from './services/risk/find-all-available-risk/find-all-available-risk.service';
import { UpdateRiskService } from './services/risk/update-risk/update-risk.service';
import { UpdateRecMedService } from './services/rec-med/update-rec-med/update-rec-med.service';
import { GenerateSourceRepository } from './repositories/implementations/GenerateSourceRepository';
import { CreateGenerateSourceService } from './services/generate-source/create-generate-source/create-generate-source.service';
import { UpdateGenerateSourceService } from './services/generate-source/update-generate-source/update-generate-source.service';
import { EpiController } from './controller/epi/epi.controller';
import { CreateEpiService } from './services/epi/create-epi/create-epi.service';
import { UpdateEpiService } from './services/epi/update-epi/update-epi.service';
import { EpiRepository } from './repositories/implementations/EpiRepository';
import { FindByCAEpiService } from './services/epi/find-ca-epi /find-ca-epi.service';
import { FindEpiService } from './services/epi/find-epi/find-epi.service';
import { RiskGroupDataController } from './controller/risk-group-data/risk-group-data.controller';
import { RiskDataController } from './controller/risk-data/risk-data.controller';
import { RiskGroupDataRepository } from './repositories/implementations/RiskGroupDataRepository';
import { RiskDataRepository } from './repositories/implementations/RiskDataRepository';
import { UpsertRiskGroupDataService } from './services/risk-group-data/upsert-risk-group-data/upsert-risk-group-data.service';
import { FindAllByCompanyService } from './services/risk-group-data/find-by-company/find-by-company.service';
import { UpsertRiskDataService } from './services/risk-data/upsert-risk-data/upsert-risk.service';
import { FindAllByGroupAndRiskService } from './services/risk-data/find-by-group-risk/find-by-group-risk.service';
import { FindByIdService } from './services/risk-group-data/find-by-id/find-by-id.service';
import { RiskDocumentRepository } from './repositories/implementations/RiskDocumentRepository';
import { FindDocumentsService } from './services/risk-group-data/find-documents/find-documents.service';

@Module({
  controllers: [
    RiskController,
    RecMedController,
    ChecklistController,
    EpiController,
    GenerateSourceController,
    RiskGroupDataController,
    RiskDataController,
  ],
  providers: [
    CreateChecklistService,
    RiskRepository,
    CreateRiskService,
    UpdateRiskService,
    RecMedRepository,
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
    UpdateChecklistService,
    FindAllAvailableRiskService,
    FindByCAEpiService,
    FindDocumentsService,
    FindEpiService,
    FindAllByGroupAndRiskService,
    UpsertRiskDataService,
    FindAllByCompanyService,
    UpsertRiskGroupDataService,
    RiskDataRepository,
    RiskGroupDataRepository,
    RiskDocumentRepository,
    FindByIdService,
  ],
  exports: [RiskRepository, RiskGroupDataRepository, RiskDocumentRepository],
})
export class ChecklistModule {}
