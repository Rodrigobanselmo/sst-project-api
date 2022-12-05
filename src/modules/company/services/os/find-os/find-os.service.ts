import { Injectable } from '@nestjs/common';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { CompanyOSRepository } from './../../../repositories/implementations/CompanyOSRepository';

@Injectable()
export class FindOneCompanyOSService {
  constructor(private readonly companyOSRepository: CompanyOSRepository) {}

  async execute(id: number, user: UserPayloadDto) {
    const access = await this.companyOSRepository.findFirstNude({
      where: {
        id,
        companyId: user.targetCompanyId,
      },
    });

    return access;
  }
}
