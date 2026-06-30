import {
  PcmsoExamRiskRuleScopeEnum,
  PcmsoExamRiskRuleSourceEnum,
  RiskFactorsEnum,
} from '@prisma/client';

export type IndicatorRiskLinkForDisplay = {
  deleted_at: Date | null;
  isConfirmed: boolean;
  isPrimary: boolean;
  riskFactorId: string;
  riskFactor: {
    id: string;
    name: string;
    deleted_at: Date | null;
  } | null;
};

export type ResolvedIndicatorRiskFactor = {
  riskFactorId: string;
  riskFactorName: string;
};

const trimOrNull = (value: string | null | undefined): string | null => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
};

/**
 * Resolve o fator de risco SimpleSST exibível a partir dos vínculos confirmados
 * do indicador biológico NR-7 (mesma regra do primaryRiskLink da elegibilidade,
 * com fallback para o primeiro confirmado quando não há primário único).
 */
export const resolveIndicatorRiskFactorForDisplay = (
  riskLinks: IndicatorRiskLinkForDisplay[],
): ResolvedIndicatorRiskFactor | null => {
  const confirmed = riskLinks.filter(
    (link) =>
      !link.deleted_at &&
      link.isConfirmed &&
      link.riskFactor &&
      !link.riskFactor.deleted_at,
  );

  if (!confirmed.length) return null;

  const pick =
    confirmed.length === 1
      ? confirmed[0]
      : confirmed.find((link) => link.isPrimary) ?? confirmed[0];

  const riskFactor = pick.riskFactor;
  if (!riskFactor) return null;

  return {
    riskFactorId: riskFactor.id,
    riskFactorName: riskFactor.name,
  };
};

export type ExamRiskRuleDisplayInput = {
  scope: PcmsoExamRiskRuleScopeEnum;
  source: PcmsoExamRiskRuleSourceEnum;
  riskFactorId: string | null;
  riskCategory: RiskFactorsEnum | null;
  riskSubTypeId: number | null;
  agentName: string | null;
  agentCas: string | null;
  riskNameSnapshot: string | null;
  subTypeNameSnapshot: string | null;
  sourceIndicatorId: string | null;
  /** Enriquecimento read-only via indicador NR-7 (browse). */
  indicatorRiskFactor?: ResolvedIndicatorRiskFactor | null;
};

const categoryLabels: Record<RiskFactorsEnum, string> = {
  BIO: 'Biológico',
  QUI: 'Químico',
  FIS: 'Físico',
  ERG: 'Ergonômico',
  ACI: 'Acidente',
  OUTROS: 'Outros',
};

/**
 * Nome exibível do fator de risco para a Biblioteca Risco × Exame.
 */
export const resolveExamRiskRuleRiskFactorDisplayName = (
  rule: ExamRiskRuleDisplayInput,
): string => {
  switch (rule.scope) {
    case PcmsoExamRiskRuleScopeEnum.RISK:
      return trimOrNull(rule.riskNameSnapshot) ?? rule.riskFactorId ?? '—';
    case PcmsoExamRiskRuleScopeEnum.CATEGORY:
      return rule.riskCategory ? categoryLabels[rule.riskCategory] : '—';
    case PcmsoExamRiskRuleScopeEnum.GROUP:
      return (
        trimOrNull(rule.subTypeNameSnapshot) ??
        String(rule.riskSubTypeId ?? '—')
      );
    case PcmsoExamRiskRuleScopeEnum.AGENT: {
      const fromIndicator = rule.indicatorRiskFactor?.riskFactorName;
      if (fromIndicator) return fromIndicator;

      const fromSnapshot = trimOrNull(rule.riskNameSnapshot);
      if (fromSnapshot) return fromSnapshot;

      return trimOrNull(rule.agentName) ?? trimOrNull(rule.agentCas) ?? '—';
    }
    default:
      return '—';
  }
};

/** Subtítulo de rastreabilidade quando o rótulo normativo difere do exibido. */
export const resolveExamRiskRuleNormativeOriginLabel = (
  rule: ExamRiskRuleDisplayInput,
): string | null => {
  if (rule.scope !== PcmsoExamRiskRuleScopeEnum.AGENT) return null;

  const normative = trimOrNull(rule.agentName);
  if (!normative) return null;

  const display = resolveExamRiskRuleRiskFactorDisplayName(rule);
  if (display === '—') return null;

  const same =
    normative.localeCompare(display, 'pt-BR', { sensitivity: 'accent' }) === 0;
  if (same) return null;

  return `Origem normativa: ${normative}`;
};
