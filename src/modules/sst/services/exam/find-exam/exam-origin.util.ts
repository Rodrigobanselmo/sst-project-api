import { Prisma } from '@prisma/client';

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
