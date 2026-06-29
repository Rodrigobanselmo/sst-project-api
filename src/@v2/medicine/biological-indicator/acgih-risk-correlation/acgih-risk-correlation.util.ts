import {
  collectNormalizedCasNumbers,
  collectRiskNormalizedNames,
  normalizeRiskNameForMatch,
} from '../biological-indicator-risk-match.util';
import { normalizeText, parseCasNumbers } from '../biological-indicator-normalize.util';
import {
  ACGIH_RISK_CORRELATION_OVERRIDES,
  AcgihCorrelationOverride,
} from './acgih-risk-correlation-overrides.const';

/**
 * Frente A.1 — utilitário PURO (sem I/O) da correlação ACGIH/BEI × Fatores de
 * Risco. Calcula o status automático (reuso NR-7, CAS exato, CAS em grupo,
 * nome/sinônimo) e sobrepõe os overrides manuais versionados. Nenhuma escrita.
 */

export type AcgihRiskCorrelationStatus =
  | 'MATCH_REUSED_NR7'
  | 'MATCH_CAS_EXACT'
  | 'MATCH_CAS_IN_GROUP'
  | 'MATCH_NAME'
  | 'AMBIGUOUS'
  | 'NO_MATCH'
  | 'ALREADY_LINKED'
  | 'ACEITAR_CANONICO'
  | 'ACEITAR_GRUPO'
  | 'ACEITAR_MULTIPLO_CANONICO'
  | 'OVERRIDE_TARGET_MISSING';

export type AcgihRiskCorrelationDecisionSource = 'AUTO' | 'MANUAL_OVERRIDE';

export type AcgihRiskCorrelationCardinality = 'SINGLE' | 'MULTIPLE' | 'NONE';

export type AcgihRiskCorrelationMatchMethod =
  | 'CAS_VIA_NR7_LINK'
  | 'CAS_EXACT'
  | 'CAS_IN_GROUP'
  | 'NAME_EXACT'
  | 'SYNONYM_EXACT'
  | 'ALREADY_LINKED'
  | 'MANUAL_OVERRIDE'
  | null;

export type AcgihRiskCorrelationConfidence =
  | 'HIGH'
  | 'PROBABLE'
  | 'LOW'
  | 'MANUAL'
  | null;

export type AcgihRiskCorrelationLink = {
  riskFactorId: string;
  riskName: string;
  riskCasRaw: string | null;
  riskCasParsed: string[];
  matchMethod: AcgihRiskCorrelationMatchMethod;
  confidence: AcgihRiskCorrelationConfidence;
  isGroup: boolean;
};

/** Linha ACGIH/BEI (staging) a ser correlacionada. */
export type AcgihIndicatorSnapshot = {
  id: string;
  substanceName: string;
  substanceNameNormalized: string | null;
  cas: string | null;
  determinant: string | null;
  biologicalMatrix: string | null;
};

/** Fator de risco do sistema (system=true). */
export type RiskFactorSnapshot = {
  id: string;
  name: string;
  cas: string | null;
  synonymous: string[];
};

/** Indicador oficial NR-7 com seus vínculos de risco já existentes. */
export type Nr7IndicatorSnapshot = {
  substanceName: string;
  casNumbers: string[];
  riskLinks: { riskFactorId: string; riskName: string; riskCasRaw: string | null }[];
};

/** Estado de promoção/vínculo do item ACGIH no banco atual. */
export type AcgihPromotionSnapshot = {
  officialId: string | null;
  linkedRisks: {
    riskFactorId: string;
    riskName: string;
    riskCasRaw: string | null;
  }[];
};

/** Validação de um RiskFactor alvo de override (resolvido por id). */
export type OverrideTargetResolution = {
  riskFactorId: string;
  exists: boolean;
  isSystem: boolean;
  isDeleted: boolean;
  name: string | null;
  cas: string | null;
};

export type AcgihRiskCorrelationAutoResult = {
  status: AcgihRiskCorrelationStatus;
  links: AcgihRiskCorrelationLink[];
  note: string;
};

const toLink = (
  risk: { id: string; name: string; cas: string | null },
  method: AcgihRiskCorrelationMatchMethod,
  confidence: AcgihRiskCorrelationConfidence,
  isGroup: boolean,
): AcgihRiskCorrelationLink => ({
  riskFactorId: risk.id,
  riskName: risk.name,
  riskCasRaw: risk.cas ?? null,
  riskCasParsed: collectNormalizedCasNumbers(risk.cas),
  matchMethod: method,
  confidence,
  isGroup,
});

const acgihNormalizedNames = (acgih: AcgihIndicatorSnapshot): Set<string> => {
  const names = new Set<string>();
  const fromRaw = normalizeRiskNameForMatch(acgih.substanceName);
  if (fromRaw) names.add(fromRaw);
  const plain = normalizeText(acgih.substanceName);
  if (plain) names.add(plain);
  if (acgih.substanceNameNormalized) {
    const norm = normalizeText(acgih.substanceNameNormalized);
    if (norm) names.add(norm);
  }
  return names;
};

