import { AuthGroupRepository } from './../../../../auth/repositories/implementations/AuthGroupRepository';
import { ErrorInvitesEnum } from './../../../../../shared/constants/enum/errorMessage';
import { UserPayloadDto } from './../../../../../shared/dto/user-payload.dto';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { UpdateUserCompanyDto } from '../../../dto/update-user-company.dto';
import { UsersCompanyRepository } from '../../../repositories/implementations/UsersCompanyRepository';
import { isMaster } from '../../../../../shared/utils/isMater';

@Injectable()
export class UpdatePermissionsRolesService {
  constructor(
    private readonly usersCompanyRepository: UsersCompanyRepository,
    private readonly authGroupRepository: AuthGroupRepository,
  ) {}

  async execute(
    updateUserCompanyDto: UpdateUserCompanyDto,
    userPayloadDto: UserPayloadDto,
  ) {
    const userRoles = userPayloadDto.roles || [];
    const userPermissions = userPayloadDto.permissions || [];

    const authGroup = await this.authGroupRepository.findById(
      updateUserCompanyDto.groupId,
      userPayloadDto.companyId,
    );

    if (!authGroup)
      throw new BadRequestException(ErrorInvitesEnum.AUTH_GROUP_NOT_FOUND);

    if (!userPayloadDto.isMaster) {
      const addRoles = [
        ...(userPayloadDto.roles || []),
        ...(authGroup?.roles || []),
      ];

      const addPermissions = [
        ...(userPayloadDto.permissions || []),
        ...(authGroup?.permissions || []),
      ];

      const doesUserHasAllRoles = addRoles.every((role) =>
        userRoles.includes(role),
      );
      const doesUserHasAllPermissions = addPermissions.every((role) =>
        userPermissions.includes(role),
      );

      if (!doesUserHasAllRoles || !doesUserHasAllPermissions) {
        throw new ForbiddenException(
          ErrorInvitesEnum.FORBIDDEN_INSUFFICIENT_PERMISSIONS,
        );
      }
    }

    const user = await this.usersCompanyRepository.update(updateUserCompanyDto);

    return user;
  }
}
