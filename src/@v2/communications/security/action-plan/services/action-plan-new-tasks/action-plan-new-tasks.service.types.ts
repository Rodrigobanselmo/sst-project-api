import { DomainResponse } from '@/@v2/shared/domain/types/shared/domain-response';
import { ISendEmailService } from '../../../../base/types/send-email-service.types';
import { ActionPlanNewTasksDto } from '../../../../../shared/adapters/notification/dtos/action-plan/action-plan-new-tasks.dto';

export type IActionPlanNewTasksService = ISendEmailService<IActionPlanNewTasksService.Params, IActionPlanNewTasksService.Result>;

export namespace IActionPlanNewTasksService {
  export type Params = ActionPlanNewTasksDto;

  export type Result = Promise<DomainResponse<void>>;
}
