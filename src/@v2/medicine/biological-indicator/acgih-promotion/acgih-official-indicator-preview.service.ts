import { Injectable } from '@nestjs/common';

import { PcmsoAcgihBeiComparisonDecisionEnum } from '@prisma/client';

import {
  AcgihBeiComparisonStatus,
  AcgihBeiOperationalStatus,
  ComparisonResult,
  normalizeText,
} from '../../acgih-bei-comparison/acgih-bei-comparison.util';
import { AcgihBeiComparisonService } from '../../acgih-bei-comparison/acgih-bei-comparison.service';
import { buildProposedOfficialPayload } from './acgih-official-indicator-preview.mapper';
import { AcgihOfficialIndicatorPreviewRepository } from './acgih-official-indicator-preview.repository';
import {
  AcgihPromotionEligibilityStatus,
  AcgihPromotionEligibilityTier,
  AcgihPromotionPreviewItem,
  AcgihSourceEnrichment,
  buildOfficialDedupeKey,
  DedupeContext,
  evaluateCandidate,
  mapCollectionMoment,
} from './acgih-official-indicator-preview.util';

export type AcgihPromotionPreviewParams = {
  includeDivergenceDerived?: boolean;
  search?: string;
  page?: number;
  limit?: number;
};

export type AcgihPromotionPreviewTotals = {
  total: number;
  eligible: number;
  warning: number;
  blocked: number;
  primary: number;
  divergenceDerived: number;
};

export type AcgihPromotionPreviewResponse = {
  totals: AcgihPromotionPreviewTotals;
  data: AcgihPromotionPreviewItem[];
  page: number;
  limit: number;
  count: number;
};

/**
 * 4P.1B — preview/dry-run (SOMENTE LEITURA) de candidatos ACGIH/BEI à promoção
 * para indicador oficial. NÃO cria/atualiza/remove dados. Reutiliza a mesma
 * lógica de comparação/review/status operacional (AcgihBeiComparisonService).
 */
@Injectable()
export class AcgihOfficialIndicatorPreviewService {
  constructor(
    private readonly comparisonService: AcgihBeiComparisonService,
    private readonly repository: AcgihOfficialIndicatorPreviewRepository,
  ) {}

  /**
   * Decide se a linha entra no preview e com qual tier. Espelha exatamente a
   * regra de elegibilidade da 4P.1B; não duplica a lógica de comparação.
   */
  private resolveInclusionTier(
    row: ComparisonResult,
    includeDivergenceDerived: boolean,
  ): AcgihPromotionEligibilityTier | null {
    const decision = row.review?.decision ?? null;
    const isFresh = !!row.review && row.review.isStale !== true;
    const operational = row.operationalStatus ?? null;

    // PRIMARY: candidato ACGIH confirmado sem correspondência.
    if (
      isFresh &&
      decision === PcmsoAcgihBeiComparisonDecisionEnum.NO_MATCH_CONFIRMED &&
      operational === AcgihBeiOperationalStatus.ACGIH_CANDIDATE_CONFIRMED
    ) {
      return AcgihPromotionEligibilityTier.PRIMARY;
    }

    // DIVERGENCE_DERIVED: somente com flag explícita.
    if (
      includeDivergenceDerived &&
      isFresh &&
      decision === PcmsoAcgihBeiComparisonDecisionEnum.REAL_DIVERGENCE &&
      row.comparisonStatus === AcgihBeiComparisonStatus.DIVERGENT &&
      operational === AcgihBeiOperationalStatus.REAL_DIVERGENCE
    ) {
      return AcgihPromotionEligibilityTier.DIVERGENCE_DERIVED;
    }

    return null;
  }

  private matchesSearch(row: ComparisonResult, search?: string): boolean {
    if (!search?.trim()) return true;
    const needle = normalizeText(search);
    const haystack = normalizeText(
      `${row.substanceName} ${row.cas ?? ''} ${row.determinant ?? ''}`,
    );
    return haystack.includes(needle);
  }

