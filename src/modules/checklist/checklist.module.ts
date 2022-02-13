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

@Module({
  controllers: [RiskController, RecMedController, ChecklistController],
  providers: [
    RiskRepository,
    CreateRiskService,
    CreateRecMedService,
    CreateChecklistService,
    RecMedRepository,
    ChecklistRepository,
  ],
})
export class ChecklistModule {}
