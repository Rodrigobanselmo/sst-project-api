import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { IRiskDataDAO } from './risk-data.types';
import { RiskDataMapper } from '../../mappers/risk-data.mapper';
import { RiskDAO } from '../risk/risk.dao';

@Injectable()
export class RiskDataDAO {
  constructor(private readonly prisma: PrismaServiceV2) {}

  static selectOptions({ companyId }: { companyId: string }) {
    const include = {
      riskFactor: RiskDAO.selectOptions({ companyId }),
      dataRecs: true,
      recs: {
        select: {
          recMed: {
            select: {
              recName: true,
              recType: true,
              id: true,
            },
          },
        },
      },
      adms: {
        select: {
          medName: true,
        },
      },
      generateSources: {
        select: {
          name: true,
        },
      },
      engsToRiskFactorData: {
        include: {
          recMed: true,
        },
      },
      epiToRiskFactorData: {
        include: {
          epi: true,
        },
      },
      examsToRiskFactorData: true,
    } satisfies Prisma.RiskFactorDataFindFirstArgs['include'];

    return { include };
  }

  async findMany(params: IRiskDataDAO.FindByIdParams) {
    const RiskDatas = await this.prisma.riskFactorData.findMany({
      where: {
        homogeneousGroup: {
          workspaces: { some: { id: params.wokspaceId } },
        },
      },
      ...RiskDataDAO.selectOptions({ companyId: params.companyId }),
    });

    return RiskDataMapper.toModels(RiskDatas);
  }
}
