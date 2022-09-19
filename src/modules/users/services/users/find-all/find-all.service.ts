import { Injectable } from '@nestjs/common';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';

import { UsersRepository } from '../../../repositories/implementations/UsersRepository';

@Injectable()
export class FindAllByCompanyService {
  constructor(private readonly userRepository: UsersRepository) {}
  async execute(user: UserPayloadDto) {
    const users = await this.userRepository.findAllByCompany(
      user.targetCompanyId,
    );

    return users.map((userCompany) => {
      // userCompany.companies = userCompany.companies
      //   .map((company) => {
      //     if (company.companyId === user.targetCompanyId) {
      //       return company;
      //     }

      //     return null;
      //   })
      //   .filter((company) => company !== null);

      delete userCompany.password;
      return userCompany;
    });
  }
}
