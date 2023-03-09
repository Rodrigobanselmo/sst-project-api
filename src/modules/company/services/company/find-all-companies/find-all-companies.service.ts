import { Injectable } from '@nestjs/common';

import { CompanyRepository } from '../../../../../modules/company/repositories/implementations/CompanyRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { FindCompaniesDto } from '../../../dto/company.dto';

@Injectable()
export class FindAllCompaniesService {
  constructor(private readonly companyRepository: CompanyRepository) {}

  async execute(user: UserPayloadDto, { skip, take, ...query }: FindCompaniesDto) {
    const companyId = user.isMaster ? '' : user.companyId;
    return await this.companyRepository.findAllRelatedByCompanyId(companyId, { ...query }, { skip, take });
  }
}
