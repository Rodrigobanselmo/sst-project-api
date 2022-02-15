import { Injectable, BadRequestException } from '@nestjs/common';
import { UsersRepository } from '../../../repositories/implementations/UsersRepository';

@Injectable()
export class FindMeService {
  constructor(private readonly userRepository: UsersRepository) {}
  async execute(id: number, companyId?: string) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new BadRequestException(`user with id ${id} not found`);

    const companies = user.companies
      .map(({ companyId, permissions, roles, status }) => {
        if (status.toUpperCase() !== 'ACTIVE') return null;

        return {
          companyId,
          permissions,
          roles,
        };
      })
      .filter((i) => i);

    const company =
      companies.find((c) => c.companyId === companyId) ||
      companies[0] ||
      ({} as typeof companies[0]);

    return { ...user, ...company };
  }
}
