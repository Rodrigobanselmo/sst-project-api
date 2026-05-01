import { CompanyRepository } from './../../../../company/repositories/implementations/CompanyRepository';
import { RoleEnum } from './../../../../../shared/constants/enum/authorization';
import { AuthGroupRepository } from './../../../../auth/repositories/implementations/AuthGroupRepository';
import { ErrorInvitesEnum } from './../../../../../shared/constants/enum/errorMessage';
import { UserPayloadDto } from './../../../../../shared/dto/user-payload.dto';
import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { UpdateUserCompanyDto } from '../../../dto/update-user-company.dto';
import { UsersCompanyRepository } from '../../../repositories/implementations/UsersCompanyRepository';
import { PrismaService } from '../../../../../prisma/prisma.service';

@Injectable()
export class UpdatePermissionsRolesService {
  constructor(
    private readonly usersCompanyRepository: UsersCompanyRepository,
    private readonly authGroupRepository: AuthGroupRepository,
    private readonly companyRepository: CompanyRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(updateUserCompanyDto: UpdateUserCompanyDto, userPayloadDto: UserPayloadDto) {
    const userRoles = userPayloadDto.roles || [];
    const userPermissions = userPayloadDto.permissions || [];

    const company = await this.companyRepository.findById(updateUserCompanyDto.companyId);

    const isConsulting = company.isConsulting;
    if (!isConsulting) updateUserCompanyDto.companiesIds = [];

    const addRoles: string[] = [...(updateUserCompanyDto.roles || [])];
    const addPermissions: string[] = [...(updateUserCompanyDto.permissions || [])];

    if (updateUserCompanyDto.groupId) {
      const authGroup = await this.authGroupRepository.findById(updateUserCompanyDto.groupId, userPayloadDto.companyId);

      if (!authGroup?.id) throw new BadRequestException(ErrorInvitesEnum.AUTH_GROUP_NOT_FOUND);

      addPermissions.push(...authGroup.permissions);
      addRoles.push(...authGroup.roles);
    }

    if (!userRoles.includes(RoleEnum.MASTER)) {
      const doesUserHasAllRoles = addRoles.every((role) => userRoles.includes(role));
      const doesUserHasAllPermissions = addPermissions.every((addPermission) =>
        userPermissions.some((userPermission) => {
          return (
            userPermission.split('-')[0] === addPermission.split('-')[0] &&
            Array.from(addPermission.split('-')[1] || '').every((crud) =>
              (userPermission.split('-')[1] || '').includes(crud),
            )
          );
        }),
      );

      if (!doesUserHasAllRoles || !doesUserHasAllPermissions) {
        throw new ForbiddenException(ErrorInvitesEnum.FORBIDDEN_INSUFFICIENT_PERMISSIONS);
      }
    }

    /** Igual a FindAllCompaniesService (GET /company): escopo da listagem na edição do usuário. */
    const listingScopeCompanyId = userPayloadDto.isMaster
      ? ''
      : userPayloadDto.companyId ?? updateUserCompanyDto.companyId;

    if (isConsulting) {
      const requestedCompanyIdsRaw = updateUserCompanyDto?.companiesIds || [];
      const requestedCompanyIds = [...new Set(requestedCompanyIdsRaw)];

      /** Vínculos atuais do usuário editado dentro do mesmo escopo GET /company + userId (remoção segura). */
      const manageableExistingPage = await this.companyRepository.findAllRelatedByCompanyId(
        listingScopeCompanyId || null,
        {
          userId: updateUserCompanyDto.userId,
          findAll: true,
        },
        { skip: 0, take: 50_000 },
      );
      const manageableExistingCompanyIds = manageableExistingPage.data.map((row) => row.id);

      /**
       * Carteira atribuível pelo operador (CompaniesTable / picker): mesmo escopo sem filtrar pelo userId editado,
       * para permitir ADICIONAR empresa que ainda não está vinculada ao usuário.
       */
      const assignablePortfolioPage = await this.companyRepository.findAllRelatedByCompanyId(
        listingScopeCompanyId || null,
        {
          findAll: true,
        },
        { skip: 0, take: 50_000 },
      );
      const assignableCompanyIds = assignablePortfolioPage.data.map((row) => row.id);

      const validatedDesiredIds = requestedCompanyIds.filter((id) => assignableCompanyIds.includes(id));
      const requestedRejectedNotInAssignable = requestedCompanyIds.filter((id) => !assignableCompanyIds.includes(id));

      if (requestedRejectedNotInAssignable.length > 0) {
        throw new BadRequestException(
          `Empresa(s) não permitida(s) neste contexto para vínculo: ${requestedRejectedNotInAssignable.join(', ')}`,
        );
      }

      await this.usersCompanyRepository.deleteManageableUserCompanyLinksNotInCompaniesIds(
        updateUserCompanyDto.userId,
        validatedDesiredIds,
        manageableExistingCompanyIds,
      );

      const companiesRowsForUpsert = await this.prisma.company.findMany({
        where: {
          id: { in: validatedDesiredIds },
          deleted_at: null,
        },
        select: { id: true },
      });
      const upsertOrderedCompanyIds = validatedDesiredIds.filter((id) =>
        companiesRowsForUpsert.some((row) => row.id === id),
      );
      const idsRequestedButMissingCompanyRow = validatedDesiredIds.filter(
        (id) => !companiesRowsForUpsert.some((row) => row.id === id),
      );

      if (idsRequestedButMissingCompanyRow.length > 0) {
        throw new BadRequestException(
          `Empresa(s) inválida(s) ou inexistente(s): ${idsRequestedButMissingCompanyRow.join(', ')}`,
        );
      }

      if (upsertOrderedCompanyIds.length > 0) {
        return await this.usersCompanyRepository.upsertMany({
          ...updateUserCompanyDto,
          companiesIds: upsertOrderedCompanyIds,
        });
      }

      return await this.usersCompanyRepository.update(updateUserCompanyDto);
    }

    return await this.usersCompanyRepository.update(updateUserCompanyDto);
  }
}
