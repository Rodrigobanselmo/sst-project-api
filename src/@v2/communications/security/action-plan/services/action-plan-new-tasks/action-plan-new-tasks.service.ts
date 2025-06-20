import { Inject, Injectable } from '@nestjs/common';
import { IActionPlanNewTasksService } from './action-plan-new-tasks.service.types';
import { SharedTokens } from '@/@v2/shared/constants/tokens';
import { MailAdapter } from '@/@v2/shared/adapters/mail/mail.interface';
import { config } from '@/@v2/shared/constants/config';
import { UserCommunicationDAO } from '@/@v2/communications/base/database/dao/user/user.dao';
import { ActionPlanCommunicationDAO } from '../../database/dao/action-plan/action-plan.dao';
import { dateUtils } from '@/@v2/shared/utils/helpers/date-utils';
import { ActionPlanStatusTypeColorTranslate, ActionPlanStatusTypeTranslate } from '../../translations/action-plan-status-type.translaton';
import { CompanyCommunicationDAO } from '@/@v2/communications/base/database/dao/company/company.dao';

@Injectable()
export class ActionPlanNewTasksService implements IActionPlanNewTasksService {
  constructor(
    @Inject(SharedTokens.Email)
    private readonly mailAdapter: MailAdapter,
    private readonly userDao: UserCommunicationDAO,
    private readonly companyDao: CompanyCommunicationDAO,
    private readonly actionPlanDAO: ActionPlanCommunicationDAO,
  ) {}

  async send(params: IActionPlanNewTasksService.Params): IActionPlanNewTasksService.Result {
    const userPromise = this.userDao.find({ id: params.userId });
    const actionPlanPromise = this.actionPlanDAO.findMany({ ids: params.ids.slice(0, 10) });
    const flagsPromise = this.companyDao.findFlags({ companyId: params.companyId });

    const [user, actionPlan, flags] = await Promise.all([userPromise, actionPlanPromise, flagsPromise]);

    if (!user || !actionPlan.length) return [, null];
    if (!flags.actionPlanNotificationsEnabled) return [, null];

    await this.mailAdapter.sendMail({
      type: 'ACTION_PLAN_NEW_TASKS',
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

    return [, null];
  }
}
