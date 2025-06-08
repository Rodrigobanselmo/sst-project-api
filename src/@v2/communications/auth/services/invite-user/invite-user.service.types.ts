import { DomainResponse } from '@/@v2/shared/domain/types/shared/domain-response';
import { ISendEmailService } from '../../../base/types/send-email-service.types';
import { InviteUserDto } from '@/@v2/shared/adapters/notification/dtos/auth/invite-user.dto';

export type IInviteUserService = ISendEmailService<IInviteUserService.Params, IInviteUserService.Result>;

export namespace IInviteUserService {
  export type Params = InviteUserDto;

  export type Result = Promise<DomainResponse<void>>;
}
