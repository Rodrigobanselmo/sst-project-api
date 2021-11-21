import { Injectable } from '@nestjs/common';
import { UpdateCompanyDto } from '../../dto/update-company.dto';
import { CompanyRepository } from '../../repositories/implementations/CompanyRepository';

@Injectable()
export class UpdateCompanyService {
  constructor(private readonly companyRepository: CompanyRepository) {}

  async execute(id: string, updateCompanyDto: UpdateCompanyDto) {
    console.log(`updateCompanyDto`, updateCompanyDto);
    const company = await this.companyRepository.updateInsert(
      id,
      updateCompanyDto,
    );

    return company;
  }
}
