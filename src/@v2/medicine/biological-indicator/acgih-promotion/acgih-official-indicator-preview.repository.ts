import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

/**
 * 4P.1B — repositório SOMENTE LEITURA do preview de promoção ACGIH/BEI.
 * Não possui nenhum método de escrita. Não cria/atualiza/remove dados.
 */
@Injectable()
export class AcgihOfficialIndicatorPreviewRepository {
  constructor(private readonly prisma: PrismaService) {}

  /** Enriquecimento dos itens ACGIH/BEI (campos não presentes na linha). */
  findAcgihIndicatorsByIds(ids: string[]) {
    if (!ids.length) return Promise.resolve([]);
    return this.prisma.pcmsoAcgihBeiIndicator.findMany({
      where: { id: { in: ids }, deleted_at: null },
      select: {
        id: true,
        notation: true,
        referenceYear: true,
        sourceYear: true,
        sourcePage: true,
        substanceNameNormalized: true,
      },
    });
  }

  /**
   * Indicadores oficiais ativos para checagem de duplicidade/proveniência.
   * Read-only. Inclui NR-7 e ACGIH/BEI para near-duplicate e ALREADY_PROMOTED.
   */
  findOfficialIndicatorsForDedupe() {
    return this.prisma.occupationalBiologicalIndicator.findMany({
      where: { deleted_at: null },
      select: {
        id: true,
        normativeSource: true,
        acgihBeiIndicatorId: true,
        substanceNameNormalized: true,
        casPrimary: true,
        biologicalIndicatorNormalized: true,
        biologicalMatrix: true,
        collectionMoment: true,
      },
    });
  }
}
