import { Injectable } from '@nestjs/common';

import { InviteUsersRepository } from '../../../repositories/implementations/InviteUsersRepository';

@Injectable()
export class FindAllByCompanyIdService {
  constructor(private readonly inviteUsersRepository: InviteUsersRepository) {}

  async execute(companyId: string) {
    const invite = await this.inviteUsersRepository.findAllByCompanyId(companyId);

    return invite;
  }
}
