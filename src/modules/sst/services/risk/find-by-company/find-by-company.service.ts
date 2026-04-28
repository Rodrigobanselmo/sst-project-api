import { Injectable } from '@nestjs/common';

import { RiskRepository } from '../../../repositories/implementations/RiskRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { FindRiskDto } from '../../../dto/risk.dto';
import { resolveRiskListOrderBy } from '../../../utils/risk-list-order-by.util';

@Injectable()
export class FindRisksByCompanyService {
  constructor(private readonly riskRepository: RiskRepository) {}

  async execute(
    { skip, take, listSortBy, listSortOrder, search, ...query }: FindRiskDto,
    user: UserPayloadDto,
  ) {
    const companyId = user.targetCompanyId;
    const orderBy = resolveRiskListOrderBy(listSortBy, listSortOrder);
    const synonymousRiskIds = search
      ? await this.riskRepository.findIdsBySynonymousSearch({
          companyId,
          search,
          mustHaveRiskData: true,
        })
      : [];

    const risks = await this.riskRepository.findCountNude(
      { skip, take },
      {
        orderBy,
        where: {
          representAll: false, // remove standard risk
          riskFactorData: {
            some: {
              companyId,
            },
          },
          ...(search && {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { cas: { contains: search, mode: 'insensitive' } },
              ...(synonymousRiskIds.length
                ? [{ id: { in: synonymousRiskIds } }]
                : []),
            ],
          }),
        },
        select: {
          name: true,
          severity: true,
          type: true,
          representAll: true,
          companyId: true,
          unit: true,
          id: true,
          isPGR: true,
          isAso: true,
          isPPP: true,
          esocialCode: true,
          activities: true,
          appendix: true,
          otherAppendix: true,
          isPCMSO: true,
          twa: true,
          nr15lt: true,
          stel: true,
          subTypes: {
            include: {
              sub_type: true,
            },
          },

          docInfo: {
            where: {
              OR: [
                { companyId },
                {
                  company: {
                    applyingServiceContracts: {
                      some: { receivingServiceCompanyId: companyId, status: 'ACTIVE' },
                    },
                  },
                },
              ],
            },
            include: { hierarchy: { select: { name: true, id: true } } },
          },
          examToRisk: {
            include: { exam: { select: { name: true, id: true } } },
            where: { companyId, deletedAt: null },
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
