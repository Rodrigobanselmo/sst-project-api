import { Module } from '@nestjs/common';
import { ActionPlanDAO } from './database/dao/action-plan/action-plan.dao';
import { BrowseActionPlanController } from './application/action-plan/browse-action-plan/controllers/browse-action-plan.controller';
import { BrowseActionPlanUseCase } from './application/action-plan/browse-action-plan/use-cases/browse-action-plan.usecase';
import { SharedModule } from '@/@v2/shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [
    BrowseActionPlanController,
  ],
  providers: [
    // Database
    ActionPlanDAO,

    // Use Cases
    BrowseActionPlanUseCase,
  ],
  exports: []
})
export class ActionPlanModule { }
