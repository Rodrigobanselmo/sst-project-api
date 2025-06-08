import { ActionPlanDAO } from '@/@v2/security/action-plan/database/dao/action-plan/action-plan.dao';
import { NotificationAdapter } from '@/@v2/shared/adapters/notification/notification.interface';
import { SharedTokens } from '@/@v2/shared/constants/tokens';
import { asyncBatch } from '@/@v2/shared/utils/helpers/async-batch';
import { Inject, Injectable } from '@nestjs/common';
import { IActionPlanUseCase } from './notify-all-tasks-action-plan.types';
import { NotificationEnum } from '@/@v2/communications/base/domain/enums/notification.enum';

@Injectable()
export class AllTasksActionPlanUseCase {
  constructor(
    @Inject(SharedTokens.Notification)
    private readonly notificationService: NotificationAdapter,
    private readonly actionPlanDAO: ActionPlanDAO,
  ) {}

  async execute(params: IActionPlanUseCase.Params) {
    const data = await this.actionPlanDAO.findAllTasks();

    await asyncBatch({
      items: data,
      batchSize: 50,
      callback: async (batch) => {
        await this.notificationService.send({
          type: NotificationEnum.ACTION_PLAN_ALL_TASKS,
          companyId: batch.companyId,
          userId: batch.responsibleId,
          ids: batch.ids.slice(0, 50),
        });
      },
    });
  }
}
