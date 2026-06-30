import {
  PcmsoExamRiskRuleScopeEnum,
  PcmsoExamRiskRuleStatusEnum,
  Prisma,
  RiskFactorsEnum,
} from '@prisma/client';

import { simpleCompanyId } from '../../../../../shared/constants/ids';
import { normalizeCas } from '../../../../../shared/utils/agent-normalize.util';

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
 * Accumulative technical/normative source for a registered exam. Unlike
 * {@link ExamOriginEnum} (a single legacy bucket kept for retrocompatibility),
 * an exam can carry several of these at once — e.g. an exam linked to both an
 * NR-07 and an ACGIH/BEI indicator surfaces ["NR_07", "ACGIH_BEI"]. SYSTEM /
 * CLIENT / OTHER only appear when there is no specific normative source.
 */
export enum ExamOriginSourceEnum {
  /** Linked to an NR-07 biological indicator. */
  NR_07 = 'NR_07',
  /** Linked to an ACGIH/BEI biological indicator. */
  ACGIH_BEI = 'ACGIH_BEI',
  /** SimpleSST system catalog exam without a specific normative source. */
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
 * Resolves the accumulative technical/normative sources of an exam. Normative
 * sources (NR-07, ACGIH/BEI) stack and take precedence in a fixed order
 * (NR_07 first, then ACGIH_BEI). Only when no normative link exists does the
 * exam fall back to a single systemic/ownership bucket (SYSTEM / CLIENT /
 * OTHER), mirroring {@link resolveExamOrigin}. This guarantees:
 *  - a pure NR-07 exam → ["NR_07"];
 *  - a pure ACGIH/BEI exam → ["ACGIH_BEI"] (never masked as "SYSTEM");
 *  - an exam linked to both → ["NR_07", "ACGIH_BEI"] (NR-07 never replaced);
 *  - a generic catalog exam → ["SYSTEM"].
 */
export const resolveExamOriginSources = (
  exam: { id: number; companyId: string; system: boolean },
  nr07ExamIds: Set<number>,
  acgihBeiExamIds: Set<number>,
): ExamOriginSourceEnum[] => {
  const sources: ExamOriginSourceEnum[] = [];
  if (nr07ExamIds.has(exam.id)) sources.push(ExamOriginSourceEnum.NR_07);
  if (acgihBeiExamIds.has(exam.id)) sources.push(ExamOriginSourceEnum.ACGIH_BEI);
  if (sources.length > 0) return sources;

  if (exam.system && exam.companyId === simpleCompanyId) {
    return [ExamOriginSourceEnum.SYSTEM];
  }
  if (!exam.system) return [ExamOriginSourceEnum.CLIENT];
  return [ExamOriginSourceEnum.OTHER];
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

// ── Fase 2: filtro de exames recomendados por agente ────────────────────────

/**
 * Decides whether the agent-recommendation filter must be applied. It only runs
 * when origin metadata is requested, the user did NOT ask for the broad catalog
 * ("Mostrar todos os exames" → includeIncompatible), and at least one normalized
 * agent key (CAS or name) is available.
 */
export const shouldApplyAgentFilter = (
  withOrigin: boolean | undefined,
  includeIncompatible: boolean | undefined,
  agentCasNormalized: string | null,
  agentNameNormalized: string | null,
  riskFactorId?: string | null,
): boolean =>
  Boolean(withOrigin) &&
  includeIncompatible !== true &&
  Boolean(agentCasNormalized || agentNameNormalized || riskFactorId);

/**
 * Static superset filter for Library rules eligible to recommend exams for an
 * agent: not deleted, ACTIVE and scope AGENT. CAS/name matching is applied in
 * memory (see {@link agentRuleMatches}) because stored CAS keeps its hyphens and
 * matching is an OR over CAS and normalized name.
 */
export const buildAgentLibraryWhere = (): Prisma.PcmsoExamRiskRuleWhereInput => ({
  deleted_at: null,
  status: PcmsoExamRiskRuleStatusEnum.ACTIVE,
  scope: PcmsoExamRiskRuleScopeEnum.AGENT,
});

/**
 * Static superset filter for biological-indicator → exam links eligible to
 * recommend exams for an agent: neither the link nor its indicator deleted.
 * NR-07 and ACGIH/BEI indicators are both allowed (no normativeSource filter).
 */
export const buildAgentIndicatorWhere =
  (): Prisma.BiologicalIndicatorToExamWhereInput => ({
    deleted_at: null,
    indicator: { deleted_at: null },
  });

/**
 * Filter for the consolidated ACGIH/BEI path: indicator → risk links that bind
 * a biological indicator to the selected company risk factor. Requires the link
 * to be active (not deleted), confirmed and backed by a non-deleted indicator.
 * isConfirmed is enforced because this recommendation is surfaced automatically
 * to the company without a human review step at selection time.
 */
export const buildRiskIndicatorLinkWhere = (
  riskFactorId: string,
): Prisma.BiologicalIndicatorToRiskWhereInput => ({
  riskFactorId,
  deleted_at: null,
  isConfirmed: true,
  indicator: { deleted_at: null },
});

/**
 * Filter for the indicator → exam side of the consolidated ACGIH/BEI path,
 * restricted to a set of indicator ids. Mirrors {@link buildRiskIndicatorLinkWhere}:
 * active (not deleted), confirmed links over a non-deleted indicator. Exam
 * status/visibility is enforced downstream by the main exam query, so it is not
 * re-checked here.
 */
export const buildRiskIndicatorExamWhere = (
  indicatorIds: string[],
): Prisma.BiologicalIndicatorToExamWhereInput => ({
  indicatorId: { in: indicatorIds },
  deleted_at: null,
  isConfirmed: true,
  indicator: { deleted_at: null },
});

/**
 * Matches a Library rule against the requested agent. CAS comparison is done on
 * digit-normalized values (stored CAS keeps hyphens); name comparison uses the
 * canonical normalized name. Match semantics are OR (CAS or name).
 */
export const agentRuleMatches = (
  rule: { agentCas: string | null; agentNameNormalized: string | null },
  agentCasNormalized: string | null,
  agentNameNormalized: string | null,
): boolean => {
  if (agentCasNormalized && normalizeCas(rule.agentCas) === agentCasNormalized) {
    return true;
  }
  if (
    agentNameNormalized &&
    rule.agentNameNormalized === agentNameNormalized
  ) {
    return true;
  }
  return false;
};

/**
 * Matches a biological indicator against the requested agent. CAS comparison is
 * digit-normalized across casPrimary and casNumbers; name comparison uses the
 * indicator's stored normalized substance name. Match semantics are OR.
 */
export const agentIndicatorMatches = (
  indicator: {
    casPrimary: string | null;
    casNumbers: string[];
    substanceNameNormalized: string | null;
  },
  agentCasNormalized: string | null,
  agentNameNormalized: string | null,
): boolean => {
  if (agentCasNormalized) {
    if (normalizeCas(indicator.casPrimary) === agentCasNormalized) return true;
    if (
      (indicator.casNumbers ?? []).some(
        (cas) => normalizeCas(cas) === agentCasNormalized,
      )
    ) {
      return true;
    }
  }
  if (
    agentNameNormalized &&
    indicator.substanceNameNormalized === agentNameNormalized
  ) {
    return true;
  }
  return false;
};

/**
 * Unions exam ids from every recommendation source, de-duplicating. Sources are
 * variadic so the consolidated riskFactorId path can be merged alongside the
 * Library (ACTIVE/AGENT) and CAS/name indicator sources.
 */
export const mergeRecommendedExamIds = (
  ...sources: number[][]
): Set<number> => new Set<number>(sources.flat());

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
