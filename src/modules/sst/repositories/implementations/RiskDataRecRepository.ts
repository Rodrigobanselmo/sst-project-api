import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../prisma/prisma.service';
import { UpsertRiskDataRecDto } from '../../dto/risk-data-rec.dto';
import { RiskDataRecEntity } from '../../entities/riskDataRec.entity';

/* eslint-disable @typescript-eslint/no-unused-vars */
@Injectable()
export class RiskDataRecRepository {
  constructor(private prisma: PrismaService) { }

  async upsert({ comment, ...upsertData }: UpsertRiskDataRecDto) {
    // const redMed = await this.prisma.riskFactorDataRec.upsert({
    //   where: {
    //     riskFactorDataId_recMedId_companyId: {
    //       riskFactorDataId: upsertData.riskFactorDataId,
    //       recMedId: upsertData.recMedId,
    //       companyId: upsertData.companyId,
    //     },
    //   },
    //   create: { ...upsertData },
    //   update: {
    //     ...upsertData,
    //     comments: comment ? { create: { ...comment } } : undefined,
    //   },
    // });

    // return new RiskDataRecEntity(redMed);
  }
}
