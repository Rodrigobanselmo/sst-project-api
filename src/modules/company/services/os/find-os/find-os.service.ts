import { Injectable } from '@nestjs/common';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { CompanyOSRepository } from './../../../repositories/implementations/CompanyOSRepository';

@Injectable()
export class FindOneCompanyOSService {
  constructor(private readonly companyOSRepository: CompanyOSRepository) {}

  async execute(id: number, user: UserPayloadDto) {
    const os = await this.companyOSRepository.findFirstNude({
      where: {
        id,
        companyId: user.targetCompanyId,
      },
    });

    if (!os.id) {
      const osConsultant = await this.companyOSRepository.findFirstNude({
        where: {
          company: {
            applyingServiceContracts: {
              some: {
                receivingServiceCompanyId: user.targetCompanyId,
                receivingServiceCompany: {
                  isConsulting: true,
                  isGroup: false,
                  isClinic: false,
                },
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
