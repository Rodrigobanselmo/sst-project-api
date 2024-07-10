import { Injectable } from '@nestjs/common';
import { CompanyRepository } from '../../../../../modules/company/repositories/implementations/CompanyRepository';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { CompanyOSRepository } from './../../../repositories/implementations/CompanyOSRepository';

@Injectable()
export class FindOneCompanyOSService {
  constructor(
    private readonly companyOSRepository: CompanyOSRepository,
    private readonly companyRepository: CompanyRepository,
  ) {}

  async execute(user: UserPayloadDto) {
    const company = await this.companyRepository.findFirstNude({
      where: {
        id: user.targetCompanyId,
      },
      select: { os: true, group: { select: { companyGroup: { select: { os: true } } } } },
    });

    const os = company?.os || company?.group?.os;

    if (!os?.id) {
      const osConsultant = await this.companyOSRepository.findFirstNude({
        where: {
          company: {
            isConsulting: true,
            isGroup: false,
            isClinic: false,
            applyingServiceContracts: {
              some: {
                status: 'ACTIVE',
                receivingServiceCompanyId: user.targetCompanyId,
              },
            },
          },
        },
      });
      return osConsultant;
    }

    return os;
  }
}
