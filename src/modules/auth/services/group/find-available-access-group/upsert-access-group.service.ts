import { UserPayloadDto } from './../../../../../shared/dto/user-payload.dto';
import { Injectable } from '@nestjs/common';

import { FindAccessGroupDto } from '../../../dto/access-group.dto';
import { AuthGroupRepository } from '../../../repositories/implementations/AuthGroupRepository';

@Injectable()
export class FindAvailableAccessGroupsService {
  constructor(private readonly authGroupRepository: AuthGroupRepository) {}

  async execute({ skip, take, ...query }: FindAccessGroupDto, user: UserPayloadDto) {
    const access = await this.authGroupRepository.findAvailable(user.targetCompanyId, { ...query }, { skip, take });

    return access;
  }
}
