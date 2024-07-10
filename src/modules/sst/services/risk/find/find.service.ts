import { Injectable } from '@nestjs/common';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { RiskRepository } from '../../../repositories/implementations/RiskRepository';
import { FindRiskDto } from '../../../dto/risk.dto';

@Injectable()
export class FindRiskService {
  constructor(private readonly riskRepository: RiskRepository) {}

  async execute({ skip, take, ...query }: FindRiskDto, user: UserPayloadDto) {
    const Exam = await this.riskRepository.find(
      { companyId: user.targetCompanyId, representAll: false, ...query },
      { skip, take },
      {
        select: {
          name: true,
          status: true,
          id: true,
          type: true,
          severity: true,
          unit: true,
          appendix: true,
          otherAppendix: true,
          activities: true,
          esocialCode: true,
          synonymous: true,
          search: true,

          symptoms: true,
          risk: true,
          isEmergency: true,

          isPGR: true,
          isAso: true,
          isPPP: true,
          isPCMSO: true,

          twa: true,
          nr15lt: true,
          stel: true,

          docInfo: {
            where: {
              OR: [
                { companyId: user.targetCompanyId },
                {
                  company: {
                    applyingServiceContracts: {
                      some: { receivingServiceCompanyId: user.targetCompanyId, status: 'ACTIVE' },
                    },
                  },
                },
              ],
              hierarchyId: null,
            },
          },
        },
      },
    );

    return Exam;
  }
}
