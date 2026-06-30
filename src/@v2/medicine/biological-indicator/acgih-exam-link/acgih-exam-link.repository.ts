import { Injectable } from '@nestjs/common';
import {
  BiologicalIndicatorMatchConfidenceEnum,
  BiologicalIndicatorMatchMethodEnum,
  BiologicalNormativeSourceEnum,
} from '@prisma/client';

import { PrismaService } from '@/prisma/prisma.service';
import { simpleCompanyId } from '@/shared/constants/ids';

import {
  AcgihExamCatalogEntry,
  Nr7ExamLinkSnapshot,
} from './acgih-exam-link.util';

export type AcgihOfficialIndicatorRow = {
  id: string;
  substanceName: string;
  biologicalIndicatorOriginal: string;
  biologicalIndicatorNormalized: string;
  biologicalMatrix: string;
  casPrimary: string | null;
  examLinks: Array<{ examId: number; deleted_at: Date | null }>;
};

/**
 * Repositório do vínculo ACGIH/BEI → Exame. Leitura dos indicadores oficiais
 * ACGIH, catálogo sistêmico e vínculos NR-7 (para reuso). Escrita SOMENTE em
 * BiologicalIndicatorToExam.
 */
@Injectable()
export class AcgihExamLinkRepository {
  constructor(private readonly prisma: PrismaService) {}

  /** Indicadores oficiais ACGIH/BEI com seus vínculos de exame ativos. */
  async findAcgihOfficialIndicators(): Promise<AcgihOfficialIndicatorRow[]> {
    const rows = await this.prisma.occupationalBiologicalIndicator.findMany({
      where: {
        deleted_at: null,
        normativeSource: BiologicalNormativeSourceEnum.ACGIH_BEI,
      },
      select: {
        id: true,
        substanceName: true,
        biologicalIndicatorOriginal: true,
        biologicalIndicatorNormalized: true,
        biologicalMatrix: true,
        casPrimary: true,
        examLinks: {
          where: { deleted_at: null },
          select: { examId: true, deleted_at: true },
        },
      },
      orderBy: [{ substanceName: 'asc' }, { id: 'asc' }],
    });
    return rows;
  }

  /** Catálogo sistêmico SimpleSST (exames system + companyId SimpleSST). */
  async findSystemicCatalog(): Promise<AcgihExamCatalogEntry[]> {
    const rows = await this.prisma.exam.findMany({
      where: { deleted_at: null, system: true, companyId: simpleCompanyId },
      select: { id: true, name: true, material: true, esocial27Code: true },
      orderBy: { name: 'asc' },
    });
    return rows;
  }

  /**
   * Vínculos NR-7 → exame já confirmados (para reaproveitamento por
   * determinante). Apenas exames sistêmicos e links confirmados não removidos.
   */
  async findNr7ConfirmedExamLinks(): Promise<Nr7ExamLinkSnapshot[]> {
    const rows = await this.prisma.biologicalIndicatorToExam.findMany({
      where: {
        deleted_at: null,
        isConfirmed: true,
        indicator: {
          deleted_at: null,
          normativeSource: BiologicalNormativeSourceEnum.NR_07,
        },
        exam: { deleted_at: null, system: true, companyId: simpleCompanyId },
      },
      select: {
        examId: true,
        examNameSnapshot: true,
        exam: { select: { id: true, name: true, material: true } },
        indicator: {
          select: {
            biologicalIndicatorNormalized: true,
            biologicalMatrix: true,
          },
        },
      },
    });

    return rows.map((r) => ({
      determinantNormalized: r.indicator.biologicalIndicatorNormalized,
      matrix: r.indicator.biologicalMatrix,
      examId: r.examId,
      examName: r.exam?.name ?? r.examNameSnapshot ?? '',
      examMaterial: r.exam?.material ?? null,
    }));
  }

  /** Vínculo indicador→exame ativo já existente (idempotência). */
  findExistingLink(indicatorId: string, examId: number) {
    return this.prisma.biologicalIndicatorToExam.findUnique({
      where: { indicatorId_examId: { indicatorId, examId } },
      select: {
        id: true,
        deleted_at: true,
        isConfirmed: true,
        isDefault: true,
      },
    });
  }

  /**
   * Cria/restaura o vínculo indicador→exame. Marca outros vínculos default do
   * mesmo indicador como não-default (mantém um único default). Não toca em
   * NR-7, RiskFactor, regra da Biblioteca nem empresa.
   */
  createExamLink(params: {
    indicatorId: string;
    examId: number;
    matchMethod: BiologicalIndicatorMatchMethodEnum;
    matchConfidence: BiologicalIndicatorMatchConfidenceEnum;
    isConfirmed: boolean;
    requiresReview: boolean;
    examNameSnapshot: string;
    examMaterialSnapshot: string | null;
    notes: string;
    userId: number;
  }) {
    const confirmedAt = params.isConfirmed ? new Date() : null;
    const confirmedById = params.isConfirmed ? params.userId : null;

    return this.prisma.$transaction(async (tx) => {
      await tx.biologicalIndicatorToExam.updateMany({
        where: {
          indicatorId: params.indicatorId,
          deleted_at: null,
          examId: { not: params.examId },
        },
        data: { isDefault: false },
      });

      return tx.biologicalIndicatorToExam.upsert({
        where: {
          indicatorId_examId: {
            indicatorId: params.indicatorId,
            examId: params.examId,
          },
        },
        create: {
          indicatorId: params.indicatorId,
          examId: params.examId,
          matchConfidence: params.matchConfidence,
          matchMethod: params.matchMethod,
          requiresReview: params.requiresReview,
          isConfirmed: params.isConfirmed,
          isDefault: true,
          confirmedAt,
          confirmedById,
          examNameSnapshot: params.examNameSnapshot,
          examMaterialSnapshot: params.examMaterialSnapshot,
          notes: params.notes,
        },
        update: {
          deleted_at: null,
          matchConfidence: params.matchConfidence,
          matchMethod: params.matchMethod,
          requiresReview: params.requiresReview,
          isConfirmed: params.isConfirmed,
          isDefault: true,
          confirmedAt,
          confirmedById,
          examNameSnapshot: params.examNameSnapshot,
          examMaterialSnapshot: params.examMaterialSnapshot,
          notes: params.notes,
        },
        select: { id: true },
      });
    });
  }
}
