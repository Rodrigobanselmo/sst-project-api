import { PcmsoAcgihBeiIndicatorConfidenceEnum } from '@prisma/client';

/** Veredito técnico da comparação ACGIH/BEI × NR-7 × Regras Exame × Risco. */
export enum AcgihBeiComparisonStatus {
  ALREADY_COVERED = 'ALREADY_COVERED',
  DIVERGENT = 'DIVERGENT',
  NEEDS_REVIEW = 'NEEDS_REVIEW',
  NEW_CANDIDATE = 'NEW_CANDIDATE',
  LOW_CONFIDENCE_REVIEW = 'LOW_CONFIDENCE_REVIEW',
}

/** Sugestão de ação (apenas informativa nesta fase — nada é aplicado). */
export enum AcgihBeiSuggestedAction {
  ADD_REFERENCE_ONLY = 'ADD_REFERENCE_ONLY',
  REVIEW_DIVERGENCE = 'REVIEW_DIVERGENCE',
  CREATE_NEW_RULE_CANDIDATE = 'CREATE_NEW_RULE_CANDIDATE',
  IGNORE_OR_MONITOR = 'IGNORE_OR_MONITOR',
  LOW_CONFIDENCE_REVIEW = 'LOW_CONFIDENCE_REVIEW',
}

export enum MatchStatus {
  FULL = 'FULL',
  PARTIAL = 'PARTIAL',
  NONE = 'NONE',
}

/** Item ACGIH/BEI (apenas campos relevantes para comparação). */
export type AcgihItemInput = {
  id: string;
  substanceName: string;
  cas: string | null;
  determinant: string | null;
  biologicalMatrix: string | null;
  samplingTime: string | null;
  beiValue: string | null;
  unit: string | null;
  notation: string | null;
  confidence: PcmsoAcgihBeiIndicatorConfidenceEnum | null;
};

/** Indicador NR-7 (OccupationalBiologicalIndicator) normalizado p/ comparação. */
export type Nr7IndicatorInput = {
  id: string;
  substanceName: string;
  substanceNameNormalized: string;
  casPrimary: string | null;
  casNumbers: string[];
  determinantNormalized: string; // biologicalIndicatorNormalized
  determinantOriginal: string; // biologicalIndicatorOriginal
  biologicalMatrix: string;
  collectionMoment: string; // enum BiologicalCollectionMomentEnum (string)
  referenceValue: string | null;
  unit: string | null;
};

/** Regra Exame × Risco (campos p/ match por proveniência ou agente). */
export type RuleInput = {
  id: string;
  source: string;
  status: string;
  agentCas: string | null;
  agentName: string | null;
  agentNameNormalized: string | null;
  sourceIndicatorId: string | null;
  examNames: string[];
};

export type ComparisonResult = {
  acgihBeiId: string;
  substanceName: string;
  cas: string | null;
  determinant: string | null;
  biologicalMatrix: string | null;
  samplingTime: string | null;
  beiValue: string | null;
  unit: string | null;
  confidence: PcmsoAcgihBeiIndicatorConfidenceEnum | null;
  // Match NR-7
  nr7MatchStatus: MatchStatus;
  nr7IndicatorId: string | null;
  nr7SubstanceName: string | null;
  nr7IndicatorName: string | null;
  // Match Regras Exame × Risco
  examRiskRuleMatchStatus: MatchStatus;
  examRiskRuleId: string | null;
  examRiskRuleSource: string | null;
  examNameSnapshot: string | null;
  ruleMatchMethod: 'VIA_NR7' | 'VIA_AGENT' | null;
  // Veredito
  comparisonStatus: AcgihBeiComparisonStatus;
  suggestedAction: AcgihBeiSuggestedAction;
  technicalDiff: string;
  reviewNotes: string;
  // Estado persistente da fonte complementar (Fase 4I) — preenchido após o
  // cálculo puro, a partir de PcmsoExamRiskRuleReference. Não afeta o veredito
  // nem a elegibilidade; serve apenas para refletir o vínculo já registrado.
  hasComplementaryReference?: boolean;
  complementaryReferenceId?: string | null;
  complementaryReferenceStatus?: string | null;
};

// ── Normalização ────────────────────────────────────────────────────────────

export const normalizeText = (value?: string | null): string =>
  value
    ? value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .replace(/\s+/g, ' ')
        .toLowerCase()
    : '';

export const normalizeCas = (value?: string | null): string =>
  (value ?? '').replace(/\s/g, '').trim();

/** Mapeia matriz biológica (texto livre) para um bucket canônico. */
export const canonMatrix = (value?: string | null): string => {
  const v = normalizeText(value);
  if (!v) return '';
  if (v.includes('urina') || v.includes('urinaria')) return 'urina';
  if (v.includes('soro') || v.includes('plasma')) return 'soro/plasma';
  if (v.includes('sangue') || v.includes('sanguineo')) return 'sangue';
  if (v.includes('ar exalado') || v.includes('exalado') || v.includes('alveolar'))
    return 'ar exalado';
  return v;
};

