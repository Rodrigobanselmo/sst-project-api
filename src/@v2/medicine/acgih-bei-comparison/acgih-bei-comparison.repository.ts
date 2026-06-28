import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

/**
 * Repositório SOMENTE LEITURA para a comparação ACGIH/BEI × NR-7 × Regras.
 * Não possui nenhum método de escrita. Não toca em nenhuma das bases.
 */
@Injectable()
export class AcgihBeiComparisonRepository {
  constructor(private readonly prisma: PrismaService) {}

  /** Indicadores ACGIH/BEI ativos (base curável da Fase 4D). */
  findAcgihBeiIndicators() {
    return this.prisma.pcmsoAcgihBeiIndicator.findMany({
      where: { deleted_at: null },
      orderBy: [{ substanceName: 'asc' }, { determinant: 'asc' }],
    });
  }

  /** Indicadores biológicos NR-7 ativos.
   * 4L.1a: inclui status e os vínculos confirmados para reaproveitar a lógica
   * de pendências de ativação (getActivationPendencies) sem N+1. */
  findNr07Indicators() {
    return this.prisma.occupationalBiologicalIndicator.findMany({
      where: { deleted_at: null, normativeSource: 'NR_07' },
      select: {
        id: true,
        substanceName: true,
        substanceNameNormalized: true,
        casPrimary: true,
        casNumbers: true,
        biologicalIndicatorNormalized: true,
        biologicalIndicatorOriginal: true,
        biologicalMatrix: true,
        collectionMoment: true,
        referenceValue: true,
        unit: true,
        status: true,
        deleted_at: true,
        requiresNormativeReview: true,
        reviewedAt: true,
        riskLinks: {
          select: { deleted_at: true, isConfirmed: true, isPrimary: true },
        },
        examLinks: {
          select: { deleted_at: true, isConfirmed: true, isDefault: true },
        },
      },
      orderBy: [{ substanceName: 'asc' }],
    });
  }

  /**
   * Fontes complementares ACGIH/BEI ativas (4I), para refletir o vínculo já
   * registrado na comparação. Read-only; não altera nenhuma base.
   */
  findActiveAcgihReferences() {
    return this.prisma.pcmsoExamRiskRuleReference.findMany({
      where: {
        deleted_at: null,
        status: 'ACTIVE',
        sourceType: 'ACGIH_BEI',
        acgihBeiIndicatorId: { not: null },
      },
      select: {
        id: true,
        ruleId: true,
        acgihBeiIndicatorId: true,
        status: true,
      },
    });
  }

  /**
   * Decisões técnicas de curadoria ativas (4O.1), para anexar à comparação.
   * Read-only; não altera nenhuma base. Inclui o nome do revisor (sem PII de
   * empresas/trabalhadores) para exibição.
   */
  findActiveComparisonReviews() {
    return this.prisma.pcmsoAcgihBeiComparisonReview.findMany({
      where: { deleted_at: null },
      select: {
        id: true,
        acgihBeiIndicatorId: true,
        decision: true,
        technicalNote: true,
        comparisonStatusSnapshot: true,
        suggestedActionSnapshot: true,
        reviewedById: true,
        updated_at: true,
      },
    });
  }

  /** Nomes dos revisores (sem dados sensíveis), para exibir "quem registrou". */
  async findReviewerNames(ids: number[]) {
    if (!ids.length) return new Map<number, string>();
    const users = await this.prisma.user.findMany({
      where: { id: { in: ids } },
      select: { id: true, name: true },
    });
    return new Map(users.map((u) => [u.id, u.name]));
  }

  /** Regras Exame × Risco ativas com seus exames (read-only). */
  findExamRiskRules() {
    return this.prisma.pcmsoExamRiskRule.findMany({
      where: { deleted_at: null },
      select: {
        id: true,
        source: true,
        status: true,
        isCurated: true,
        agentCas: true,
        agentName: true,
        agentNameNormalized: true,
        sourceIndicatorId: true,
        exams: {
          where: { deleted_at: null },
          select: { examNameSnapshot: true },
        },
      },
    });
  }
}
