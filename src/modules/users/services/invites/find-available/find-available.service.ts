import { UserPayloadDto } from './../../../../../shared/dto/user-payload.dto';
import { FindInvitesDto } from './../../../dto/invite-user.dto';
import { Injectable } from '@nestjs/common';

import { InviteUsersRepository } from '../../../repositories/implementations/InviteUsersRepository';

@Injectable()
export class FindAvailableService {
  constructor(private readonly inviteUsersRepository: InviteUsersRepository) {}

  async execute(
    { skip, take, ...query }: FindInvitesDto,
    user: UserPayloadDto,
  ) {
    const access = await this.inviteUsersRepository.find(
      { ...query },
      { skip, take },
    );

    return access;
  }
}
