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

  /** Indicadores biológicos NR-7 ativos. */
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
      },
      orderBy: [{ substanceName: 'asc' }],
    });
  }

  /** Regras Exame × Risco ativas com seus exames (read-only). */
  findExamRiskRules() {
    return this.prisma.pcmsoExamRiskRule.findMany({
      where: { deleted_at: null },
      select: {
        id: true,
        source: true,
        status: true,
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
