import { MailAdapter } from '@/@v2/shared/adapters/mail/mail.interface';
import { SharedTokens } from '@/@v2/shared/constants/tokens';
import { Inject, Injectable } from '@nestjs/common';
import { IActionPlanAllTasksService } from './action-plan-all-tasks.service.types';
import { UserCommunicationDAO } from '@/@v2/communications/base/database/dao/user/user.dao';
import { ActionPlanCommunicationDAO } from '../../database/dao/action-plan/action-plan.dao';
import { ActionPlanStatusTypeColorTranslate, ActionPlanStatusTypeTranslate } from '../../translations/action-plan-status-type.translaton';
import { dateUtils } from '@/@v2/shared/utils/helpers/date-utils';

@Injectable()
export class ActionPlanAllTasksService implements IActionPlanAllTasksService {
  constructor(
    @Inject(SharedTokens.Email)
    private readonly mailAdapter: MailAdapter,
    private readonly userDao: UserCommunicationDAO,
    private readonly actionPlanDAO: ActionPlanCommunicationDAO,
  ) {}

  async send(params: IActionPlanAllTasksService.Params): IActionPlanAllTasksService.Result {
    const user = await this.userDao.find({ id: params.userId });
    const actionPlan = await this.actionPlanDAO.findMany({ ids: params.ids.slice(0, 20) });

    await this.mailAdapter.sendMail({
      type: 'ACTION_PLAN_ALL_TASKS',
      userId: params.userId,
      companyId: params.companyId,
      link: user.getLink(`/dashboard/empresas/${params.companyId}/plano-de-acao`),
      tasks: actionPlan.map((task) => ({
        dueDate: dateUtils(task.dueDate).format('DD/MM/YYYY'),
        title: task.title,
        status: ActionPlanStatusTypeTranslate[task.status],
        statusColor: ActionPlanStatusTypeColorTranslate[task.status],
      })),
    });

    return [undefined, null];
  }
}
