import { Injectable } from '@nestjs/common';

import { ACGIH_RISK_CORRELATION_OVERRIDES } from './acgih-risk-correlation-overrides.const';
import { AcgihRiskCorrelationRepository } from './acgih-risk-correlation.repository';
import {
  AcgihRiskCorrelationCardinality,
  AcgihRiskCorrelationDecisionSource,
  AcgihRiskCorrelationLink,
  AcgihRiskCorrelationStatus,
  applyOverride,
  classifyAuto,
  countBy,
  findOverrideForAcgih,
} from './acgih-risk-correlation.util';

export type AcgihRiskCorrelationItem = {
  acgihBeiIndicatorId: string;
  substanceName: string;
  cas: string | null;
  matrix: string | null;
  determinant: string | null;
  officialIndicatorId: string | null;
  promoted: boolean;
  alreadyLinked: boolean;
  autoStatus: AcgihRiskCorrelationStatus;
  finalStatus: AcgihRiskCorrelationStatus;
  decisionSource: AcgihRiskCorrelationDecisionSource;
  cardinality: AcgihRiskCorrelationCardinality;
  links: AcgihRiskCorrelationLink[];
  blockers: string[];
  warnings: string[];
  note: string;
};

export type AcgihRiskCorrelationSummary = {
  total: number;
  promotedCount: number;
  notPromotedCount: number;
  alreadyLinkedCount: number;
  countsByFinalStatus: Record<string, number>;
  countsByDecisionSource: Record<string, number>;
  countsByCardinality: Record<string, number>;
  blockersCount: number;
};

export type AcgihRiskCorrelationPreviewResponse = {
  summary: AcgihRiskCorrelationSummary;
  items: AcgihRiskCorrelationItem[];
};

/**
 * Frente A.1 — preview/dry-run (SOMENTE LEITURA) da correlação ACGIH/BEI ×
 * Fatores de Risco. Não cria/atualiza/remove nada. Calcula promovido/já
 * vinculado a partir do banco atual e sobrepõe os overrides manuais versionados.
 */
@Injectable()
export class AcgihRiskCorrelationService {
  constructor(private readonly repository: AcgihRiskCorrelationRepository) {}

  async preview(params?: {
    search?: string;
  }): Promise<AcgihRiskCorrelationPreviewResponse> {
    const [acgihRows, risks, nr7, promotionByAcgihId, targetResolutions] =
      await Promise.all([
        this.repository.findAllAcgihIndicators(),
        this.repository.findSystemQuiRiskFactors(),
        this.repository.findNr7IndicatorsWithRiskLinks(),
        this.repository.findPromotionStateByAcgihId(),
        this.repository.resolveOverrideTargets(
          Array.from(
            new Set(
              ACGIH_RISK_CORRELATION_OVERRIDES.flatMap((o) =>
                o.targets.map((t) => t.riskFactorId),
              ),
            ),
          ),
        ),
      ]);

    const search = params?.search?.trim().toLowerCase();

    const items: AcgihRiskCorrelationItem[] = acgihRows
      .filter((row) => {
        if (!search) return true;
        return (
          `${row.substanceName} ${row.cas ?? ''} ${row.determinant ?? ''}`
            .toLowerCase()
            .includes(search)
        );
      })
      .map((acgih) => {
        const promotion =
          promotionByAcgihId.get(acgih.id) ?? {
            officialId: null,
            linkedRisks: [],
          };

        const auto = classifyAuto({ acgih, risks, nr7, promotion });
        const override = findOverrideForAcgih(acgih);
        const final = applyOverride({ auto, override, targetResolutions });

        return {
          acgihBeiIndicatorId: acgih.id,
          substanceName: acgih.substanceName,
          cas: acgih.cas,
          matrix: acgih.biologicalMatrix,
          determinant: acgih.determinant,
          officialIndicatorId: promotion.officialId,
          promoted: !!promotion.officialId,
          alreadyLinked:
            !!promotion.officialId && promotion.linkedRisks.length > 0,
          autoStatus: auto.status,
          finalStatus: final.finalStatus,
          decisionSource: final.decisionSource,
          cardinality: final.cardinality,
          links: final.links,
          blockers: final.blockers,
          warnings: final.warnings,
          note: final.note,
        };
      });

    return { summary: this.buildSummary(items), items };
  }

  private buildSummary(
    items: AcgihRiskCorrelationItem[],
  ): AcgihRiskCorrelationSummary {
    return {
      total: items.length,
      promotedCount: items.filter((i) => i.promoted).length,
      notPromotedCount: items.filter((i) => !i.promoted).length,
      alreadyLinkedCount: items.filter((i) => i.alreadyLinked).length,
      countsByFinalStatus: countBy(items.map((i) => i.finalStatus)),
      countsByDecisionSource: countBy(items.map((i) => i.decisionSource)),
      countsByCardinality: countBy(items.map((i) => i.cardinality)),
      blockersCount: items.reduce((acc, i) => acc + i.blockers.length, 0),
    };
  }
}
