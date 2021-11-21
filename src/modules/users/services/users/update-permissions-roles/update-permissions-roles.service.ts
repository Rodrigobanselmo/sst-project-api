import { Injectable } from '@nestjs/common';
import { UpdateUserCompanyDto } from '../../../dto/update-user-company.dto';
import { UsersCompanyRepository } from '../../../repositories/implementations/UsersCompanyRepository';

@Injectable()
export class UpdatePermissionsRolesService {
  constructor(
    private readonly usersCompanyRepository: UsersCompanyRepository,
  ) {}

  async execute(updateUserCompanyDto: UpdateUserCompanyDto) {
    const user = await this.usersCompanyRepository.update(updateUserCompanyDto);

    return user;
  }
}
