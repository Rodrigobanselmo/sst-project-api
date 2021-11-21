import { LicenseRepository } from '../../repositories/implementations/LicenseRepository';
import { BadRequestException, Injectable } from '@nestjs/common';

import { CreateContractDto } from '../../dto/create-contract.dto';
import { CompanyRepository } from '../../repositories/implementations/CompanyRepository';

@Injectable()
export class CreateContractService {
  constructor(
    private readonly companyRepository: CompanyRepository,
    private readonly licenseRepository: LicenseRepository,
  ) {}
  async execute({ ...createContractDto }: CreateContractDto) {
    const license = await this.licenseRepository.findByCompanyId(
      createContractDto.companyId,
    );

    if (!license) throw new BadRequestException('license not found');

    const company = await this.companyRepository.create({
      ...createContractDto,
    });

    return company;
  }
}
