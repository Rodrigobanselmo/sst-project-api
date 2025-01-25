import { MailAdapter } from '@/@v2/shared/adapters/mail/mail.interface';
import { SharedTokens } from '@/@v2/shared/constants/tokens';
import { Inject, Injectable } from '@nestjs/common';
import { IAuthUserMailAdapter } from './auth-user-mail.interface';
import { captureException } from '@/@v2/shared/utils/helpers/capture-exception';

@Injectable()
export class AuthUserMailAdapter implements IAuthUserMailAdapter {
  constructor(
    @Inject(SharedTokens.Email)
    private readonly mailAdapter: MailAdapter,
  ) {}

  async sendInvite(params: IAuthUserMailAdapter.InviteParams) {
    if (!params.token) return;

    try {
      await this.mailAdapter.sendMail({
        to: params.email,
        type: 'INVITE_USER',
        variables: {
          company: params.companyName,
          link: `${process.env.APP_HOST}/cadastro/?token=${params.token}&email=${params.email}`,
        },
      });
    } catch (error) {
      captureException(error);
    }
  }
}
