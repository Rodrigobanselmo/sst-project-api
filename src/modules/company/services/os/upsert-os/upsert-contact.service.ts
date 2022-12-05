import { Injectable } from '@nestjs/common';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { CompanyOSDto } from './../../../dto/os.dto';
import { CompanyOSRepository } from './../../../repositories/implementations/CompanyOSRepository';

@Injectable()
export class UpsertCompanyOSService {
  constructor(private readonly companyOSRepository: CompanyOSRepository) {}

  async execute(UpsertContactsDto: CompanyOSDto, user: UserPayloadDto) {
    const contact = await this.companyOSRepository.upsert({
      ...UpsertContactsDto,
      companyId: user.targetCompanyId,
    });

    return contact;
  }
}
