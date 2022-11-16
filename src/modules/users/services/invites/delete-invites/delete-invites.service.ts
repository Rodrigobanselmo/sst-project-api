import { Injectable } from '@nestjs/common';

import { DeleteInviteDto } from '../../../dto/delete-invite.dto';
import { InviteUsersRepository } from '../../../repositories/implementations/InviteUsersRepository';

@Injectable()
export class DeleteInvitesService {
  constructor(private readonly inviteUsersRepository: InviteUsersRepository) {}

  async execute({ companyId, id }: DeleteInviteDto) {
    const deletedInvites = await this.inviteUsersRepository.deleteById(companyId, id);

    return deletedInvites;
  }
}
