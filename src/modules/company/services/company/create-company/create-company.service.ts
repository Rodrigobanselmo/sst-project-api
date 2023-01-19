import { Injectable } from '@nestjs/common';
import { StatusEnum } from '@prisma/client';
import { CreateCompanyDto } from '../../../dto/company.dto';
import { CompanyRepository } from '../../../repositories/implementations/CompanyRepository';

@Injectable()
export class CreateCompanyService {
  constructor(private readonly companyRepository: CompanyRepository) {}

  async execute(createCompanyDto: CreateCompanyDto) {
    const statusLicense = createCompanyDto?.license ? createCompanyDto?.license?.status : StatusEnum.ACTIVE;

    const company = await this.companyRepository.create({
      license: {
        status: statusLicense,
      },
      ...createCompanyDto,
    });

    return company;
  }
}
