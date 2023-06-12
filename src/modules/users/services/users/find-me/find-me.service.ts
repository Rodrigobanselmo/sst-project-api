import { ErrorInvitesEnum } from './../../../../../shared/constants/enum/errorMessage';
import { Injectable, BadRequestException } from '@nestjs/common';
import { UsersRepository } from '../../../repositories/implementations/UsersRepository';

@Injectable()
export class FindMeService {
  constructor(private readonly userRepository: UsersRepository) { }
  async execute(id: number, companyId?: string) {
    const user = await this.userRepository.findById(id);
    if (!user?.id) throw new BadRequestException(ErrorInvitesEnum.USER_NOT_FOUND);

    const companies = user.companies
      .map(({ companyId, permissions, roles, status, group }) => {
        if (status.toUpperCase() !== 'ACTIVE') return null;

        return {
          companyId,
          permissions,
          roles,
          ...(group &&
            group?.roles && {
            permissions: group.permissions,
            roles: group.roles,
          }),
        };
      })
      .filter((i) => i);

    const company = companies.find((c) => c.companyId === companyId) || companies[0] || ({} as typeof companies[0]);

    delete user.password;

    return { ...user, ...company };
  }
}
