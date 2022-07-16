import { FindCompaniesDto } from './../../../dto/create-company.dto';
import { Injectable } from '@nestjs/common';
import { CompanyRepository } from '../../../../../modules/company/repositories/implementations/CompanyRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { simulateAwait } from 'src/shared/utils/simulateAwait';

@Injectable()
export class FindAllCompaniesService {
  constructor(private readonly companyRepository: CompanyRepository) {}

  async execute(
    user: UserPayloadDto,
    { skip, take, ...query }: FindCompaniesDto,
  ) {
    await simulateAwait(1000);
    if (!user.isMaster)
      return await this.companyRepository.findAllRelatedByCompanyId(
        user.companyId,
        query,
        { skip, take },
      );

    if (user.isMaster)
      return await this.companyRepository.findAll(query, { skip, take });
  }
}
