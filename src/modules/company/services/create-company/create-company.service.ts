import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from '../../dto/create-company.dto';
import { CompanyRepository } from '../../repositories/implementations/CompanyRepository';

@Injectable()
export class CreateCompanyService {
  constructor(private readonly companyRepository: CompanyRepository) {}
  async execute(createCompanyDto: CreateCompanyDto) {
    const company = await this.companyRepository.create(createCompanyDto);

    return company;
  }
}
