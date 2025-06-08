import { ActionPlanAllTasksDto } from './dtos/action-plan/action-plan-all-tasks.dto';
import { ActionPlanNewTasksDto } from './dtos/action-plan/action-plan-new-tasks.dto';
import { InviteUserDto } from './dtos/auth/invite-user.dto';

export interface NotificationAdapter {
  send(data: NotificationAdapter.SendNotificationData): Promise<void>;
}

export namespace NotificationAdapter {
  export type SendNotificationData = InviteUserDto | ActionPlanAllTasksDto | ActionPlanNewTasksDto;
}
