import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '@/prisma/prisma.service';

/**
 * Repositório da camada de DECISÃO técnica da comparação (4O.1). Escreve apenas
 * na tabela aditiva PcmsoAcgihBeiComparisonReview. Não toca nenhuma outra base.
 */
@Injectable()
export class ComparisonReviewRepository {
  constructor(private readonly prisma: PrismaService) {}

  /** Busca a decisão (incluindo soft-deleted) pela chave estável da linha. */
  findRawByAcgihId(acgihBeiIndicatorId: string) {
    return this.prisma.pcmsoAcgihBeiComparisonReview.findUnique({
      where: { acgihBeiIndicatorId },
    });
  }

  create(data: Prisma.PcmsoAcgihBeiComparisonReviewCreateInput) {
    return this.prisma.pcmsoAcgihBeiComparisonReview.create({ data });
  }

  update(
    id: string,
    data: Prisma.PcmsoAcgihBeiComparisonReviewUpdateInput,
  ) {
    return this.prisma.pcmsoAcgihBeiComparisonReview.update({
      where: { id },
      data,
    });
  }
}
