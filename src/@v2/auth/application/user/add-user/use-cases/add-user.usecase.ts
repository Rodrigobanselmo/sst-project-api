import { AuthUserMailAdapter } from '@/@v2/auth/adapters/mail/auth-user-mail.adapter.ts';
import { ProfileAggregateRepository } from '@/@v2/auth/database/repositories/aggregates/profile-aggregate/profile-aggregate.repository';
import { AccessGroupRepository } from '@/@v2/auth/database/repositories/entities/access-group/access-group.repository';
import { UserRepository } from '@/@v2/auth/database/repositories/entities/user/user.repository';
import { ProfileAggregate } from '@/@v2/auth/domain/aggregate/profile.aggregate';
import { AccessGroupEntity } from '@/@v2/auth/domain/entities/access-group.entity';
import { ProfileEntity } from '@/@v2/auth/domain/entities/profile.entity';
import { UserEntity } from '@/@v2/auth/domain/entities/user.entity';
import { LocalContext, UserContext } from '@/@v2/shared/adapters/context';
import { ContextKey } from '@/@v2/shared/adapters/context/types/enum/context-key.enum';
import { SharedTokens } from '@/@v2/shared/constants/tokens';
import { BusinessGroupUserScopeService } from '@/modules/users/services/shared/business-group-user-scope.service';
import { UsersCompanyRepository } from '@/modules/users/repositories/implementations/UsersCompanyRepository';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { StatusEnum } from '@prisma/client';
import { IAddUserUseCase } from './add-user.types';
import { EmployeeRepository } from '@/@v2/auth/database/repositories/entities/employee/employee.repository';

@Injectable()
export class AddUserUseCase {
  constructor(
    @Inject(SharedTokens.Context)
    private readonly context: LocalContext,
    private readonly authUserMailAdapter: AuthUserMailAdapter,
    private readonly userRepository: UserRepository,
    private readonly profileAggregateRepository: ProfileAggregateRepository,
    private readonly accessGroupRepository: AccessGroupRepository,
    private readonly employeeRepository: EmployeeRepository,
    private readonly businessGroupUserScopeService: BusinessGroupUserScopeService,
    private readonly usersCompanyRepository: UsersCompanyRepository,
  ) {}

  async execute(params: IAddUserUseCase.Params): Promise<IAddUserUseCase.Result> {
    const loggedUser = this.context.get<UserContext>(ContextKey.USER);
    const user = await this.getOrCreateUser(params);
    const accessGroup = await this.accessGroupRepository.find({ id: params.groupId });

    if (!accessGroup) throw new BadRequestException('Grupo de acesso não encontrado');

    const hasPermissions = this.checkPermissions(loggedUser, accessGroup);
    if (!hasPermissions) {
      throw new BadRequestException('Você não tem permissão para criar/editar um usuário com essas credenciais');
    }

    const existingOnBase = await this.profileAggregateRepository.find({
      userId: user.id,
      companyId: params.companyId,
    });

    if (existingOnBase) {
      if (params.employeeId) {
        const employee = await this.employeeRepository.find({ id: params.employeeId });
        if (!employee) throw new BadRequestException('Funcionário não encontrado');

        const [, error] = existingOnBase.setEmployee(employee);
        if (error) throw new BadRequestException(error);

        await this.profileAggregateRepository.update(existingOnBase);

        return { id: user.id };
      }

      throw new BadRequestException('Usuário já cadastrado');
    }

    if (!params.companiesIds?.length) {
      return this.createSingleCompanyProfile(params, user, accessGroup);
    }

    return this.createMultiCompanyProfiles(params, user, accessGroup, loggedUser);
  }

  private async createSingleCompanyProfile(
    params: IAddUserUseCase.Params,
    user: UserEntity,
    accessGroup: AccessGroupEntity,
  ): Promise<IAddUserUseCase.Result> {
    const profileEntity = new ProfileEntity({
      companyId: params.companyId,
      userId: user.id,
      accessGroup,
    });

    const profileAggregate = new ProfileAggregate({
      profile: profileEntity,
      user,
      employee: null,
    });

    if (params.employeeId) {
      const employee = await this.employeeRepository.find({ id: params.employeeId });
      if (!employee) throw new BadRequestException('Funcionário não encontrado');

      const [, error] = profileAggregate.setEmployee(employee);
      if (error) throw new BadRequestException(error);
    }

    await this.profileAggregateRepository.create(profileAggregate);

    if (user.email) {
      this.authUserMailAdapter.sendInvite({ user, companyId: params.companyId });
    }

    return { id: user.id };
  }

  private async createMultiCompanyProfiles(
    params: IAddUserUseCase.Params,
    user: UserEntity,
    accessGroup: AccessGroupEntity,
    loggedUser: UserContext,
  ): Promise<IAddUserUseCase.Result> {
    const { validatedCompanyIds } = await this.businessGroupUserScopeService.validateRequestedCompanyIds({
      baseCompanyId: params.companyId,
      requestedCompanyIds: params.companiesIds,
      operatorUserId: loggedUser.id,
      operatorCompanyId: params.companyId,
      isMaster: loggedUser.isAdmin,
    });

    const companiesToLink: string[] = [];

    for (const companyId of validatedCompanyIds) {
      const existingProfile = await this.profileAggregateRepository.find({
        userId: user.id,
        companyId,
      });

      if (existingProfile) {
        if (companyId === params.companyId && !params.employeeId) {
          throw new BadRequestException('Usuário já cadastrado');
        }

        continue;
      }

      companiesToLink.push(companyId);
    }

    if (!companiesToLink.length) {
      throw new BadRequestException('Usuário já cadastrado em todas as empresas selecionadas');
    }

    await this.usersCompanyRepository.upsertMany({
      userId: user.id,
      companyId: params.companyId,
      companiesIds: companiesToLink,
      groupId: accessGroup.id,
      roles: accessGroup.roles,
      permissions: accessGroup.permissions,
      status: StatusEnum.ACTIVE,
    });

    if (params.employeeId) {
      const employee = await this.employeeRepository.find({ id: params.employeeId });
      if (!employee) throw new BadRequestException('Funcionário não encontrado');

      const profileOnBase = await this.profileAggregateRepository.find({
        userId: user.id,
        companyId: params.companyId,
      });

      if (profileOnBase) {
        const [, error] = profileOnBase.setEmployee(employee);
        if (error) throw new BadRequestException(error);
        await this.profileAggregateRepository.update(profileOnBase);
      }
    }

    if (user.email) {
      this.authUserMailAdapter.sendInvite({ user, companyId: params.companyId });
    }

    return { id: user.id };
  }

  private getOrCreateUser = async (params: IAddUserUseCase.Params): Promise<UserEntity> => {
    const user = params.email ? await this.userRepository.findByEmail({ email: params.email }) : null;
    if (user) return user;

    const entity = new UserEntity({
      email: params.email,
      cpf: params.cpf,
      name: params.name,
      phone: params.phone,
    });

    const createdUser = await this.userRepository.create(entity);
    if (!createdUser) throw new BadRequestException('Erro ao criar usuário');

    return createdUser;
  };

  private checkPermissions = (loggedUser: UserContext, accessGroup: AccessGroupEntity) => {
    if (!loggedUser.isAdmin) {
      /** Papéis do grupo são organizacionais; escalonamento real é por permissions efetivas. */
      const hasAllPermissions = accessGroup.checkAllPermissions(loggedUser.permissions);
      if (!hasAllPermissions) return false;
    }

    return true;
  };
}
