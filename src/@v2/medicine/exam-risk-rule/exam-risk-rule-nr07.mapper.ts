import {
  BiologicalIndicatorToExam,
  BiologicalIndicatorToRisk,
  Exam,
  OccupationalBiologicalIndicator,
  PcmsoExamRiskRuleScopeEnum,
  PcmsoExamRiskRuleSourceEnum,
  PcmsoExamRiskRuleStatusEnum,
  RiskFactors,
} from '@prisma/client';

import { buildDefaultApplicability } from '../biological-indicator/biological-indicator-applicability.schema';
import { validateApplicationEligibility } from '../biological-indicator/services/biological-indicator-application.eligibility';

/**
 * Grau de risco mínimo qualitativo padrão para regras NR-7 (escala 1..5,
 * 3 = Moderado). Evita sugerir exame em exposição irrelevante/meramente
 * cadastrada. Difere da aplicação operacional NR-7 → ExamToRisk (que usa 1),
 * porque a biblioteca é um catálogo de sugestão técnica.
 */
export const NR07_DEFAULT_MIN_RISK_DEGREE = 3;
export const NR07_DEFAULT_VALIDITY_MONTHS = 6;

export type Nr07IndicatorWithLinks = OccupationalBiologicalIndicator & {
  riskLinks: Array<
    BiologicalIndicatorToRisk & {
      riskFactor: Pick<RiskFactors, 'id' | 'name' | 'system' | 'deleted_at'>;
    }
  >;
  examLinks: Array<
    BiologicalIndicatorToExam & {
      exam: Pick<Exam, 'id' | 'name' | 'system' | 'deleted_at'>;
    }
  >;
};

export type Nr07RuleExamData = {
  examId: number | null;
  examNameSnapshot: string | null;
  isAdmission: boolean;
  isPeriodic: boolean;
  isChange: boolean;
  isReturn: boolean;
  isDismissal: boolean;
  isMale: boolean;
  isFemale: boolean;
  validityInMonths: number | null;
  considerBetweenDays: number | null;
  fromAge: number | null;
  toAge: number | null;
  minRiskDegree: number | null;
  minRiskDegreeQuantity: number | null;
  collectionToleranceDays: number | null;
  collectionMoment: string | null;
};

export type Nr07RuleData = {
  scope: PcmsoExamRiskRuleScopeEnum;
  source: PcmsoExamRiskRuleSourceEnum;
  sourceIndicatorId: string;
  agentCas: string | null;
  agentName: string | null;
  agentNameNormalized: string | null;
  riskNameSnapshot: string | null;
  status: PcmsoExamRiskRuleStatusEnum;
  rationale: string;
  exam: Nr07RuleExamData | null;
  /**
   * Motivos (block codes) que impedem a regra de nascer ACTIVE. Vazio = elegível.
   * Espelha validateApplicationEligibility + verificação de agente.
   */
  pendingReasons: string[];
};

// Canonical agent-name normalization lives in the shared util so that NR-7,
// ACGIH/BEI and the Library produce identical `agentNameNormalized` values.
// Re-exported here to preserve the existing import surface.
export { normalizeAgentName } from '@/shared/utils/agent-normalize.util';
import { normalizeAgentName } from '@/shared/utils/agent-normalize.util';

const resolveApplicability = (indicator: Nr07IndicatorWithLinks) => {
  const base = indicator.occupationalApplicability as Record<string, unknown> | null;
  const fallback = buildDefaultApplicability({
    tableNumber: indicator.tableNumber,
    indicatorType: indicator.indicatorType,
  });

  if (!base || typeof base !== 'object') return fallback;

  const readFlag = (key: keyof typeof fallback): boolean =>
    typeof base[key] === 'boolean' ? (base[key] as boolean) : fallback[key];

  return {
    isPeriodic: readFlag('isPeriodic'),
    isAdmission: readFlag('isAdmission'),
    isReturn: readFlag('isReturn'),
    isChange: readFlag('isChange'),
    isDismissal: readFlag('isDismissal'),
  };
};

