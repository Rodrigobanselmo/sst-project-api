import { Injectable } from '@nestjs/common';

import { CompanyRepository } from '../../../repositories/implementations/CompanyRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { FindCompaniesDto } from '../../../dto/create-company.dto';

@Injectable()
export class FindAllUserCompaniesService {
  constructor(private readonly companyRepository: CompanyRepository) {}

  async execute(user: UserPayloadDto, { skip, take, ...query }: FindCompaniesDto) {
    return await this.companyRepository.findAll({ ...query, userId: user.userId }, { skip, take });
  }
}