  /**
   * Avalia TODOS os candidatos (sem paginação). Base compartilhada entre o
   * preview (4P.1B) e o apply (4P.2A) — garante a mesma regra de elegibilidade
   * autoritativa no servidor. Somente leitura.
   */
  async computeEvaluatedItems(params: {
    includeDivergenceDerived?: boolean;
    search?: string;
  }): Promise<AcgihPromotionPreviewItem[]> {
    const includeDivergenceDerived = params.includeDivergenceDerived ?? false;

    const rows = await this.comparisonService.computeAll();

    // 1) Inclusão por elegibilidade + tier, depois filtro de busca.
    const candidates: {
      row: ComparisonResult;
      tier: AcgihPromotionEligibilityTier;
    }[] = [];
    for (const row of rows) {
      const tier = this.resolveInclusionTier(row, includeDivergenceDerived);
      if (!tier) continue;
      if (!this.matchesSearch(row, params.search)) continue;
      candidates.push({ row, tier });
    }

    // 2) Enriquecimento (read-only) + contexto de duplicidade (read-only).
    const ids = candidates.map((c) => c.row.acgihBeiId);
    const [acgihRecords, officials] = await Promise.all([
      this.repository.findAcgihIndicatorsByIds(ids),
      this.repository.findOfficialIndicatorsForDedupe(),
    ]);

    const enrichmentById = new Map<string, AcgihSourceEnrichment>(
      acgihRecords.map((r) => [
        r.id,
        {
          notation: r.notation ?? null,
          referenceYear: r.referenceYear ?? null,
          sourceYear: r.sourceYear ?? null,
          sourcePage: r.sourcePage ?? null,
          substanceNameNormalized: r.substanceNameNormalized ?? null,
        },
      ]),
    );

    const dedupe = this.buildDedupeContext(officials);

    // 3) Avaliação pura de cada candidato.
    return candidates.map(({ row, tier }) => {
      const enrichment = enrichmentById.get(row.acgihBeiId) ?? null;
      const mappedMoment = mapCollectionMoment(row.samplingTime);
      const proposedOfficialPayload = buildProposedOfficialPayload({
        row,
        enrichment,
        mappedMoment,
      });
      return evaluateCandidate({
        row,
        tier,
        enrichment,
        dedupe,
        proposedOfficialPayload,
        mappedMoment,
      });
    });
  }

  async preview(
    params: AcgihPromotionPreviewParams,
  ): Promise<AcgihPromotionPreviewResponse> {
    const page = params.page ?? 1;
    const limit = params.limit ?? 20;

    const items = await this.computeEvaluatedItems({
      includeDivergenceDerived: params.includeDivergenceDerived,
      search: params.search,
    });

    // Totais sobre o conjunto completo (antes da paginação).
    const totals = this.buildTotals(items);

    const skip = (page - 1) * limit;
    const data = items.slice(skip, skip + limit);

    return { totals, data, page, limit, count: items.length };
  }

  private buildDedupeContext(
    officials: {
      normativeSource: string;
      acgihBeiIndicatorId: string | null;
      substanceNameNormalized: string | null;
      casPrimary: string | null;
      biologicalIndicatorNormalized: string | null;
      biologicalMatrix: string | null;
      collectionMoment: string | null;
    }[],
  ): DedupeContext {
    const promotedAcgihIds = new Set<string>();
    const nr7Keys = new Set<string>();
    const officialAcgihKeys = new Set<string>();

    for (const official of officials) {
      if (official.acgihBeiIndicatorId) {
        promotedAcgihIds.add(official.acgihBeiIndicatorId);
      }
      const key = buildOfficialDedupeKey(official);
      if (official.normativeSource === 'NR_07') {
        nr7Keys.add(key);
      } else if (official.normativeSource === 'ACGIH_BEI') {
        officialAcgihKeys.add(key);
      }
    }

    return { promotedAcgihIds, nr7Keys, officialAcgihKeys };
  }

  private buildTotals(
    items: AcgihPromotionPreviewItem[],
  ): AcgihPromotionPreviewTotals {
    return {
      total: items.length,
      eligible: items.filter(
        (i) => i.eligibilityStatus === AcgihPromotionEligibilityStatus.ELIGIBLE,
      ).length,
      warning: items.filter(
        (i) => i.eligibilityStatus === AcgihPromotionEligibilityStatus.WARNING,
      ).length,
      blocked: items.filter(
        (i) => i.eligibilityStatus === AcgihPromotionEligibilityStatus.BLOCKED,
      ).length,
      primary: items.filter(
        (i) => i.eligibilityTier === AcgihPromotionEligibilityTier.PRIMARY,
      ).length,
      divergenceDerived: items.filter(
        (i) =>
          i.eligibilityTier ===
          AcgihPromotionEligibilityTier.DIVERGENCE_DERIVED,
      ).length,
    };
  }
}
