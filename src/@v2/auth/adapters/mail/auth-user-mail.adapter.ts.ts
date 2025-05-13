import { MailAdapter } from '@/@v2/shared/adapters/mail/mail.interface';
import { SharedTokens } from '@/@v2/shared/constants/tokens';
import { captureException } from '@/@v2/shared/utils/helpers/capture-exception';
import { Inject, Injectable } from '@nestjs/common';
import { CompanyDAO } from '../../database/dao/company/company.dao';
import { IAuthUserMailAdapter } from './auth-user-mail.interface';

@Injectable()
export class AuthUserMailAdapter implements IAuthUserMailAdapter {
  constructor(
    @Inject(SharedTokens.Email)
    private readonly mailAdapter: MailAdapter,
    private readonly companyDAO: CompanyDAO,
  ) {}

  async sendInvite(params: IAuthUserMailAdapter.InviteParams) {
    if (!params.user.token) return;
    if (!params.user.email) return;

    const company = await this.companyDAO.FindByIdParams({ id: params.companyId });

    try {
      if (!params.user.email) throw new Error('Email not provided');
      if (!company) throw new Error('Company not found');

      await this.mailAdapter.sendMail({
        to: params.user.email || '',
        type: 'INVITE_USER',
        variables: {
          company: company?.name || '',
          link: `${process.env.APP_HOST}/cadastro/?token=${params.user.token}&email=${params.user.email}`,
        },
      });
    } catch (error) {
      captureException(error);
    }
  }
}
