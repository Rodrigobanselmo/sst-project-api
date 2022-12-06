import { Injectable } from '@nestjs/common';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { CompanyOSDto, CopyCompanyOSDto } from '../../../dto/os.dto';
import { CompanyOSRepository } from '../../../repositories/implementations/CompanyOSRepository';

@Injectable()
export class CopyCompanyOSService {
  constructor(private readonly companyOSRepository: CompanyOSRepository) {}

  async execute(data: CopyCompanyOSDto, user: UserPayloadDto) {
    const osFrom = await this.companyOSRepository.findFirstNude({
      where: {
        companyId: data.copyFromCompanyId,
      },
      select: {
        cipa: true,
        declaration: true,
        med: true,
        obligations: true,
        prohibitions: true,
        procedures: true,
        rec: true,
      },
    });

    const os = await this.companyOSRepository.upsert({
      ...osFrom,
      companyId: user.targetCompanyId,
    });

    return os;
  }
}
