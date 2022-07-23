import { RoleEnum } from './../../../../../shared/constants/enum/authorization';
import { CompanyRepository } from './../../../../company/repositories/implementations/CompanyRepository';
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

@Injectable()
export class UpdatePermissionsRolesService {
  constructor(
    private readonly usersCompanyRepository: UsersCompanyRepository,
    private readonly authGroupRepository: AuthGroupRepository,
    private readonly companyRepository: CompanyRepository,
  ) {}

  async execute(
    updateUserCompanyDto: UpdateUserCompanyDto,
    userPayloadDto: UserPayloadDto,
  ) {
    const userRoles = userPayloadDto.roles || [];
    const userPermissions = userPayloadDto.permissions || [];

    const company = await this.companyRepository.findById(
      updateUserCompanyDto.companyId,
    );

    const isConsulting = company.isConsulting;
    if (!isConsulting) updateUserCompanyDto.companiesIds = [];

    const addRoles: string[] = [...(updateUserCompanyDto.roles || [])];
    const addPermissions: string[] = [
      ...(updateUserCompanyDto.permissions || []),
    ];

    if (updateUserCompanyDto.groupId) {
      const authGroup = await this.authGroupRepository.findById(
        updateUserCompanyDto.groupId,
        userPayloadDto.companyId,
      );

      if (!authGroup)
        throw new BadRequestException(ErrorInvitesEnum.AUTH_GROUP_NOT_FOUND);

      addPermissions.push(...authGroup.permissions);
      addRoles.push(...authGroup.roles);
    }

    if (!userRoles.includes(RoleEnum.MASTER)) {
      const doesUserHasAllRoles = addRoles.every((role) =>
        userRoles.includes(role),
      );
      const doesUserHasAllPermissions = addPermissions.every((addPermission) =>
        userPermissions.every(
          (userPermission) =>
            userPermission.split('-')[0] === addPermission.split('-')[0] &&
            Array.from(addPermission.split('-')[1] || '').every((crud) =>
              (userPermission.split('-')[1] || '').includes(crud),
            ),
        ),
      );

      if (!doesUserHasAllRoles || !doesUserHasAllPermissions) {
        throw new ForbiddenException(
          ErrorInvitesEnum.FORBIDDEN_INSUFFICIENT_PERMISSIONS,
        );
      }
    }

    const companies = await this.companyRepository.findAllRelatedByCompanyId(
      updateUserCompanyDto.companyId,
      { companiesIds: updateUserCompanyDto?.companiesIds || [] },
      { skip: 0, take: 100 },
    );

    if (companies && companies.data && companies.data.length > 0) {
      await this.usersCompanyRepository.deleteAllFromConsultant(
        updateUserCompanyDto.userId,
        updateUserCompanyDto.companyId,
      );

      await this.usersCompanyRepository.upsertMany({
        ...updateUserCompanyDto,
        companiesIds: companies.data.map((company) => company.id),
      });
    } else await this.usersCompanyRepository.update(updateUserCompanyDto);
  }
}
