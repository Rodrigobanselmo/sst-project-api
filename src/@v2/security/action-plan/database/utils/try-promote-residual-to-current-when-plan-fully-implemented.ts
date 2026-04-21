import { Prisma, StatusEnum } from '@prisma/client';

import { getMatrizRisk } from '../../../../../shared/utils/matriz';

export type TryPromoteResidualToCurrentParams = {
  riskFactorDataId: string;
  workspaceId: string;
  companyId: string;
};

const BLOCKING_STATUSES: StatusEnum[] = [
  StatusEnum.PENDING,
  StatusEnum.PROGRESS,
  StatusEnum.CANCELED,
  StatusEnum.REJECTED,
];

/**
 * Promove `probabilityAfter` → `probability` (e recalcula `level` pela matriz) quando
 * todas as recomendações relevantes do risco no plano (workspace) estão em DONE
 * com medida derivada, sem itens bloqueantes. Idempotente; não altera plano nem comentários.
 */
export async function tryPromoteResidualToCurrentWhenPlanFullyImplemented(
  tx: Prisma.TransactionClient,
  params: TryPromoteResidualToCurrentParams,
): Promise<void> {
  const debugEnabled = process.env.ACTION_PLAN_PROMOTION_DEBUG === '1';
  const debug = (reason: string, extra?: Record<string, unknown>) => {
    if (!debugEnabled) return;
    console.info('[action-plan][promote-residual]', {
      reason,
      riskFactorDataId: params.riskFactorDataId,
      workspaceId: params.workspaceId,
      companyId: params.companyId,
      ...extra,
    });
  };

  await tx.$executeRaw(Prisma.sql`SELECT pg_advisory_xact_lock(hashtext(CAST(${params.riskFactorDataId} AS text)))`);

  const planRows = await tx.riskFactorDataRec.findMany({
    where: {
      riskFactorDataId: params.riskFactorDataId,
      workspaceId: params.workspaceId,
      companyId: params.companyId,
    },
    include: { derivedMeasure: { select: { id: true } } },
  });

  if (planRows.length === 0) {
    debug('skip:no-plan-rows');
    return;
  }

  const links = await tx.recMedOnRiskData.findMany({
    where: { risk_data_id: params.riskFactorDataId },
    select: {
      rec_med_id: true,
      recMed: { select: { deleted_at: true } },
    },
  });
  const linkedIdsSet = new Set(
    links
      .filter((l) => !l.recMed?.deleted_at)
      .map((l) => l.rec_med_id),
  );
  const planRecIdsSet = new Set(planRows.map((r) => r.recMedId));
  const missingLinkedPlanRows = Array.from(linkedIdsSet).filter(
    (id) => !planRecIdsSet.has(id),
  );
  if (missingLinkedPlanRows.length > 0) {
    debug('skip:missing-linked-plan-rows', {
      missingLinkedRecMedIds: missingLinkedPlanRows,
      linkedIds: Array.from(linkedIdsSet),
      planRows: planRows.map((r) => ({
        id: r.id,
        recMedId: r.recMedId,
        status: r.status,
        hasDerived: !!r.derivedMeasure,
      })),
    });
    return;
  }

  // Prefer explicit risk-data links.
  const linkedPlanRows =
    linkedIdsSet.size > 0
      ? planRows.filter((r) => linkedIdsSet.has(r.recMedId))
      : [];
  // Legacy fallback: if links exist but don't intersect, use rows that already generated
  // derived measures; only then fallback to all plan rows.
  const derivedPlanRows = planRows.filter((r) => !!r.derivedMeasure);
  const relevantPlanRows =
    linkedPlanRows.length > 0
      ? linkedPlanRows
      : derivedPlanRows.length > 0
        ? derivedPlanRows
        : planRows;
  if (relevantPlanRows.length === 0) {
    debug('skip:no-relevant-plan-rows', {
      planRows: planRows.map((r) => ({ id: r.id, recMedId: r.recMedId, status: r.status, hasDerived: !!r.derivedMeasure })),
      linkedIds: Array.from(linkedIdsSet),
    });
    return;
  }

  if (relevantPlanRows.some((r) => BLOCKING_STATUSES.includes(r.status))) {
    debug('skip:blocking-status', {
      planRows: planRows.map((r) => ({ id: r.id, recMedId: r.recMedId, status: r.status, hasDerived: !!r.derivedMeasure })),
      linkedIds: Array.from(linkedIdsSet),
      relevantPlanRows: relevantPlanRows.map((r) => ({ id: r.id, recMedId: r.recMedId, status: r.status, hasDerived: !!r.derivedMeasure })),
    });
    return;
  }
  for (const row of relevantPlanRows) {
    if (row.status !== StatusEnum.DONE || !row.derivedMeasure) {
      debug('skip:not-done-or-missing-derived', {
        row: { id: row.id, recMedId: row.recMedId, status: row.status, hasDerived: !!row.derivedMeasure },
        planRows: planRows.map((r) => ({ id: r.id, recMedId: r.recMedId, status: r.status, hasDerived: !!r.derivedMeasure })),
        linkedIds: Array.from(linkedIdsSet),
        relevantPlanRows: relevantPlanRows.map((r) => ({ id: r.id, recMedId: r.recMedId, status: r.status, hasDerived: !!r.derivedMeasure })),
      });
      return;
    }
  }

  const riskData = await tx.riskFactorData.findFirst({
    where: { id: params.riskFactorDataId, companyId: params.companyId },
    include: { riskFactor: { select: { severity: true } } },
  });
  if (!riskData) {
    debug('skip:risk-data-not-found');
    return;
  }

  if (riskData.probabilityAfter == null) {
    debug('skip:probability-after-null');
    return;
  }

  const targetProb = riskData.probabilityAfter;
  if (riskData.probability != null && riskData.probability === targetProb) {
    debug('skip:already-promoted', { targetProb, currentProb: riskData.probability });
    return;
  }

  const severity = riskData.riskFactor?.severity;
  const updateData: { probability: number; level?: number } = { probability: targetProb };
  if (severity && targetProb) {
    const matriz = getMatrizRisk(severity, targetProb);
    if (matriz.level != null) updateData.level = matriz.level;
  }

  await tx.riskFactorData.update({
    where: {
      id_companyId: {
        id: params.riskFactorDataId,
        companyId: params.companyId,
      },
    },
    data: updateData,
  });
  debug('updated', {
    targetProb,
    previousProb: riskData.probability,
    previousLevel: riskData.level,
    nextLevel: updateData.level ?? riskData.level,
    linkedIds: Array.from(linkedIdsSet),
    planRows: planRows.map((r) => ({ id: r.id, recMedId: r.recMedId, status: r.status, hasDerived: !!r.derivedMeasure })),
    relevantPlanRows: relevantPlanRows.map((r) => ({ id: r.id, recMedId: r.recMedId, status: r.status, hasDerived: !!r.derivedMeasure })),
  });
}