/**
 * Mapeia o momento de coleta para um bucket canônico, aceitando tanto o enum
 * NR-7 (AJ, FJ, FJFS…) quanto o texto livre PT da ACGIH/BEI.
 */
export const canonMoment = (value?: string | null): string => {
  const raw = (value ?? '').trim();
  if (!raw) return '';
  const upper = raw.toUpperCase();

  // Enum NR-7 direto.
  const enumMap: Record<string, string> = {
    AJ: 'antes jornada',
    FJ: 'fim jornada',
    FJFS: 'fim jornada/fim semana',
    AJFS: 'antes jornada/fim semana',
    AJ48: 'antes jornada 48h',
    NC: 'nao critico',
    FS: 'fim semana',
    AJ_FJ: 'antes/fim jornada',
  };
  if (enumMap[upper]) return enumMap[upper];

  const v = normalizeText(raw);
  if (v.includes('nao critico') || v.includes('not critical')) return 'nao critico';
  const fimSemana = v.includes('fim de semana') || v.includes('final de semana');
  const fimJornada =
    v.includes('fim da jornada') ||
    v.includes('final da jornada') ||
    v.includes('fim de jornada') ||
    v.includes('end of shift');
  const antesJornada =
    v.includes('antes da jornada') ||
    v.includes('inicio da jornada') ||
    v.includes('pre jornada') ||
    v.includes('prior to shift');
  if (fimJornada && fimSemana) return 'fim jornada/fim semana';
  if (antesJornada && fimSemana) return 'antes jornada/fim semana';
  if (fimJornada) return 'fim jornada';
  if (antesJornada) return 'antes jornada';
  if (fimSemana) return 'fim semana';
  return v;
};

/** Extrai um número e a unidade normalizada de um texto de valor. */
export const parseValue = (
  value?: string | null,
): { num: number | null; unit: string } => {
  const raw = (value ?? '').trim();
  if (!raw) return { num: null, unit: '' };
  const normalized = raw.replace(',', '.');
  const match = normalized.match(/-?\d+(\.\d+)?/);
  const num = match ? Number(match[0]) : null;
  // remove o número para inferir a unidade textual restante
  const unit = normalizeText(normalized.replace(/-?\d+(\.\d+)?/, ''));
  return { num: Number.isFinite(num as number) ? num : null, unit };
};

const casMatches = (acgihCas: string, nr7: Nr7IndicatorInput): boolean => {
  if (!acgihCas) return false;
  if (normalizeCas(nr7.casPrimary) === acgihCas) return true;
  return nr7.casNumbers.some((c) => normalizeCas(c) === acgihCas);
};

type Nr7MatchDetail = {
  status: MatchStatus;
  indicator: Nr7IndicatorInput | null;
  determinantMatch: boolean;
  matrixMatch: boolean;
  momentMatch: boolean;
  valueComparable: boolean;
  valueEqual: boolean;
};

/** Encontra o melhor indicador NR-7 correspondente ao item ACGIH/BEI. */
export const matchNr7 = (
  acgih: AcgihItemInput,
  nr7List: Nr7IndicatorInput[],
): Nr7MatchDetail => {
  const acgihCas = normalizeCas(acgih.cas);
  const acgihSubstance = normalizeText(acgih.substanceName);
  const acgihDet = normalizeText(acgih.determinant);
  const acgihMatrix = canonMatrix(acgih.biologicalMatrix);
  const acgihMoment = canonMoment(acgih.samplingTime);
  const acgihValue = parseValue(acgih.beiValue);
  const acgihUnit = normalizeText(acgih.unit);

  const candidates = nr7List.filter((nr7) => {
    if (acgihCas && casMatches(acgihCas, nr7)) return true;
    if (!acgihCas && acgihSubstance && nr7.substanceNameNormalized === acgihSubstance)
      return true;
    return false;
  });

  if (!candidates.length) {
    return {
      status: MatchStatus.NONE,
      indicator: null,
      determinantMatch: false,
      matrixMatch: false,
      momentMatch: false,
      valueComparable: false,
      valueEqual: false,
    };
  }

  const scored = candidates.map((nr7) => {
    const determinantMatch =
      !!acgihDet && normalizeText(nr7.determinantNormalized) === acgihDet;
    const matrixMatch =
      !!acgihMatrix && canonMatrix(nr7.biologicalMatrix) === acgihMatrix;
    const momentMatch =
      !!acgihMoment && canonMoment(nr7.collectionMoment) === acgihMoment;
    const nr7Value = parseValue(nr7.referenceValue);
    const nr7Unit = normalizeText(nr7.unit);
    const valueComparable = acgihValue.num !== null && nr7Value.num !== null;
    const valueEqual =
      valueComparable &&
      acgihValue.num === nr7Value.num &&
      (acgihUnit === nr7Unit || acgihValue.unit === nr7Value.unit);
    const score =
      (determinantMatch ? 4 : 0) +
      (matrixMatch ? 2 : 0) +
      (momentMatch ? 1 : 0);
    return {
      nr7,
      determinantMatch,
      matrixMatch,
      momentMatch,
      valueComparable,
      valueEqual,
      score,
    };
  });

  scored.sort((a, b) => b.score - a.score);
  const best = scored[0];

  const status =
    best.determinantMatch && best.matrixMatch && best.momentMatch
      ? MatchStatus.FULL
      : MatchStatus.PARTIAL;

  return {
    status,
    indicator: best.nr7,
    determinantMatch: best.determinantMatch,
    matrixMatch: best.matrixMatch,
    momentMatch: best.momentMatch,
    valueComparable: best.valueComparable,
    valueEqual: best.valueEqual,
  };
};

