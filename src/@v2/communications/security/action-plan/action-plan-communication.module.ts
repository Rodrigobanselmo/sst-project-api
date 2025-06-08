import { SharedModule } from '@/@v2/shared/shared.module';
import { Module } from '@nestjs/common';
import { ActionPlanAllTasksService } from './services/action-plan-all-tasks/action-plan-all-tasks.service';
import { ActionPlanNewTasksService } from './services/action-plan-new-tasks/action-plan-new-tasks.service';
import { CompanyCommunicationDAO } from '../../base/database/dao/company/company.dao';
import { UserCommunicationDAO } from '../../base/database/dao/user/user.dao';
import { ActionPlanCommunicationDAO } from './database/dao/action-plan/action-plan.dao';

@Module({
  imports: [SharedModule],
  providers: [
    // Consumer
    ActionPlanAllTasksService,
    ActionPlanNewTasksService,

    // Database
    CompanyCommunicationDAO,
    UserCommunicationDAO,
    ActionPlanCommunicationDAO,
  ],
  exports: [ActionPlanAllTasksService, ActionPlanNewTasksService],
})
export class ActionPlanCommunicationModule {}
