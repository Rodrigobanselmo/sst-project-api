import { Injectable } from '@nestjs/common';

import { InviteUsersRepository } from '../../../repositories/implementations/InviteUsersRepository';

@Injectable()
export class FindAllByEmailService {
  constructor(private readonly inviteUsersRepository: InviteUsersRepository) {}

  async execute(email: string) {
    const invite = await this.inviteUsersRepository.findAllByEmail(email);

    return invite;
  }
}
