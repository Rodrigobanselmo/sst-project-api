import { NotificationAdapter } from '@/@v2/shared/adapters/notification/notification.interface';
import { SharedTokens } from '@/@v2/shared/constants/tokens';
import { captureException } from '@/@v2/shared/utils/helpers/capture-exception';
import { Inject, Injectable } from '@nestjs/common';
import { IAuthUserMailAdapter } from './auth-user-mail.interface';
import { NotificationEnum } from '@/@v2/communications/base/domain/enums/notification.enum';

@Injectable()
export class AuthUserMailAdapter implements IAuthUserMailAdapter {
  constructor(
    @Inject(SharedTokens.Notification)
    private readonly notification: NotificationAdapter,
  ) {}

  async sendInvite(params: IAuthUserMailAdapter.InviteParams) {
    if (!params.user.token) return;

    try {
      await this.notification.send({
        companyId: params.companyId,
        type: NotificationEnum.INVITE_USER,
        userId: params.user.id,
      });
    } catch (error) {
      captureException(error);
    }
  }
}
