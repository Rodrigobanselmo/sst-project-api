import { Injectable } from '@nestjs/common';

import {
  BiologicalNormativeSourceEnum,
  RiskFactorsEnum,
  StatusEnum,
} from '@prisma/client';

import { PrismaService } from '@/prisma/prisma.service';

import {
  AcgihIndicatorSnapshot,
  AcgihPromotionSnapshot,
  Nr7IndicatorSnapshot,
  OverrideTargetResolution,
  RiskFactorSnapshot,
} from './acgih-risk-correlation.util';

/**
 * Frente A.1 — repositório SOMENTE LEITURA da correlação ACGIH/BEI × Fatores de
 * Risco. Não possui método de escrita. Reflete o banco atual do ambiente em que
 * roda (promovido/já vinculado lidos ao vivo, sem snapshot).
 */
@Injectable()
export class AcgihRiskCorrelationRepository {
  constructor(private readonly prisma: PrismaService) {}

  /** Todos os itens ACGIH/BEI (staging) ativos — os "65". */
  async findAllAcgihIndicators(): Promise<AcgihIndicatorSnapshot[]> {
    const rows = await this.prisma.pcmsoAcgihBeiIndicator.findMany({
      where: { deleted_at: null },
      select: {
        id: true,
        substanceName: true,
        substanceNameNormalized: true,
        cas: true,
        determinant: true,
        biologicalMatrix: true,
      },
      orderBy: [{ substanceName: 'asc' }, { id: 'asc' }],
    });
    return rows.map((r) => ({
      id: r.id,
      substanceName: r.substanceName,
      substanceNameNormalized: r.substanceNameNormalized ?? null,
      cas: r.cas ?? null,
      determinant: r.determinant ?? null,
      biologicalMatrix: r.biologicalMatrix ?? null,
    }));
  }

  /** Fatores de risco do sistema, químicos e ativos. */
  async findSystemQuiRiskFactors(): Promise<RiskFactorSnapshot[]> {
    const rows = await this.prisma.riskFactors.findMany({
      where: {
        system: true,
        deleted_at: null,
        status: StatusEnum.ACTIVE,
        type: RiskFactorsEnum.QUI,
      },
      select: { id: true, name: true, cas: true, synonymous: true },
    });
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      cas: r.cas ?? null,
      synonymous: r.synonymous ?? [],
    }));
  }

  /** Indicadores oficiais NR-7 com seus vínculos de risco ativos (para reuso). */
  async findNr7IndicatorsWithRiskLinks(): Promise<Nr7IndicatorSnapshot[]> {
    const rows = await this.prisma.occupationalBiologicalIndicator.findMany({
      where: {
        deleted_at: null,
        normativeSource: BiologicalNormativeSourceEnum.NR_07,
      },
      select: {
        substanceName: true,
        casNumbers: true,
        riskLinks: {
          where: { deleted_at: null },
          select: {
            riskFactorId: true,
            riskNameSnapshot: true,
            riskCasSnapshot: true,
            riskFactor: { select: { name: true, cas: true } },
          },
        },
      },
    });
    return rows.map((r) => ({
      substanceName: r.substanceName,
      casNumbers: r.casNumbers ?? [],
      riskLinks: r.riskLinks.map((l) => ({
        riskFactorId: l.riskFactorId,
        riskName: l.riskFactor?.name ?? l.riskNameSnapshot ?? '',
        riskCasRaw: l.riskFactor?.cas ?? l.riskCasSnapshot ?? null,
      })),
    }));
  }

  /**
   * Mapa acgihBeiIndicatorId → estado de promoção/vínculo no banco atual.
   * Considera indicadores oficiais promovidos a partir de itens ACGIH/BEI.
   */
  async findPromotionStateByAcgihId(): Promise<Map<string, AcgihPromotionSnapshot>> {
    const rows = await this.prisma.occupationalBiologicalIndicator.findMany({
      where: {
        deleted_at: null,
        acgihBeiIndicatorId: { not: null },
      },
      select: {
        id: true,
        acgihBeiIndicatorId: true,
        riskLinks: {
          where: { deleted_at: null },
          select: {
            riskFactorId: true,
            riskNameSnapshot: true,
            riskCasSnapshot: true,
            riskFactor: { select: { name: true, cas: true } },
          },
        },
      },
    });

    const map = new Map<string, AcgihPromotionSnapshot>();
    for (const r of rows) {
      if (!r.acgihBeiIndicatorId) continue;
      map.set(r.acgihBeiIndicatorId, {
        officialId: r.id,
        linkedRisks: r.riskLinks.map((l) => ({
          riskFactorId: l.riskFactorId,
          riskName: l.riskFactor?.name ?? l.riskNameSnapshot ?? '',
          riskCasRaw: l.riskFactor?.cas ?? l.riskCasSnapshot ?? null,
        })),
      });
    }
    return map;
  }

  /** Resolução por id dos RiskFactors alvo de override (validação). */
  async resolveOverrideTargets(
    ids: string[],
  ): Promise<Map<string, OverrideTargetResolution>> {
    const map = new Map<string, OverrideTargetResolution>();
    if (!ids.length) return map;

    const rows = await this.prisma.riskFactors.findMany({
      where: { id: { in: ids } },
      select: {
        id: true,
        name: true,
        cas: true,
        system: true,
        deleted_at: true,
      },
    });

    const found = new Map(rows.map((r) => [r.id, r]));
    for (const id of ids) {
      const r = found.get(id);
      map.set(id, {
        riskFactorId: id,
        exists: !!r,
        isSystem: r?.system ?? false,
        isDeleted: !!r?.deleted_at,
        name: r?.name ?? null,
        cas: r?.cas ?? null,
      });
    }
    return map;
  }
}
