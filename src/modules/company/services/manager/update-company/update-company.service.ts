import { Injectable } from '@nestjs/common';
import { UpdateCompanyDto } from '../../../dto/update-company.dto';
import { CompanyRepository } from '../../../repositories/implementations/CompanyRepository';

@Injectable()
export class UpdateCompanyService {
  constructor(private readonly companyRepository: CompanyRepository) {}

  async execute(updateCompanyDto: UpdateCompanyDto) {
    const company = await this.companyRepository.update(updateCompanyDto, {
      include: {
        license: true,
        workspace: true,
        primary_activity: true,
        users: true,
        secondary_activity: true,
      },
    });

    return company;
  }
}
