import { ActionPlanAllTasksDto } from '@/@v2/shared/adapters/notification/dtos/action-plan/action-plan-all-tasks.dto';
import { validateDto } from '@/@v2/shared/utils/helpers/validate-dto';
import { Injectable } from '@nestjs/common';
import { NotificationEnum } from '../../../domain/enums/notification.enum';
import { INotificationTypeMap } from './notification.types';
import { ActionPlanAllTasksService } from '@/@v2/communications/security/action-plan/services/action-plan-all-tasks/action-plan-all-tasks.service';
import { InviteUserDto } from '@/@v2/shared/adapters/notification/dtos/auth/invite-user.dto';
import { InviteUserService } from '@/@v2/communications/auth/services/invite-user/invite-user.service';
import { ActionPlanNewTasksDto } from '@/@v2/shared/adapters/notification/dtos/action-plan/action-plan-new-tasks.dto';
import { ActionPlanNewTasksService } from '@/@v2/communications/security/action-plan/services/action-plan-new-tasks/action-plan-new-tasks.service';

@Injectable()
export class NotificationUseCase {
  private serviceMap: INotificationTypeMap = {
    [NotificationEnum.ACTION_PLAN_ALL_TASKS]: {
      dto: ActionPlanAllTasksDto,
      service: this.actionPlanAllTasksService,
    },
    [NotificationEnum.ACTION_PLAN_NEW_TASKS]: {
      dto: ActionPlanNewTasksDto,
      service: this.actionPlanNewTasksService,
    },
    [NotificationEnum.INVITE_USER]: {
      dto: InviteUserDto,
      service: this.inviteService,
    },
  };

  constructor(
    private readonly actionPlanAllTasksService: ActionPlanAllTasksService,
    private readonly actionPlanNewTasksService: ActionPlanNewTasksService,
    private readonly inviteService: InviteUserService,
  ) {}

  async execute(type: NotificationEnum, body: any) {
    const map = this.getService(type);

    const [payload, error] = await validateDto<any>(body, map.dto);
    if (error) throw error;

    const [, errorPdf] = await map.service.send(payload);
    if (errorPdf) throw errorPdf;

    return;
  }

  private getService(type: NotificationEnum) {
    const map = this.serviceMap[type];

    if (!map) throw new Error(`Service not found for type: ${type}`);

    return map;
  }
}
