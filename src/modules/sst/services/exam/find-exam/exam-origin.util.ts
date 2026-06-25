import { Prisma, RiskFactorsEnum } from '@prisma/client';

import { simpleCompanyId } from '../../../../../shared/constants/ids';

/** Source/origin classification for a registered exam (Exames Cadastrados). */
export enum ExamOriginEnum {
  /** Exam linked to an NR-07 biological indicator (BiologicalIndicatorToExam). */
  NR07 = 'NR07',
  /** SimpleSST system catalog exam (system + simpleCompanyId), not NR-07. */
  SYSTEM = 'SYSTEM',
  /** Exam owned by a client/tenant company. */
  CLIENT = 'CLIENT',
  /** Anything else (e.g. system exam from a non-simple company). */
  OTHER = 'OTHER',
}

/**
 * Resolves the origin of an exam. Precedence: NR-07 link > System catalog >
 * Client > Other. NR-07 takes priority because provisioned NR-07 exams are also
 * system+simpleCompanyId, but should be surfaced as normative.
 */
export const resolveExamOrigin = (
  exam: { id: number; companyId: string; system: boolean },
  nr07ExamIds: Set<number>,
): ExamOriginEnum => {
  if (nr07ExamIds.has(exam.id)) return ExamOriginEnum.NR07;
  if (exam.system && exam.companyId === simpleCompanyId) return ExamOriginEnum.SYSTEM;
  if (!exam.system) return ExamOriginEnum.CLIENT;
  return ExamOriginEnum.OTHER;
};

/**
 * Builds a Prisma where-constraint to filter exams by origin, given the set of
 * NR-07 linked exam ids. Returns null when no origin filter is requested.
 */
export const buildExamOriginConstraint = (
  origin: ExamOriginEnum | undefined,
  nr07ExamIds: Set<number>,
): Prisma.ExamWhereInput | null => {
  const ids = Array.from(nr07ExamIds);

  switch (origin) {
    case ExamOriginEnum.NR07:
      return { id: { in: ids } };
    case ExamOriginEnum.SYSTEM:
      return {
        AND: [
          { system: true },
          { companyId: simpleCompanyId },
          { id: { notIn: ids } },
        ],
      };
    case ExamOriginEnum.CLIENT:
      return { AND: [{ system: false }, { id: { notIn: ids } }] };
    case ExamOriginEnum.OTHER:
      return {
        AND: [
          { system: true },
          { NOT: { companyId: simpleCompanyId } },
          { id: { notIn: ids } },
        ],
      };
    default:
      return null;
  }
};

/**
 * Risk categories for which NR-07 biological-indicator exams are naturally
 * applicable. NR-07 Anexo I exams monitor chemical/biological agents, so they
 * are offered by default only for chemical (QUI) and biological (BIO) risks.
 */
const NR07_COMPATIBLE_RISK_TYPES = new Set<RiskFactorsEnum>([
  RiskFactorsEnum.QUI,
  RiskFactorsEnum.BIO,
]);

/**
 * Builds a Prisma where-constraint that hides exams incompatible with the
 * selected risk category. Phase 1 scope: only NR-07 exams are filtered (they
 * are the ones that surface as noise for non-chemical risks). Returns null
 * (no filtering) when:
 *  - no riskType context is provided;
 *  - includeIncompatible is requested ("Mostrar todos os exames");
 *  - the risk is chemical/biological (NR-07 exams are compatible);
 *  - there are no NR-07 exams to exclude.
 */
export const buildRiskApplicabilityConstraint = (
  riskType: RiskFactorsEnum | undefined,
  includeIncompatible: boolean | undefined,
  nr07ExamIds: Set<number>,
): Prisma.ExamWhereInput | null => {
  if (!riskType || includeIncompatible) return null;
  if (NR07_COMPATIBLE_RISK_TYPES.has(riskType)) return null;

  const ids = Array.from(nr07ExamIds);
  if (ids.length === 0) return null;

  return { id: { notIn: ids } };
};

const SORTABLE_FIELDS = new Set([
  'name',
  'analyses',
  'material',
  'status',
  'created_at',
]);

/** Builds a Prisma orderBy, defaulting to name asc (preserves legacy behavior). */
export const buildExamOrderBy = (
  orderBy: string | undefined,
  direction: string | undefined,
): Prisma.ExamOrderByWithRelationInput => {
  const dir: Prisma.SortOrder = direction === 'desc' ? 'desc' : 'asc';
  if (orderBy && SORTABLE_FIELDS.has(orderBy)) {
    return { [orderBy]: dir };
  }
  return { name: 'asc' };
};
