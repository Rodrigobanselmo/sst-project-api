import { Injectable } from '@nestjs/common';
import { StatusEnum } from '@prisma/client';

import { syncDerivedMeasureFromDonePlanIfMissing } from '../../../../../@v2/security/action-plan/database/utils/sync-derived-measure-from-done-plan';
import { tryPromoteResidualToCurrentWhenPlanFullyImplemented } from '../../../../../@v2/security/action-plan/database/utils/try-promote-residual-to-current-when-plan-fully-implemented';
import { PrismaService } from '../../../../../prisma/prisma.service';

/**
 * Reprocessa derivação para recomendações já DONE no plano quando `recType` passa a existir,
 * sem novo evento de status ou comentário (fluxo legado).
 */
@Injectable()
export class SyncMissingDerivedMeasureAfterRecMedUpdateService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(recMedId: string, companyId: string): Promise<void> {
    const donePlans = await this.prisma.riskFactorDataRec.findMany({
      where: {
        recMedId,
        companyId,
        status: StatusEnum.DONE,
      },
      select: {
        id: true,
        riskFactorDataId: true,
        workspaceId: true,
      },
    });

    for (const row of donePlans) {
      await this.prisma.$transaction(async (tx) => {
        await syncDerivedMeasureFromDonePlanIfMissing(tx, {
          riskFactorDataRecId: row.id,
          riskFactorDataId: row.riskFactorDataId,
          recommendationId: recMedId,
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
    }
  }
}