type RuleMatchDetail = {
  status: MatchStatus;
  rule: RuleInput | null;
  method: 'VIA_NR7' | 'VIA_AGENT' | null;
};

/** Encontra regra correspondente: por proveniência NR-7 ou por agente (CAS/nome). */
export const matchRule = (
  acgih: AcgihItemInput,
  nr7Indicator: Nr7IndicatorInput | null,
  rulesBySourceIndicatorId: Map<string, RuleInput>,
  rulesByAgentCas: Map<string, RuleInput>,
  rulesByAgentName: Map<string, RuleInput>,
): RuleMatchDetail => {
  if (nr7Indicator) {
    const viaNr7 = rulesBySourceIndicatorId.get(nr7Indicator.id);
    if (viaNr7) return { status: MatchStatus.FULL, rule: viaNr7, method: 'VIA_NR7' };
  }

  const acgihCas = normalizeCas(acgih.cas);
  if (acgihCas) {
    const viaCas = rulesByAgentCas.get(acgihCas);
    if (viaCas) return { status: MatchStatus.PARTIAL, rule: viaCas, method: 'VIA_AGENT' };
  }

  const acgihSubstance = normalizeText(acgih.substanceName);
  if (acgihSubstance) {
    const viaName = rulesByAgentName.get(acgihSubstance);
    if (viaName)
      return { status: MatchStatus.PARTIAL, rule: viaName, method: 'VIA_AGENT' };
  }

  return { status: MatchStatus.NONE, rule: null, method: null };
};

const buildDiff = (
  acgih: AcgihItemInput,
  nr7: Nr7MatchDetail,
): string => {
  if (!nr7.indicator) return '';
  const parts: string[] = [];
  if (!nr7.determinantMatch) {
    parts.push(
      `determinante: ACGIH "${acgih.determinant ?? '—'}" × NR-7 "${nr7.indicator.determinantOriginal}"`,
    );
  }
  if (!nr7.matrixMatch) {
    parts.push(
      `matriz: ACGIH "${acgih.biologicalMatrix ?? '—'}" × NR-7 "${nr7.indicator.biologicalMatrix}"`,
    );
  }
  if (!nr7.momentMatch) {
    parts.push(
      `momento: ACGIH "${acgih.samplingTime ?? '—'}" × NR-7 "${nr7.indicator.collectionMoment}"`,
    );
  }
  if (nr7.valueComparable && !nr7.valueEqual) {
    parts.push(
      `valor: ACGIH "${acgih.beiValue ?? '—'} ${acgih.unit ?? ''}" × NR-7 "${nr7.indicator.referenceValue ?? '—'} ${nr7.indicator.unit ?? ''}"`,
    );
  } else if (!nr7.valueComparable) {
    parts.push(
      `valor não comparável numericamente: ACGIH "${acgih.beiValue ?? '—'}" × NR-7 "${nr7.indicator.referenceValue ?? '—'}"`,
    );
  }
  return parts.join(' | ');
};