/**
 * Classificação automática (heurística determinística). Ordem:
 *   1) ALREADY_LINKED — item promovido cujo indicador oficial já tem vínculo;
 *   2) MATCH_REUSED_NR7 — CAS bate em indicador NR-7 que já possui um único
 *      RiskFactor vinculado (reusa a correlação NR-7);
 *   3) CAS contra fatores do sistema — único single-CAS = CAS_EXACT; único
 *      multi-CAS = CAS_IN_GROUP; mais de um = AMBIGUOUS;
 *   4) Nome/sinônimo — único = NAME/SYNONYM; mais de um = AMBIGUOUS;
 *   5) NO_MATCH.
 * Função pura: não acessa banco.
 */
export const classifyAuto = (params: {
  acgih: AcgihIndicatorSnapshot;
  risks: RiskFactorSnapshot[];
  nr7: Nr7IndicatorSnapshot[];
  promotion: AcgihPromotionSnapshot;
}): AcgihRiskCorrelationAutoResult => {
  const { acgih, risks, nr7, promotion } = params;

  // 1) Já vinculado no banco atual.
  if (promotion.officialId && promotion.linkedRisks.length > 0) {
    return {
      status: 'ALREADY_LINKED',
      links: promotion.linkedRisks.map((l) =>
        toLink(
          { id: l.riskFactorId, name: l.riskName, cas: l.riskCasRaw },
          'ALREADY_LINKED',
          'HIGH',
          collectNormalizedCasNumbers(l.riskCasRaw).length > 1,
        ),
      ),
      note: 'Indicador oficial promovido já possui vínculo de risco no banco atual.',
    };
  }

  const acgihCas = new Set(collectNormalizedCasNumbers(acgih.cas));

  // 2) Reuso de correlação NR-7 por CAS.
  if (acgihCas.size) {
    const matchingNr7 = nr7.filter((indicator) =>
      indicator.casNumbers.some((cas) =>
        collectNormalizedCasNumbers(cas).some((c) => acgihCas.has(c)),
      ),
    );

    const linkByRiskId = new Map<
      string,
      { riskFactorId: string; riskName: string; riskCasRaw: string | null; source: string }
    >();
    for (const indicator of matchingNr7) {
      for (const link of indicator.riskLinks) {
        if (!linkByRiskId.has(link.riskFactorId)) {
          linkByRiskId.set(link.riskFactorId, {
            ...link,
            source: indicator.substanceName,
          });
        }
      }
    }

    if (linkByRiskId.size === 1) {
      const [reuse] = Array.from(linkByRiskId.values());
      return {
        status: 'MATCH_REUSED_NR7',
        links: [
          toLink(
            { id: reuse.riskFactorId, name: reuse.riskName, cas: reuse.riskCasRaw },
            'CAS_VIA_NR7_LINK',
            'HIGH',
            collectNormalizedCasNumbers(reuse.riskCasRaw).length > 1,
          ),
        ],
        note: `Reusa vínculo NR-7 (indicador "${reuse.source}") por CAS.`,
      };
    }
  }

  // 3) CAS contra fatores do sistema.
  if (acgihCas.size) {
    const casMatches = risks.filter((risk) =>
      collectNormalizedCasNumbers(risk.cas).some((c) => acgihCas.has(c)),
    );

    if (casMatches.length === 1) {
      const risk = casMatches[0];
      const isGroup = collectNormalizedCasNumbers(risk.cas).length > 1;
      return {
        status: isGroup ? 'MATCH_CAS_IN_GROUP' : 'MATCH_CAS_EXACT',
        links: [
          toLink(
            risk,
            isGroup ? 'CAS_IN_GROUP' : 'CAS_EXACT',
            'HIGH',
            isGroup,
          ),
        ],
        note: isGroup
          ? 'CAS encontrado dentro de fator amplo/grupo (múltiplos CAS).'
          : 'CAS bate exatamente com fator único do sistema.',
      };
    }

    if (casMatches.length > 1) {
      return {
        status: 'AMBIGUOUS',
        links: casMatches.map((risk) =>
          toLink(
            risk,
            'CAS_EXACT',
            'PROBABLE',
            collectNormalizedCasNumbers(risk.cas).length > 1,
          ),
        ),
        note: `CAS aparece em ${casMatches.length} fatores distintos.`,
      };
    }
  }

  // 4) Nome / sinônimo.
  const names = acgihNormalizedNames(acgih);
  const nameMatches = risks.filter((risk) =>
    collectRiskNormalizedNames(risk).some((n) => names.has(n)),
  );

  if (nameMatches.length === 1) {
    const risk = nameMatches[0];
    const viaSynonym = (risk.synonymous ?? []).some((syn) =>
      names.has(normalizeRiskNameForMatch(syn)),
    );
    return {
      status: 'MATCH_NAME',
      links: [
        toLink(
          risk,
          viaSynonym ? 'SYNONYM_EXACT' : 'NAME_EXACT',
          'PROBABLE',
          collectNormalizedCasNumbers(risk.cas).length > 1,
        ),
      ],
      note: viaSynonym
        ? 'Nome bate com sinônimo de fator único.'
        : 'Nome bate com fator único do sistema.',
    };
  }

  if (nameMatches.length > 1) {
    return {
      status: 'AMBIGUOUS',
      links: nameMatches.map((risk) =>
        toLink(risk, 'NAME_EXACT', 'LOW', false),
      ),
      note: `Nome bate com ${nameMatches.length} fatores distintos.`,
    };
  }

  return {
    status: 'NO_MATCH',
    links: [],
    note: acgihCas.size
      ? 'CAS e nome não encontrados no catálogo system.'
      : 'Sem CAS; nome não encontrado no catálogo system.',
  };
};

