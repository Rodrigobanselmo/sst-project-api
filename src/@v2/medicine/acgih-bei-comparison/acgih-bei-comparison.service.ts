import { Injectable } from '@nestjs/common';

import { getActivationPendencies } from '../biological-indicator/services/biological-indicator-activation.validator';
import { AcgihBeiComparisonRepository } from './acgih-bei-comparison.repository';
import {
  AcgihBeiComparisonStatus,
  AcgihBeiSuggestedAction,
  AcgihItemInput,
  compareItem,
  ComparisonResult,
  normalizeCas,
  normalizeText,
  Nr7IndicatorInput,
  RuleInput,
} from './acgih-bei-comparison.util';

export type ComparisonFilters = {
  search?: string;
  comparisonStatus?: AcgihBeiComparisonStatus;
  suggestedAction?: AcgihBeiSuggestedAction;
  confidence?: string;
};

export type ComparisonTotals = {
  total: number;
  alreadyCovered: number;
  divergent: number;
  needsReview: number;
  newCandidate: number;
  lowConfidenceReview: number;
};

export type ComparisonResponse = {
  totals: ComparisonTotals;
  data: ComparisonResult[];
  page: number;
  limit: number;
  count: number;
};

@Injectable()
export class AcgihBeiComparisonService {
  constructor(private readonly repository: AcgihBeiComparisonRepository) {}

  /** Calcula a comparação completa (sem paginação) — base p/ tela e export. */
  async computeAll(): Promise<ComparisonResult[]> {
    const [acgihRows, nr7Rows, ruleRows, activeReferences] = await Promise.all([
      this.repository.findAcgihBeiIndicators(),
      this.repository.findNr07Indicators(),
      this.repository.findExamRiskRules(),
      this.repository.findActiveAcgihReferences(),
    ]);

    // Indexa referências ACGIH ativas por regra+indicador, para refletir o
    // vínculo persistente em cada linha (sem afetar o veredito/elegibilidade).
    const referenceByRuleAndAcgih = new Map<
      string,
      { id: string; status: string }
    >();
    for (const reference of activeReferences) {
      if (!reference.acgihBeiIndicatorId) continue;
      referenceByRuleAndAcgih.set(
        `${reference.ruleId}::${reference.acgihBeiIndicatorId}`,
        { id: reference.id, status: reference.status },
      );
    }

    const nr7List: Nr7IndicatorInput[] = nr7Rows.map((n) => {
      // 4L.1a — reaproveita a lógica de pendências de ativação NR-7 já existente
      // (read-only). Sem N+1: os vínculos vêm no mesmo findMany.
      const pendencies = getActivationPendencies({
        indicator: {
          deleted_at: n.deleted_at,
          requiresNormativeReview: n.requiresNormativeReview,
          reviewedAt: n.reviewedAt,
        },
        riskLinks: n.riskLinks ?? [],
        examLinks: n.examLinks ?? [],
      });
      return {
        id: n.id,
        substanceName: n.substanceName,
        substanceNameNormalized: n.substanceNameNormalized,
        casPrimary: n.casPrimary,
        casNumbers: n.casNumbers ?? [],
        determinantNormalized: n.biologicalIndicatorNormalized,
        determinantOriginal: n.biologicalIndicatorOriginal,
        biologicalMatrix: n.biologicalMatrix,
        collectionMoment: String(n.collectionMoment),
        referenceValue: n.referenceValue,
        unit: n.unit,
        status: String(n.status),
        pendencyCount: pendencies.length,
        pendencyCodes: pendencies.map((p) => p.code),
      };
    });

    const rules: RuleInput[] = ruleRows.map((r) => ({
      id: r.id,
      source: String(r.source),
      status: String(r.status),
      isCurated: r.isCurated,
      agentCas: r.agentCas,
      agentName: r.agentName,
      agentNameNormalized: r.agentNameNormalized,
      sourceIndicatorId: r.sourceIndicatorId,
      examNames: r.exams
        .map((e) => e.examNameSnapshot)
        .filter((name): name is string => !!name),
    }));

    const rulesBySourceIndicatorId = new Map<string, RuleInput>();
    const rulesByAgentCas = new Map<string, RuleInput>();
    const rulesByAgentName = new Map<string, RuleInput>();
    for (const rule of rules) {
      if (rule.source === 'NR_07' && rule.sourceIndicatorId) {
        rulesBySourceIndicatorId.set(rule.sourceIndicatorId, rule);
      }
      const cas = normalizeCas(rule.agentCas);
      if (cas && !rulesByAgentCas.has(cas)) rulesByAgentCas.set(cas, rule);
      const name = normalizeText(rule.agentNameNormalized ?? rule.agentName);
      if (name && !rulesByAgentName.has(name)) rulesByAgentName.set(name, rule);
    }

    const acgihItems: AcgihItemInput[] = acgihRows.map((a) => ({
      id: a.id,
      substanceName: a.substanceName,
      cas: a.cas,
      determinant: a.determinant,
      biologicalMatrix: a.biologicalMatrix,
      samplingTime: a.samplingTime,
      beiValue: a.beiValue,
      unit: a.unit,
      notation: a.notation,
      confidence: a.confidence,
      // 4L.1a — contexto de curadoria (read-only).
      status: String(a.status),
      isCurated: a.isCurated,
      sourceYear: a.sourceYear,
      sourcePage: a.sourcePage,
    }));

    return acgihItems.map((item) => {
      const row = compareItem(
        item,
        nr7List,
        rulesBySourceIndicatorId,
        rulesByAgentCas,
        rulesByAgentName,
      );
      const reference = row.examRiskRuleId
        ? referenceByRuleAndAcgih.get(
            `${row.examRiskRuleId}::${row.acgihBeiId}`,
          )
        : undefined;
      return {
        ...row,
        hasComplementaryReference: Boolean(reference),
        complementaryReferenceId: reference?.id ?? null,
        complementaryReferenceStatus: reference?.status ?? null,
      };
    });
  }