const buildRationale = (
  agentName: string | null,
  examName: string | null,
): string => {
  const agentLabel = agentName ?? 'agente não identificado';
  if (examName) {
    return (
      `Regra derivada da base normativa de Indicadores Biológicos da NR-7 cadastrada no SimpleSST. ` +
      `Para o agente ${agentLabel}, sugere o indicador/exame ${examName}, com acompanhamento periódico, ` +
      `observando a interpretação, o momento de coleta e demais observações técnicas cadastradas na base normativa.`
    );
  }
  return (
    `Regra derivada da base normativa de Indicadores Biológicos da NR-7 cadastrada no SimpleSST. ` +
    `Sugere o exame/indicador biológico relacionado ao agente ${agentLabel}, para acompanhamento periódico ` +
    `da exposição ocupacional, observando a interpretação, o momento de coleta e demais observações técnicas ` +
    `cadastradas na base normativa.`
  );
};

/**
 * Mapeia um indicador biológico NR-7 (Anexo I) para os dados de uma regra
 * Exame × Risco da biblioteca. Função pura: não persiste nada.
 */
export const buildNr07RuleData = (
  indicator: Nr07IndicatorWithLinks,
): Nr07RuleData => {
  const eligibility = validateApplicationEligibility(indicator);
  const defaultExamLink = eligibility.defaultExamLink;
  const primaryRiskLink = eligibility.primaryRiskLink;

  const agentCas = indicator.casPrimary?.trim() || null;
  const agentName = indicator.substanceName?.trim() || null;
  const examName =
    defaultExamLink?.exam?.name ?? defaultExamLink?.examNameSnapshot ?? null;

  const applicability = resolveApplicability(indicator);

  // Critério de ACTIVE = elegibilidade normativa completa (indicador ACTIVE,
  // risco principal confirmado, exame default confirmado, catálogo system,
  // revisão normativa concluída quando exigida) + agente identificado.
  // Qualquer pendência real → DRAFT, com o motivo exposto em pendingReasons.
  const pendingReasons: string[] = [...eligibility.blockCodes];
  if (!agentName) pendingReasons.push('AGENT_MISSING');

  const isEligible = eligibility.isEligible && Boolean(agentName);

  const exam: Nr07RuleExamData | null = defaultExamLink
    ? {
        examId: defaultExamLink.examId ?? null,
        examNameSnapshot: examName,
        isAdmission: applicability.isAdmission,
        isPeriodic: applicability.isPeriodic,
        isChange: applicability.isChange,
        isReturn: applicability.isReturn,
        isDismissal: applicability.isDismissal,
        isMale: true,
        isFemale: true,
        validityInMonths:
          indicator.defaultValidityMonths ?? NR07_DEFAULT_VALIDITY_MONTHS,
        considerBetweenDays: null,
        fromAge: null,
        toAge: null,
        minRiskDegree: NR07_DEFAULT_MIN_RISK_DEGREE,
        minRiskDegreeQuantity: null,
        collectionToleranceDays: indicator.collectionToleranceDays ?? null,
        collectionMoment: indicator.collectionMoment ?? null,
      }
    : null;

  return {
    scope: PcmsoExamRiskRuleScopeEnum.AGENT,
    source: PcmsoExamRiskRuleSourceEnum.NR_07,
    sourceIndicatorId: indicator.id,
    agentCas,
    agentName,
    agentNameNormalized: normalizeAgentName(indicator.substanceName),
    riskNameSnapshot: primaryRiskLink?.riskFactor?.name ?? null,
    status: isEligible
      ? PcmsoExamRiskRuleStatusEnum.ACTIVE
      : PcmsoExamRiskRuleStatusEnum.DRAFT,
    rationale: buildRationale(agentName, examName),
    exam,
    pendingReasons,
  };
};
