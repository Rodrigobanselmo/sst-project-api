import { Injectable, NotFoundException } from '@nestjs/common';
import { StatusEnum } from '@prisma/client';

import { syncDerivedMeasureFromDonePlanIfMissing } from '../../../../../@v2/security/action-plan/database/utils/sync-derived-measure-from-done-plan';
import { tryPromoteResidualToCurrentWhenPlanFullyImplemented } from '../../../../../@v2/security/action-plan/database/utils/try-promote-residual-to-current-when-plan-fully-implemented';
import { PrismaService } from '../../../../../prisma/prisma.service';

export type SyncDerivedMeasuresFromPlanResult = {
  created: number;
  skipped: number;
  processedRiskFactorDataRecIds: string[];
};

@Injectable()
export class SyncDerivedMeasuresFromPlanService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    riskFactorGroupDataId: string,
    workspaceId: string,
    companyId: string,
  ): Promise<SyncDerivedMeasuresFromPlanResult> {
    const group = await this.prisma.riskFactorGroupData.findFirst({
      where: { id: riskFactorGroupDataId, companyId },
      select: { id: true },
    });
    if (!group) {
      throw new NotFoundException('Grupo de risco não encontrado para esta empresa.');
    }

    const planRows = await this.prisma.riskFactorDataRec.findMany({
      where: {
        companyId,
        workspaceId,
        status: StatusEnum.DONE,
        riskFactorData: {
          riskFactorGroupDataId,
          companyId,
          deletedAt: null,
        },
      },
      select: {
        id: true,
        riskFactorDataId: true,
        workspaceId: true,
        recMedId: true,
      },
    });

    let created = 0;
    let skipped = 0;
    const processedRiskFactorDataRecIds: string[] = [];

    for (const row of planRows) {
      processedRiskFactorDataRecIds.push(row.id);

      const existedBefore = await this.prisma.riskFactorDataRecDerivedMeasure.findUnique({
        where: { riskFactorDataRecId: row.id },
        select: { id: true },
      });

      await this.prisma.$transaction(async (tx) => {
        await syncDerivedMeasureFromDonePlanIfMissing(tx, {
          riskFactorDataRecId: row.id,
          riskFactorDataId: row.riskFactorDataId,
          recommendationId: row.recMedId,
          workspaceId: row.workspaceId,
          companyId,
          skipIfUnlinked: true,
          trustPlanRowOverRecMedOnRiskData: true,
        });
        await tryPromoteResidualToCurrentWhenPlanFullyImplemented(tx, {
          riskFactorDataId: row.riskFactorDataId,
          workspaceId: row.workspaceId,
          companyId,
        });
      });

      const after = await this.prisma.riskFactorDataRecDerivedMeasure.findUnique({
        where: { riskFactorDataRecId: row.id },
        select: { id: true },
      });
      if (!existedBefore && after) {
        created += 1;
      } else {
        skipped += 1;
      }
    }

    return { created, skipped, processedRiskFactorDataRecIds };
  }
}