  applyFilters(
    rows: ComparisonResult[],
    filters: ComparisonFilters = {},
  ): ComparisonResult[] {
    return rows.filter((row) => {
      if (filters.comparisonStatus && row.comparisonStatus !== filters.comparisonStatus)
        return false;
      if (filters.suggestedAction && row.suggestedAction !== filters.suggestedAction)
        return false;
      if (filters.confidence) {
        const wanted = filters.confidence.toUpperCase();
        if ((row.confidence ?? 'NONE') !== wanted) return false;
      }
      if (filters.search?.trim()) {
        const search = normalizeText(filters.search);
        const haystack = normalizeText(
          `${row.substanceName} ${row.cas ?? ''} ${row.determinant ?? ''}`,
        );
        if (!haystack.includes(search)) return false;
      }
      return true;
    });
  }

  buildTotals(rows: ComparisonResult[]): ComparisonTotals {
    const count = (status: AcgihBeiComparisonStatus) =>
      rows.filter((r) => r.comparisonStatus === status).length;
    return {
      total: rows.length,
      alreadyCovered: count(AcgihBeiComparisonStatus.ALREADY_COVERED),
      divergent: count(AcgihBeiComparisonStatus.DIVERGENT),
      needsReview: count(AcgihBeiComparisonStatus.NEEDS_REVIEW),
      newCandidate: count(AcgihBeiComparisonStatus.NEW_CANDIDATE),
      lowConfidenceReview: count(AcgihBeiComparisonStatus.LOW_CONFIDENCE_REVIEW),
    };
  }

  async browse(params: {
    page: number;
    limit: number;
    filters?: ComparisonFilters;
  }): Promise<ComparisonResponse> {
    const all = await this.computeAll();
    const filtered = this.applyFilters(all, params.filters);
    // Totais refletem o conjunto filtrado, para coerência com a listagem.
    const totals = this.buildTotals(filtered);
    const skip = (params.page - 1) * params.limit;
    const data = filtered.slice(skip, skip + params.limit);
    return {
      totals,
      data,
      page: params.page,
      limit: params.limit,
      count: filtered.length,
    };
  }

  async computeForExport(
    filters?: ComparisonFilters,
  ): Promise<ComparisonResult[]> {
    const all = await this.computeAll();
    return this.applyFilters(all, filters);
  }
}