/** Aplica a lógica de classificação e ação sugerida para um item ACGIH/BEI. */
export const compareItem = (
  acgih: AcgihItemInput,
  nr7List: Nr7IndicatorInput[],
  rulesBySourceIndicatorId: Map<string, RuleInput>,
  rulesByAgentCas: Map<string, RuleInput>,
  rulesByAgentName: Map<string, RuleInput>,
): ComparisonResult => {
  const nr7 = matchNr7(acgih, nr7List);
  const rule = matchRule(
    acgih,
    nr7.indicator,
    rulesBySourceIndicatorId,
    rulesByAgentCas,
    rulesByAgentName,
  );

  const base: Omit<
    ComparisonResult,
    'comparisonStatus' | 'suggestedAction' | 'technicalDiff' | 'reviewNotes'
  > = {
    acgihBeiId: acgih.id,
    substanceName: acgih.substanceName,
    cas: acgih.cas,
    determinant: acgih.determinant,
    biologicalMatrix: acgih.biologicalMatrix,
    samplingTime: acgih.samplingTime,
    beiValue: acgih.beiValue,
    unit: acgih.unit,
    confidence: acgih.confidence,
    nr7MatchStatus: nr7.status,
    nr7IndicatorId: nr7.indicator?.id ?? null,
    nr7SubstanceName: nr7.indicator?.substanceName ?? null,
    nr7IndicatorName: nr7.indicator?.determinantOriginal ?? null,
    examRiskRuleMatchStatus: rule.status,
    examRiskRuleId: rule.rule?.id ?? null,
    examRiskRuleSource: rule.rule?.source ?? null,
    examNameSnapshot: rule.rule?.examNames.join('; ') || null,
    ruleMatchMethod: rule.method,
  };

  // 4. Baixa confiança tem precedência.
  if (acgih.confidence === PcmsoAcgihBeiIndicatorConfidenceEnum.LOW) {
    return {
      ...base,
      comparisonStatus: AcgihBeiComparisonStatus.LOW_CONFIDENCE_REVIEW,
      suggestedAction: AcgihBeiSuggestedAction.LOW_CONFIDENCE_REVIEW,
      technicalDiff: buildDiff(acgih, nr7),
      reviewNotes:
        'Item ACGIH/BEI com baixa confiança de transcrição. Revisar antes de qualquer uso.',
    };
  }

  const hasNr7 = nr7.status !== MatchStatus.NONE;
  const hasRule = rule.status !== MatchStatus.NONE;
  const diff = buildDiff(acgih, nr7);

  // 3. Sem nenhuma cobertura → candidato novo.
  if (!hasNr7 && !hasRule) {
    return {
      ...base,
      comparisonStatus: AcgihBeiComparisonStatus.NEW_CANDIDATE,
      suggestedAction: AcgihBeiSuggestedAction.CREATE_NEW_RULE_CANDIDATE,
      technicalDiff: '',
      reviewNotes:
        'Sem equivalente claro em NR-7 ou em Regras Exame × Risco. Possível regra nova (não criar automaticamente).',
    };
  }

  // 1. Correspondência plena com NR-7 e valores equivalentes → confirma.
  if (nr7.status === MatchStatus.FULL && nr7.valueEqual) {
    return {
      ...base,
      comparisonStatus: AcgihBeiComparisonStatus.ALREADY_COVERED,
      suggestedAction: AcgihBeiSuggestedAction.ADD_REFERENCE_ONLY,
      technicalDiff: '',
      reviewNotes: hasRule
        ? 'ACGIH/BEI confirma tecnicamente a regra existente. Sugerir fonte complementar (NR-7 + ACGIH/BEI). Não criar regra.'
        : 'ACGIH/BEI confirma o indicador NR-7 existente. Futuramente registrar como fonte complementar. Não criar regra.',
    };
  }

  // 2. Determinante igual, mas diferença técnica relevante → divergente.
  if (nr7.determinantMatch && (!nr7.matrixMatch || !nr7.momentMatch || (nr7.valueComparable && !nr7.valueEqual))) {
    return {
      ...base,
      comparisonStatus: AcgihBeiComparisonStatus.DIVERGENT,
      suggestedAction: AcgihBeiSuggestedAction.REVIEW_DIVERGENCE,
      technicalDiff: diff,
      reviewNotes:
        'Mesmo agente/determinante, mas com diferença técnica relevante. Revisar antes de qualquer uso.',
    };
  }

  // Correspondência plena no determinante porém valor não comparável → revisar.
  if (nr7.status === MatchStatus.FULL && !nr7.valueComparable) {
    return {
      ...base,
      comparisonStatus: AcgihBeiComparisonStatus.NEEDS_REVIEW,
      suggestedAction: AcgihBeiSuggestedAction.IGNORE_OR_MONITOR,
      technicalDiff: diff,
      reviewNotes:
        'Determinante/matriz/momento equivalentes, mas valor não comparável numericamente. Revisar equivalência técnica.',
    };
  }

  // Demais casos: mesmo agente/substância coberto, mas sem equivalência clara
  // do determinante específico → revisar/monitorar (não criar regra).
  return {
    ...base,
    comparisonStatus: AcgihBeiComparisonStatus.NEEDS_REVIEW,
    suggestedAction: AcgihBeiSuggestedAction.IGNORE_OR_MONITOR,
    technicalDiff: diff,
    reviewNotes: hasRule
      ? 'Agente já possui regra, mas este determinante específico não corresponde plenamente. Revisar se é o mesmo indicador.'
      : 'Substância/agente presente na NR-7, mas determinante específico não corresponde plenamente. Revisar.',
  };
};
