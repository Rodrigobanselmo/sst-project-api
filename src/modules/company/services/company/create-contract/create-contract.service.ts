import { BadRequestException, Injectable } from '@nestjs/common';

import { CreateCompanyDto } from '../../../dto/company.dto';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { CompanyRepository } from '../../../repositories/implementations/CompanyRepository';
import { LicenseRepository } from '../../../repositories/implementations/LicenseRepository';

@Injectable()
export class CreateContractService {
  constructor(private readonly companyRepository: CompanyRepository, private readonly licenseRepository: LicenseRepository) {}
  async execute(createContractDto: CreateCompanyDto, user: UserPayloadDto) {
    if ('isConsulting' in createContractDto) delete createContractDto.isConsulting;

    const license = await this.licenseRepository.findByCompanyId(user.companyId);

    if (!license?.id) throw new BadRequestException('license not found');

    createContractDto.initials = await this.findInitials(createContractDto);

    const company = await this.companyRepository.create({
      ...createContractDto,
      companyId: user.companyId,
      license,
    });

    return company;
  }

  async findInitials(createContractDto: CreateCompanyDto) {
    let initials = createContractDto.initials;
    let tries = 0;
    if (!initials) {
      const loop = async () => {
        tries++;
        if (tries > 5) return initials;

        initials = Math.floor(Math.random() * 1000000).toString();
        const company = await this.companyRepository.findFirstNude({
          where: { initials: initials },
        });

        if (company) {
          return loop();
        }
      };

      loop();
    }

    return initials;
  }
}
