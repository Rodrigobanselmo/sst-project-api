import { DocumentVersionModel } from '@/@v2/documents/domain/models/document-version.model';
import { getValidDateActionPlan } from '@/@v2/shared/domain/functions/security/get-valid-date-action-plan.func';
import { resolveOccupationalRiskLevel } from '@/@v2/shared/domain/functions/security/resolve-occupational-risk-level.func';
import dayjs from 'dayjs';

export const resolveActionPlanDueDate = (params: {
  severity?: number | null;
  probability?: number | null;
  storedLevel?: number | null;
  endDate?: Date | null;
  documentVersion: DocumentVersionModel;
}): { dueDate: Date | null; resolvedLevel: ReturnType<typeof resolveOccupationalRiskLevel> } => {
  const resolvedLevel = resolveOccupationalRiskLevel(
    params.severity,
    params.probability,
    params.storedLevel,
  );

  const { data, validityStart } = params.documentVersion.documentBase;

  const dueDate = getValidDateActionPlan({
    level: resolvedLevel,
    endDate: params.endDate ?? null,
    validityStart,
    periods: {
      monthsLevel_2: data.monthsPeriodLevel_2,
      monthsLevel_3: data.monthsPeriodLevel_3,
      monthsLevel_4: data.monthsPeriodLevel_4,
      monthsLevel_5: data.monthsPeriodLevel_5,
    },
  });

  return { dueDate, resolvedLevel };
};

export const formatActionPlanDueText = (
  dueDate: Date | null,
  resolvedLevel: ReturnType<typeof resolveOccupationalRiskLevel>,
): string => {
  if (dueDate) return dayjs(dueDate).format('DD/MM/YY');
  if (resolvedLevel === 6) return 'ação imediata';
  return 'sem prazo';
};
