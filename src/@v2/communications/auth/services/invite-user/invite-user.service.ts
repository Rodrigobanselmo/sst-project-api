import { UserCommunicationDAO } from './../../../base/database/dao/user/user.dao';
import { MailAdapter } from '@/@v2/shared/adapters/mail/mail.interface';
import { SharedTokens } from '@/@v2/shared/constants/tokens';
import { Inject, Injectable } from '@nestjs/common';
import { IInviteUserService } from './invite-user.service.types';
import { config } from '@/@v2/shared/constants/config';

@Injectable()
export class InviteUserService implements IInviteUserService {
  constructor(
    @Inject(SharedTokens.Email)
    private readonly mailAdapter: MailAdapter,
    private readonly userDao: UserCommunicationDAO,
  ) {}

  async send(params: IInviteUserService.Params): IInviteUserService.Result {
    const user = await this.userDao.find({ id: params.userId });

    await this.mailAdapter.sendMail({
      userId: params.userId,
      type: 'INVITE_USER',
      link: user.getLink(),
      companyId: params.companyId,
    });

    return [undefined, null];
  }
}
