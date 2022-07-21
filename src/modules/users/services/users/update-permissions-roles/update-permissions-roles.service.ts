import { ErrorInvitesEnum } from './../../../../../shared/constants/enum/errorMessage';
import { UserPayloadDto } from './../../../../../shared/dto/user-payload.dto';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { UpdateUserCompanyDto } from '../../../dto/update-user-company.dto';
import { UsersCompanyRepository } from '../../../repositories/implementations/UsersCompanyRepository';
import { isMaster } from '../../../../../shared/utils/isMater';

@Injectable()
export class UpdatePermissionsRolesService {
  constructor(
    private readonly usersCompanyRepository: UsersCompanyRepository,
  ) {}

  async execute(
    updateUserCompanyDto: UpdateUserCompanyDto,
    userPayloadDto: UserPayloadDto,
  ) {
    const master = isMaster(userPayloadDto);

    if (updateUserCompanyDto.roles && !master.isMaster) {
      const doesUserHasAllRoles = updateUserCompanyDto.roles.every((role) =>
        userPayloadDto.roles.includes(role),
      );

      if (!doesUserHasAllRoles) {
        throw new ForbiddenException(
          ErrorInvitesEnum.FORBIDDEN_INSUFFICIENT_PERMISSIONS,
        );
      }
    }

    if (updateUserCompanyDto.permissions && !master.isMaster) {
      const doesUserHasAllPermissions = updateUserCompanyDto.permissions.every(
        (permission) => userPayloadDto.permissions.includes(permission),
      );

      if (!doesUserHasAllPermissions) {
        throw new ForbiddenException(
          ErrorInvitesEnum.FORBIDDEN_INSUFFICIENT_PERMISSIONS,
        );
      }
    }

    const user = await this.usersCompanyRepository.update(updateUserCompanyDto);

    return user;
  }
}
