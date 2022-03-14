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

@Module({
  controllers: [RiskController, RecMedController, ChecklistController],
  providers: [
    RiskRepository,
    CreateRiskService,
    CreateRecMedService,
    CreateChecklistService,
    RecMedRepository,
    ChecklistRepository,
    FindAvailableChecklistService,
    FindChecklistDataService,
    UpdateChecklistService,
    FindAllAvailableRiskService,
    UpdateRiskService,
    UpdateRecMedService,
  ],
  exports: [RiskRepository],
})
export class ChecklistModule {}