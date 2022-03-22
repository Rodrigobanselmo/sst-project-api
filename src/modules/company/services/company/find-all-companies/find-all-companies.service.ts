import { Injectable } from '@nestjs/common';
import { CompanyRepository } from 'src/modules/company/repositories/implementations/CompanyRepository';
import { UserPayloadDto } from 'src/shared/dto/user-payload.dto';

@Injectable()
export class FindAllCompaniesService {
  constructor(private readonly companyRepository: CompanyRepository) {}

  async execute(user: UserPayloadDto) {
    if (!user.isMaster)
      return await this.companyRepository.findAllRelatedByCompanyId(
        user.companyId,
      );

    if (user.isMaster) return await this.companyRepository.findAll();
  }
}
