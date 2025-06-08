import { NotificationEnum } from '@/@v2/communications/base/domain/enums/notification.enum';
import { ActionPlanDAO } from '@/@v2/security/action-plan/database/dao/action-plan/action-plan.dao';
import { ActionPlanRepository } from '@/@v2/security/action-plan/database/repositories/action-plan/action-plan.repository';
import { NotificationAdapter } from '@/@v2/shared/adapters/notification/notification.interface';
import { SharedTokens } from '@/@v2/shared/constants/tokens';
import { asyncBatch } from '@/@v2/shared/utils/helpers/async-batch';
import { Inject, Injectable } from '@nestjs/common';
import { IActionPlanUseCase } from './notify-new-tasks-action-plan.types';

@Injectable()
export class NewTasksActionPlanUseCase {
  constructor(
    @Inject(SharedTokens.Notification)
    private readonly notificationService: NotificationAdapter,
    private readonly actionPlanRepository: ActionPlanRepository,
    private readonly actionPlanDAO: ActionPlanDAO,
  ) {}

  async execute(params: IActionPlanUseCase.Params) {
    const data = await this.actionPlanDAO.findNewTasks();

    await asyncBatch({
      items: data,
      batchSize: 10,
      callback: async (batch) => {
        await this.actionPlanRepository.updateResponsibleNotifiedAt({
          ids: batch.ids,
          callback: async () => {
            await this.notificationService.send({
              type: NotificationEnum.ACTION_PLAN_NEW_TASKS,
              companyId: batch.companyId,
              userId: batch.responsibleId,
              ids: batch.ids.slice(0, 50),
            });
          },
        });
      },
    });
  }
}
