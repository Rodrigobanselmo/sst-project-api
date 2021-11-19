import { Injectable } from '@nestjs/common';

import { DayJSProvider } from '../../../../../shared/providers/DateProvider/implementations/DayJSProvider';
import { InviteUsersRepository } from '../../../repositories/implementations/InviteUsersRepository';

@Injectable()
export class DeleteExpiredInvitesService {
  constructor(
    private readonly inviteUsersRepository: InviteUsersRepository,
    private readonly dateProvider: DayJSProvider,
  ) {}

  async execute() {
    const currentDate = this.dateProvider.dateNow();
    return this.inviteUsersRepository.deleteAllOldInvites(currentDate);
  }
}
