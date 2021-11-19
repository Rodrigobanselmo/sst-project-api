import { Injectable, NotFoundException } from '@nestjs/common';
import { InviteUsersEntity } from '../../../entities/invite-users.entity';
import { InviteUsersRepository } from '../../../repositories/implementations/InviteUsersRepository';

@Injectable()
export class FindByTokenService {
  constructor(private readonly inviteUsersRepository: InviteUsersRepository) {}
  async execute(token: string) {
    const invite = await this.inviteUsersRepository.findById(token);

    if (!invite) throw new NotFoundException('Invite token not found');

    return new InviteUsersEntity(invite);
  }
}
