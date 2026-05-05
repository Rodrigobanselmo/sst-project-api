import { UserPayloadDto } from './../../../../../shared/dto/user-payload.dto';
import { BadRequestException, Injectable } from '@nestjs/common';

import { UpsertAccessGroupDto } from './../../../dto/access-group.dto';
import { AuthGroupRepository } from './../../../repositories/implementations/AuthGroupRepository';
import { RoleEnum } from './../../../../../shared/constants/enum/authorization';
import { listMissingAddPermissions } from './../../../../../shared/utils/user-permissions-coverage.util';

@Injectable()
export class UpsertAccessGroupsService {
  constructor(private readonly authGroupRepository: AuthGroupRepository) {}

  async execute(UpsertAccessGroupsDto: UpsertAccessGroupDto, user: UserPayloadDto) {
    const requestedPermissions = UpsertAccessGroupsDto.permissions || [];
    if (requestedPermissions.length > 0 && !user.roles?.includes(RoleEnum.MASTER)) {
      const missing = listMissingAddPermissions(user.permissions || [], requestedPermissions);
      if (missing.length > 0) {
        throw new BadRequestException(
          `O perfil não pode incluir permissões que você não possui. Remova ou ajuste: ${missing.join(', ')}`,
        );
      }
    }

    const system = user.isSystem;
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
