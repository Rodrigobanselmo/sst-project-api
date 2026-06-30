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

import { normalizeAgentName } from '@/shared/utils/agent-normalize.util';

import { NR07_DEFAULT_MIN_RISK_DEGREE, NR07_DEFAULT_VALIDITY_MONTHS } from './exam-risk-rule-nr07.mapper';

export type AcgihIndicatorWithLinks = OccupationalBiologicalIndicator & {
  riskLinks: Array<
    BiologicalIndicatorToRisk & {
      riskFactor: Pick<RiskFactors, 'id' | 'name' | 'cas' | 'system' | 'deleted_at'>;
    }
  >;
  examLinks: Array<
    BiologicalIndicatorToExam & {
      exam: Pick<Exam, 'id' | 'name' | 'system' | 'deleted_at'>;
    }
  >;
};

export type AcgihRuleExamData = {
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

export type AcgihRuleData = {
  scope: PcmsoExamRiskRuleScopeEnum;
  source: PcmsoExamRiskRuleSourceEnum;
  /** Chave idempotente: indicatorId ou indicatorId::riskFactorId (TDI). */
  sourceIndicatorId: string;
  agentCas: string | null;
  agentName: string | null;
  agentNameNormalized: string | null;
  riskNameSnapshot: string | null;
  status: PcmsoExamRiskRuleStatusEnum;
  rationale: string;
  exam: AcgihRuleExamData | null;
  pendingReasons: string[];
  acgihBeiIndicatorId: string | null;
};

/**
 * Chave estável para idempotência de regra própria ACGIH/BEI (source=TECHNICAL).
 * Com múltiplos vínculos de risco (ex.: TDI), cada par indicador×risco gera uma
 * regra distinta — a constraint @@unique([source, sourceIndicatorId]) exige isso.
 */
export const buildAcgihSourceIndicatorKey = (
  indicatorId: string,
  riskFactorId: string,
  confirmedRiskCount: number,
): string =>
  confirmedRiskCount > 1
    ? `${indicatorId}::${riskFactorId}`
    : indicatorId;

const buildRationale = (params: {
  riskName: string | null;
  examName: string | null;
  beiValue: string | null;
  unit: string | null;
  collectionMoment: string | null;
}): string => {
  const risk = params.riskName ?? 'fator de risco não identificado';
  const exam = params.examName ?? 'exame não identificado';
  const bei =
    params.beiValue && params.unit
      ? ` BEI ACGIH/BEI: ${params.beiValue} ${params.unit}.`
      : '';
  const moment = params.collectionMoment
    ? ` Momento de coleta: ${params.collectionMoment}.`
    : '';
  return (
    `Regra técnica derivada do indicador ACGIH/BEI consolidado no SimpleSST. ` +
    `Para o fator de risco ${risk}, sugere o exame/indicador biológico ${exam} ` +
    `como boa prática técnica ACGIH/BEI (não substitui exigência legal NR-7).${bei}${moment} ` +
    `Observar interpretação clínica e demais notas técnicas cadastradas.`
  );
};

/**
 * Mapeia um par (indicador ACGIH oficial, vínculo de risco, exame padrão) para
 * dados de regra AGENT/TECHNICAL da Biblioteca. O agente da regra é o FATOR DE
 * RISCO (nome/CAS), não a substância do indicador — necessário para a Fase 2B
 * recomendar exames ao selecionar o risco na empresa (ex.: Heptano).
 */
export const buildAcgihRuleData = (params: {
  indicator: AcgihIndicatorWithLinks;
  riskLink: AcgihIndicatorWithLinks['riskLinks'][number];
  examLink: AcgihIndicatorWithLinks['examLinks'][number];
  confirmedRiskCount: number;
}): AcgihRuleData => {
  const { indicator, riskLink, examLink, confirmedRiskCount } = params;
  const risk = riskLink.riskFactor;
  const exam = examLink.exam;

  const agentName = risk?.name?.trim() || null;
  const agentCas = risk?.cas?.trim() || null;
  const examName =
    exam?.name ?? examLink.examNameSnapshot ?? null;

  const pendingReasons: string[] = [];

  if (!agentName) pendingReasons.push('AGENT_MISSING');
  if (risk?.deleted_at) pendingReasons.push('RISK_DELETED');
  else if (risk && !risk.system) pendingReasons.push('RISK_NOT_SYSTEM');
  if (exam?.deleted_at) pendingReasons.push('EXAM_DELETED');
  else if (exam && !exam.system) pendingReasons.push('EXAM_NOT_SYSTEM');
  if (!indicator.collectionMoment) pendingReasons.push('COLLECTION_MOMENT_MISSING');

  const isEligible = pendingReasons.length === 0 && Boolean(examLink.examId);

  const ruleExam: AcgihRuleExamData | null = examLink.examId
    ? {
        examId: examLink.examId,
        examNameSnapshot: examName,
        isAdmission: false,
        isPeriodic: true,
        isChange: false,
        isReturn: false,
        isDismissal: false,
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
    source: PcmsoExamRiskRuleSourceEnum.TECHNICAL,
    sourceIndicatorId: buildAcgihSourceIndicatorKey(
      indicator.id,
      riskLink.riskFactorId,
      confirmedRiskCount,
    ),
    agentCas,
    agentName,
    agentNameNormalized: normalizeAgentName(agentName),
    riskNameSnapshot: agentName,
    status: isEligible
      ? PcmsoExamRiskRuleStatusEnum.ACTIVE
      : PcmsoExamRiskRuleStatusEnum.DRAFT,
    rationale: buildRationale({
      riskName: agentName,
      examName,
      beiValue: indicator.referenceValue,
      unit: indicator.unit,
      collectionMoment: indicator.collectionMoment,
    }),
    exam: ruleExam,
    pendingReasons,
    acgihBeiIndicatorId: indicator.acgihBeiIndicatorId,
  };
};
