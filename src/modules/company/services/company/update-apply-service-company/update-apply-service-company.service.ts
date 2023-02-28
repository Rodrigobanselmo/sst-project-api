import { Injectable } from '@nestjs/common';

import { UpdateApplyServiceCompanyDto } from '../../../dto/company.dto';
import { CompanyRepository } from '../../../repositories/implementations/CompanyRepository';

@Injectable()
export class UpdateApplyServiceCompanyService {
  constructor(private readonly companyRepository: CompanyRepository) {}

  async execute(body: UpdateApplyServiceCompanyDto, companyId: string) {
    const company = await this.companyRepository.updateApplyService(companyId, body.applyServiceIds);

    return company;
  }
}
