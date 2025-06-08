import { DomainResponse } from '@/@v2/shared/domain/types/shared/domain-response';
import { ISendEmailService } from '../../../../base/types/send-email-service.types';
import { ActionPlanAllTasksDto } from '../../../../../shared/adapters/notification/dtos/action-plan/action-plan-all-tasks.dto';

export type IActionPlanAllTasksService = ISendEmailService<IActionPlanAllTasksService.Params, IActionPlanAllTasksService.Result>;

export namespace IActionPlanAllTasksService {
  export type Params = ActionPlanAllTasksDto;

  export type Result = Promise<DomainResponse<void>>;
}
