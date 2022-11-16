import { Injectable } from '@nestjs/common';

import { CompanyRepository } from '../../../../../modules/company/repositories/implementations/CompanyRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { FindCompaniesDto } from './../../../dto/create-company.dto';

@Injectable()
export class FindAllCompaniesService {
  constructor(private readonly companyRepository: CompanyRepository) {}

  async execute(user: UserPayloadDto, { skip, take, ...query }: FindCompaniesDto) {
    if (!user.isMaster) return await this.companyRepository.findAllRelatedByCompanyId(user.companyId, { ...query }, { skip, take });

    return await this.companyRepository.findAll(query, { skip, take });
  }
}
