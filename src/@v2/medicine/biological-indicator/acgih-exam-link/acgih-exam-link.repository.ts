import { Injectable } from '@nestjs/common';
import {
  BiologicalIndicatorMatchConfidenceEnum,
  BiologicalIndicatorMatchMethodEnum,
  BiologicalNormativeSourceEnum,
  ExamTypeEnum,
  StatusEnum,
} from '@prisma/client';

import { PrismaService } from '@/prisma/prisma.service';
import { simpleCompanyId } from '@/shared/constants/ids';

import {
  AcgihExamCatalogEntry,
  Nr7ExamLinkSnapshot,
} from './acgih-exam-link.util';

export type AcgihOfficialIndicatorRow = {
  id: string;
  acgihBeiIndicatorId: string | null;
  substanceName: string;
  biologicalIndicatorOriginal: string;
  biologicalIndicatorNormalized: string;
  biologicalMatrix: string;
  casPrimary: string | null;
  examLinks: Array<{
    id: string;
    examId: number;
    deleted_at: Date | null;
    examName: string | null;
    examMaterial: string | null;
    examDeleted: boolean;
    examActive: boolean;
    isConfirmed: boolean;
    requiresReview: boolean;
    notes: string | null;
  }>;
  riskLinks: Array<{
    riskFactorId: string;
    riskName: string | null;
  }>;
};

/**
 * Repositório do vínculo ACGIH/BEI → Exame. Leitura dos indicadores oficiais
 * ACGIH, catálogo sistêmico e vínculos NR-7 (para reuso). Escrita SOMENTE em
 * BiologicalIndicatorToExam.
 */
@Injectable()
export class AcgihExamLinkRepository {
  constructor(private readonly prisma: PrismaService) {}

  /** Indicadores oficiais ACGIH/BEI com seus vínculos de exame e de risco. */
  async findAcgihOfficialIndicators(): Promise<AcgihOfficialIndicatorRow[]> {
    const rows = await this.prisma.occupationalBiologicalIndicator.findMany({
      where: {
        deleted_at: null,
        normativeSource: BiologicalNormativeSourceEnum.ACGIH_BEI,
      },
      select: {
        id: true,
        acgihBeiIndicatorId: true,
        substanceName: true,
        biologicalIndicatorOriginal: true,
        biologicalIndicatorNormalized: true,
        biologicalMatrix: true,
        casPrimary: true,
        examLinks: {
          where: { deleted_at: null },
          select: {
            id: true,
            examId: true,
            deleted_at: true,
            isConfirmed: true,
            requiresReview: true,
            notes: true,
            examNameSnapshot: true,
            examMaterialSnapshot: true,
            exam: {
              select: {
                name: true,
                material: true,
                deleted_at: true,
                status: true,
              },
            },
          },
        },
        riskLinks: {
          where: { deleted_at: null },
          select: {
            riskFactorId: true,
            riskNameSnapshot: true,
            riskFactor: { select: { name: true } },
          },
        },
      },
      orderBy: [{ substanceName: 'asc' }, { id: 'asc' }],
    });

    return rows.map((row) => ({
      id: row.id,
      acgihBeiIndicatorId: row.acgihBeiIndicatorId,
      substanceName: row.substanceName,
      biologicalIndicatorOriginal: row.biologicalIndicatorOriginal,
      biologicalIndicatorNormalized: row.biologicalIndicatorNormalized,
      biologicalMatrix: row.biologicalMatrix,
      casPrimary: row.casPrimary,
      examLinks: row.examLinks.map((link) => ({
        id: link.id,
        examId: link.examId,
        deleted_at: link.deleted_at,
        examName: link.exam?.name ?? link.examNameSnapshot ?? null,
        examMaterial:
          link.exam?.material ?? link.examMaterialSnapshot ?? null,
        examDeleted: !!link.exam?.deleted_at,
        examActive: link.exam?.status === StatusEnum.ACTIVE,
        isConfirmed: link.isConfirmed,
        requiresReview: link.requiresReview,
        notes: link.notes,
      })),
      riskLinks: row.riskLinks.map((link) => ({
        riskFactorId: link.riskFactorId,
        riskName: link.riskFactor?.name ?? link.riskNameSnapshot ?? null,
      })),
    }));
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

  /**
   * Cria um exame sistêmico SimpleSST a partir do indicador ACGIH/BEI. Sem
   * origem dedicada no schema → usa system=true/companyId=SimpleSST e registra a
   * proveniência ACGIH/BEI em `obsProc` (rastreável, sem migration).
   */
  async createSystemExam(params: {
    name: string;
    material: string | null;
    obsProc: string;
  }): Promise<AcgihExamCatalogEntry> {
    const created = await this.prisma.exam.create({
      data: {
        name: params.name,
        companyId: simpleCompanyId,
        material: params.material,
        analyses: params.name,
        type: ExamTypeEnum.LAB,
        system: true,
        isAttendance: false,
        isAvaliation: false,
        status: StatusEnum.ACTIVE,
        obsProc: params.obsProc,
      },
      select: { id: true, name: true, material: true, esocial27Code: true },
    });
    return created;
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

  /** Confirma vínculo pendente (somente BiologicalIndicatorToExam). */
  confirmPendingExamLink(params: {
    indicatorId: string;
    examId: number;
    userId: number;
    notes: string;
  }) {
    return this.prisma.biologicalIndicatorToExam.update({
      where: {
        indicatorId_examId: {
          indicatorId: params.indicatorId,
          examId: params.examId,
        },
      },
      data: {
        isConfirmed: true,
        requiresReview: false,
        confirmedAt: new Date(),
        confirmedById: params.userId,
        notes: params.notes,
      },
      select: { id: true },
    });
  }
}
