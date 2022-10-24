import { Injectable } from '@nestjs/common';

import { RiskRepository } from '../../../repositories/implementations/RiskRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { FindRiskDto } from '../../../dto/risk.dto';

@Injectable()
export class FindRisksByCompanyService {
  constructor(private readonly riskRepository: RiskRepository) {}

  async execute({ skip, take, ...query }: FindRiskDto, user: UserPayloadDto) {
    const companyId = user.targetCompanyId;

    const risks = await this.riskRepository.findCountNude(
      { skip, take },
      {
        orderBy: [{ type: 'asc' }, { name: 'asc' }],
        where: {
          representAll: false, // remove standard risk
          riskFactorData: {
            some: {
              companyId,
            },
          },
          ...(query.search && {
            name: { contains: query.search, mode: 'insensitive' },
          }),
        },
        select: {
          name: true,
          severity: true,
          type: true,
          representAll: true,
          companyId: true,
          id: true,
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
                { companyId },
                {
                  company: {
                    applyingServiceContracts: {
                      some: { receivingServiceCompanyId: companyId },
                    },
                  },
                },
              ],
            },
            include: { hierarchy: { select: { name: true, id: true } } },
          },
          examToRisk: {
            include: { exam: { select: { name: true, id: true } } },
            where: { companyId },
          },
          riskFactorData: {
            where: {
              companyId,
            },
            include: {
              examsToRiskFactorData: {
                include: {
                  exam: { select: { name: true, status: true } },
                },
              },
              homogeneousGroup: {
                include: {
                  hierarchyOnHomogeneous: {
                    select: {
                      hierarchy: true,
                    },
                    where: { homogeneousGroup: { type: 'HIERARCHY' } },
                  },
                  characterization: { select: { name: true, type: true } },
                  environment: { select: { name: true, type: true } },
                },
              },
            },
          },
        },
      },
    );

    return risks;
  }
}
