/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../../../prisma/prisma.service';
import { UpsertRiskDocInfoDto } from '../../dto/risk-doc-info.dto';
import { RiskDocInfoEntity } from '../../entities/riskDocInfo.entity';
import { RiskDocumentEntity } from '../../entities/riskDocument.entity';

@Injectable()
export class RiskDocInfoRepository {
  constructor(private prisma: PrismaService) {}
  async upsert({ companyId, ...createDto }: UpsertRiskDocInfoDto) {
    const riskFactorDocEntity = await this.prisma.riskFactorsDocInfo.upsert({
      create: {
        companyId,
        ...createDto,
      },
      update: {
        ...createDto,
        companyId,
      },
      where: {
        companyId_riskId_hierarchyId: {
          companyId,
          riskId: createDto.riskId,
          hierarchyId: createDto?.hierarchyId || '',
        },
      },
    });

    return new RiskDocInfoEntity(riskFactorDocEntity);
  }
}
