import {
  BiologicalIndicatorMatchConfidenceEnum,
  BiologicalIndicatorMatchMethodEnum,
} from '@prisma/client';

import { AcgihRiskCorrelationItem } from './acgih-risk-correlation.service';
import {
  AcgihRiskCorrelationCardinality,
  AcgihRiskCorrelationLink,
  AcgihRiskCorrelationStatus,
} from './acgih-risk-correlation.util';

/**
 * Frente A.3 — utilitário PURO (sem I/O) do apply da correlação ACGIH/BEI ×
 * Fatores de Risco. Decide elegibilidade do item, mapeia confiança/método por
 * status e monta os snapshots/notes de rastreabilidade. Nenhuma escrita aqui.
 */

/** Motivos pelos quais um item do preview NÃO gera vínculo. */
export type AcgihRiskCorrelationSkipReason =
  | 'NOT_PROMOTED'
  | 'HAS_BLOCKERS'
  | 'NO_LINKS'
  | 'NOT_ELIGIBLE_STATUS';

/**
 * Status finais que AUTORIZAM criação de vínculo (têm mapeamento de
 * confiança/método definido pela decisão de produto A.3). Qualquer outro status
 * (NO_MATCH, AMBIGUOUS, MATCH_NAME, ALREADY_LINKED, OVERRIDE_TARGET_MISSING) é
 * tratado como NOT_ELIGIBLE_STATUS.
 */
export const ACGIH_RISK_CORRELATION_ELIGIBLE_STATUSES: ReadonlySet<AcgihRiskCorrelationStatus> =
  new Set<AcgihRiskCorrelationStatus>([
    'MATCH_REUSED_NR7',
    'MATCH_CAS_EXACT',
    'MATCH_CAS_IN_GROUP',
    'ACEITAR_CANONICO',
    'ACEITAR_GRUPO',
    'ACEITAR_MULTIPLO_CANONICO',
  ]);

export type AcgihRiskCorrelationEligibility = {
  eligible: boolean;
  skipReason?: AcgihRiskCorrelationSkipReason;
};

/**
 * Elegibilidade do item do preview para apply. Ordem de verificação preserva o
 * motivo mais específico: promovido → sem bloqueios → status no whitelist →
 * possui vínculos.
 */
export const evaluateApplyEligibility = (
  item: AcgihRiskCorrelationItem,
): AcgihRiskCorrelationEligibility => {
  if (!item.officialIndicatorId || !item.promoted) {
    return { eligible: false, skipReason: 'NOT_PROMOTED' };
  }
  if (item.blockers.length > 0) {
    return { eligible: false, skipReason: 'HAS_BLOCKERS' };
  }
  if (!ACGIH_RISK_CORRELATION_ELIGIBLE_STATUSES.has(item.finalStatus)) {
    return { eligible: false, skipReason: 'NOT_ELIGIBLE_STATUS' };
  }
  if (item.links.length === 0) {
    return { eligible: false, skipReason: 'NO_LINKS' };
  }
  return { eligible: true };
};

/** Confiança gravada conforme o status final (decisão de produto A.3). */
export const mapMatchConfidence = (
  finalStatus: AcgihRiskCorrelationStatus,
): BiologicalIndicatorMatchConfidenceEnum => {
  switch (finalStatus) {
    case 'MATCH_REUSED_NR7':
    case 'MATCH_CAS_EXACT':
      return BiologicalIndicatorMatchConfidenceEnum.HIGH;
    case 'MATCH_CAS_IN_GROUP':
      return BiologicalIndicatorMatchConfidenceEnum.PROBABLE;
    case 'ACEITAR_CANONICO':
    case 'ACEITAR_GRUPO':
    case 'ACEITAR_MULTIPLO_CANONICO':
      return BiologicalIndicatorMatchConfidenceEnum.MANUAL;
    default:
      // Defensivo: só chamado para status elegíveis.
      return BiologicalIndicatorMatchConfidenceEnum.MANUAL;
  }
};

/**
 * Método gravado conforme o status final e o vínculo. Para reuso NR-7, o método
 * depende do fator: multi-CAS => CAS_MULTI_ANY; CAS único => CAS_EXACT.
 */
export const mapMatchMethod = (
  finalStatus: AcgihRiskCorrelationStatus,
  link: AcgihRiskCorrelationLink,
): BiologicalIndicatorMatchMethodEnum => {
  switch (finalStatus) {
    case 'MATCH_REUSED_NR7':
      return link.riskCasParsed.length > 1
        ? BiologicalIndicatorMatchMethodEnum.CAS_MULTI_ANY
        : BiologicalIndicatorMatchMethodEnum.CAS_EXACT;
    case 'MATCH_CAS_EXACT':
      return BiologicalIndicatorMatchMethodEnum.CAS_EXACT;
    case 'MATCH_CAS_IN_GROUP':
      return BiologicalIndicatorMatchMethodEnum.GROUP_RULE;
    case 'ACEITAR_CANONICO':
      return BiologicalIndicatorMatchMethodEnum.MANUAL;
    case 'ACEITAR_GRUPO':
      return BiologicalIndicatorMatchMethodEnum.GROUP_RULE;
    case 'ACEITAR_MULTIPLO_CANONICO':
      return BiologicalIndicatorMatchMethodEnum.MANUAL;
    default:
      return BiologicalIndicatorMatchMethodEnum.MANUAL;
  }
};

/**
 * isPrimary conforme a cardinalidade (decisão de produto A.3): SINGLE => true;
 * MULTIPLE/NONE => false (não escolher canônico principal arbitrário no TDI).
 */
export const resolveIsPrimary = (
  cardinality: AcgihRiskCorrelationCardinality,
): boolean => cardinality === 'SINGLE';

/** Nota textual de rastreabilidade gravada em `notes` (decisão de produto A.3). */
export const buildApplyNotes = (params: {
  finalStatus: AcgihRiskCorrelationStatus;
  decisionSource: string;
  cardinality: AcgihRiskCorrelationCardinality;
  isGroup: boolean;
  userId: number;
  date: Date;
}): string => {
  const { finalStatus, decisionSource, cardinality, isGroup, userId, date } =
    params;
  const when = date.toLocaleString('pt-BR');
  const grupo = isGroup ? 'sim (grupo/família)' : 'não';
  return [
    'Vínculo criado pela Frente A.3 (correlação ACGIH/BEI × Fator de Risco).',
    `finalStatus=${finalStatus}`,
    `decisionSource=${decisionSource}`,
    `cardinality=${cardinality}`,
    `grupo=${grupo}`,
    `executor=${userId}`,
    `data=${when}`,
  ].join(' | ');
};
