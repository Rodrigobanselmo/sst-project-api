import { BadRequestException, Injectable } from '@nestjs/common';

import { CreateCompanyDto } from '../../../../../modules/company/dto/create-company.dto';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { CompanyRepository } from '../../../repositories/implementations/CompanyRepository';
import { LicenseRepository } from '../../../repositories/implementations/LicenseRepository';

@Injectable()
export class CreateContractService {
  constructor(
    private readonly companyRepository: CompanyRepository,
    private readonly licenseRepository: LicenseRepository,
  ) {}
  async execute(createContractDto: CreateCompanyDto, user: UserPayloadDto) {
    if ('isConsulting' in createContractDto)
      delete createContractDto.isConsulting;

    const license = await this.licenseRepository.findByCompanyId(
      user.companyId,
    );

    if (!license) throw new BadRequestException('license not found');

    const company = await this.companyRepository.create({
      ...createContractDto,
      companyId: user.companyId,
      license,
    });

    return company;
  }
}
