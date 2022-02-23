import { Injectable } from '@nestjs/common';
import { UpdateCompanyDto } from '../../../dto/update-company.dto';
import { CompanyRepository } from '../../../repositories/implementations/CompanyRepository';

@Injectable()
export class UpdateCompanyService {
  constructor(private readonly companyRepository: CompanyRepository) {}

  async execute(updateCompanyDto: UpdateCompanyDto) {
    const company = await this.companyRepository.updateInsert(updateCompanyDto);

    return company;
  }
}