export const findOverrideForAcgih = (
  acgih: AcgihIndicatorSnapshot,
): AcgihCorrelationOverride | null => {
  const names = acgihNormalizedNames(acgih);
  const acgihCas = new Set(collectNormalizedCasNumbers(acgih.cas));

  for (const override of ACGIH_RISK_CORRELATION_OVERRIDES) {
    const nameHit = override.acgihNameNormalized.some((name) =>
      names.has(normalizeText(name)),
    );
    const casHit =
      override.acgihCas.length > 0 &&
      override.acgihCas.some((cas) =>
        collectNormalizedCasNumbers(cas).some((c) => acgihCas.has(c)),
      );
    if (nameHit || casHit) return override;
  }
  return null;
};

export type AcgihRiskCorrelationFinal = {
  finalStatus: AcgihRiskCorrelationStatus;
  decisionSource: AcgihRiskCorrelationDecisionSource;
  cardinality: AcgihRiskCorrelationCardinality;
  links: AcgihRiskCorrelationLink[];
  blockers: string[];
  warnings: string[];
  note: string;
};

const cardinalityOf = (count: number): AcgihRiskCorrelationCardinality =>
  count === 0 ? 'NONE' : count > 1 ? 'MULTIPLE' : 'SINGLE';

/**
 * Aplica o override (se houver) sobre o resultado automático. Valida os alvos
 * via `targetResolutions` (resolvidos por id no repositório). Função pura.
 */
export const applyOverride = (params: {
  auto: AcgihRiskCorrelationAutoResult;
  override: AcgihCorrelationOverride | null;
  targetResolutions: Map<string, OverrideTargetResolution>;
}): AcgihRiskCorrelationFinal => {
  const { auto, override, targetResolutions } = params;

  if (!override) {
    return {
      finalStatus: auto.status,
      decisionSource: 'AUTO',
      cardinality: cardinalityOf(auto.links.length),
      links: auto.links,
      blockers: [],
      warnings: [],
      note: auto.note,
    };
  }

  const blockers: string[] = [];
  const warnings: string[] = [];
  const links: AcgihRiskCorrelationLink[] = [];

  for (const target of override.targets) {
    const resolution = targetResolutions.get(target.riskFactorId);
    if (!resolution || !resolution.exists || resolution.isDeleted) {
      blockers.push(
        `OVERRIDE_TARGET_MISSING: RiskFactor ${target.riskFactorId} (${target.expectedRiskName}) não encontrado/ativo.`,
      );
      continue;
    }
    if (!resolution.isSystem) {
      blockers.push(
        `OVERRIDE_TARGET_MISSING: RiskFactor ${target.riskFactorId} não é system=true.`,
      );
      continue;
    }
    if (
      resolution.name &&
      normalizeText(resolution.name) !== normalizeText(target.expectedRiskName)
    ) {
      warnings.push(
        `Nome do fator divergente do esperado: "${resolution.name}" ≠ "${target.expectedRiskName}".`,
      );
    }
    links.push(
      toLink(
        { id: resolution.riskFactorId, name: resolution.name ?? target.expectedRiskName, cas: resolution.cas },
        'MANUAL_OVERRIDE',
        'MANUAL',
        override.isGroup,
      ),
    );
  }

  if (blockers.length > 0) {
    return {
      finalStatus: 'OVERRIDE_TARGET_MISSING',
      decisionSource: 'MANUAL_OVERRIDE',
      cardinality: cardinalityOf(links.length),
      links,
      blockers,
      warnings,
      note: override.note,
    };
  }

  return {
    finalStatus: override.finalStatus,
    decisionSource: 'MANUAL_OVERRIDE',
    cardinality: cardinalityOf(links.length),
    links,
    blockers,
    warnings,
    note: override.note,
  };
};

export const countBy = <T extends string>(
  values: T[],
): Record<string, number> => {
  const acc: Record<string, number> = {};
  for (const v of values) acc[v] = (acc[v] ?? 0) + 1;
  return acc;
};

export const parseAcgihCasList = (raw?: string | null): string[] =>
  parseCasNumbers(raw);
