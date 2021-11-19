import { Injectable } from '@nestjs/common';

import { DeleteInviteDto } from '../../../dto/delete-invite.dto';
import { InviteUsersRepository } from '../../../repositories/implementations/InviteUsersRepository';

@Injectable()
export class DeleteInvitesService {
  constructor(private readonly inviteUsersRepository: InviteUsersRepository) {}

  async execute({ companyId, email }: DeleteInviteDto) {
    const deletedInvites =
      await this.inviteUsersRepository.deleteByCompanyIdAndEmail(
        companyId,
        email,
      );

    return deletedInvites;
  }
}
