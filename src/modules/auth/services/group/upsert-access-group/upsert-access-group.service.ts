import { UserPayloadDto } from './../../../../../shared/dto/user-payload.dto';
import { Injectable } from '@nestjs/common';

import { UpsertAccessGroupDto } from './../../../dto/access-group.dto';
import { AuthGroupRepository } from './../../../repositories/implementations/AuthGroupRepository';

@Injectable()
export class UpsertAccessGroupsService {
  constructor(private readonly authGroupRepository: AuthGroupRepository) {}

  async execute(
    UpsertAccessGroupsDto: UpsertAccessGroupDto,
    user: UserPayloadDto,
  ) {
    const system = user.isMaster;
    const company = await this.authGroupRepository.upsert(
      {
        ...UpsertAccessGroupsDto,
        companyId: user.targetCompanyId,
      },
      system,
    );

    return company;
  }
}
