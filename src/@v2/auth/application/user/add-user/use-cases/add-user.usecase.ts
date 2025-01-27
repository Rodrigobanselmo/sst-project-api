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
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
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
  ) {}

  async execute(params: IAddUserUseCase.Params): Promise<IAddUserUseCase.Result> {
    const loggedUser = this.context.get<UserContext>(ContextKey.USER);
    const user = await this.getOrCreateUser(params);
    const accessGroup = await this.accessGroupRepository.find({ id: params.groupId });
    const profile = await this.profileAggregateRepository.find({ userId: user.id, companyId: params.companyId });

    if (!accessGroup) throw new BadRequestException('Grupo de acesso não encontrado');
    if (profile) {
      if (params.employeeId) {
        const employee = await this.employeeRepository.find({ id: params.employeeId });
        if (!employee) throw new BadRequestException('Funcionário não encontrado');

        const [, error] = profile.setEmployee(employee);
        if (error) throw new BadRequestException(error);

        await this.profileAggregateRepository.update(profile);

        return { id: user.id };
      }

      throw new BadRequestException('Usuário já cadastrado');
    }

    const hasPermissions = this.checkPermissions(loggedUser, accessGroup);
    if (!hasPermissions) throw new BadRequestException('Você não tem permissão para criar/editar um usuário com essas credênciais');

    const profileEntity = new ProfileEntity({
      companyId: params.companyId,
      userId: user.id,
      accessGroup: accessGroup,
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
      const hasAllRoles = accessGroup.checkAllRoles(loggedUser.roles);
      const hasAllPermissions = accessGroup.checkAllPermissions(loggedUser.permissions);

      if (!hasAllRoles || !hasAllPermissions) return false;
    }

    return true;
  };
}
