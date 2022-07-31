import { Injectable, BadRequestException } from '@nestjs/common';
import { InviteUsersRepository } from '../../../repositories/implementations/InviteUsersRepository';

@Injectable()
export class FindByTokenService {
  constructor(private readonly inviteUsersRepository: InviteUsersRepository) {}
  async execute(token: string) {
    const invite = await this.inviteUsersRepository.findById(token);

    if (!invite?.id) throw new BadRequestException('Invite token not found');

    return invite;
  }
}
