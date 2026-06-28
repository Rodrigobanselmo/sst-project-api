import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  BiologicalIndicatorMatchConfidenceEnum,
  BiologicalIndicatorMatchMethodEnum,
  BiologicalIndicatorStatusEnum,
} from '@prisma/client';

import { PrismaService } from '@/prisma/prisma.service';
import { simpleCompanyId } from '@/shared/constants/ids';

import { buildExamCatalogWhere } from '../biological-indicator-exam-provision.util';

import { BiologicalIndicatorDAO } from '../database/dao/biological-indicator.dao';
import { getActivationPendencies } from './biological-indicator-activation.validator';

@Injectable()
export class BiologicalIndicatorCurationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly biologicalIndicatorDAO: BiologicalIndicatorDAO,
  ) {}

  browse(params: Parameters<BiologicalIndicatorDAO['browse']>[0]) {
    return this.biologicalIndicatorDAO.browse(params);
  }

  async getById(id: string) {
    const indicator = await this.biologicalIndicatorDAO.findById(id);
    if (!indicator) {
      throw new NotFoundException('Indicador biológico não encontrado.');
    }
    return indicator;
  }

  async getPendencies(indicatorId: string) {
    const indicator = await this.getById(indicatorId);
    return {
      indicatorId,
      pendencies: indicator.pendencies,
      canActivate: indicator.pendencies.length === 0,
    };
  }

  async listRiskLinks(indicatorId: string) {
    await this.ensureIndicatorExists(indicatorId);
    return this.prisma.biologicalIndicatorToRisk.findMany({
      where: { indicatorId, deleted_at: null },
      include: {
        riskFactor: {
          select: { id: true, name: true, cas: true, type: true, system: true },
        },
        confirmedBy: { select: { id: true, name: true, email: true } },
      },
      orderBy: [{ isPrimary: 'desc' }, { isConfirmed: 'desc' }, { created_at: 'asc' }],
    });
  }

  async listExamLinks(indicatorId: string) {
    await this.ensureIndicatorExists(indicatorId);
    return this.prisma.biologicalIndicatorToExam.findMany({
      where: { indicatorId, deleted_at: null },
      include: {
        exam: {
          select: {
            id: true,
            name: true,
            material: true,
            analyses: true,
            instruction: true,
            type: true,
            system: true,
            esocial27Code: true,
          },
        },
        confirmedBy: { select: { id: true, name: true, email: true } },
      },
      orderBy: [{ isDefault: 'desc' }, { isConfirmed: 'desc' }, { created_at: 'asc' }],
    });
  }

  async searchExamCandidates(params: { search?: string; material?: string; limit?: number }) {
    const search = params.search?.trim();
    const material = params.material?.trim();
    const limit = params.limit ?? 30;

    const where = {
      ...buildExamCatalogWhere(simpleCompanyId),
      AND: [
        search
          ? {
              OR: [
                { name: { contains: search, mode: 'insensitive' as const } },
                { analyses: { contains: search, mode: 'insensitive' as const } },
                { material: { contains: search, mode: 'insensitive' as const } },
                { instruction: { contains: search, mode: 'insensitive' as const } },
              ],
            }
          : {},
        material
          ? { material: { contains: material, mode: 'insensitive' as const } }
          : {},
      ],
    };

    return this.prisma.exam.findMany({
      where,
      take: limit,
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        material: true,
        analyses: true,
        instruction: true,
        type: true,
        system: true,
        esocial27Code: true,
      },
    });
  }

  async confirmRiskLink(linkId: string, userId: number, notes?: string) {
    const link = await this.getActiveRiskLink(linkId);

    return this.prisma.biologicalIndicatorToRisk.update({
      where: { id: link.id },
      data: {
        isConfirmed: true,
        confirmedById: userId,
        confirmedAt: new Date(),
        notes: notes ?? link.notes,
        deleted_at: null,
      },
      include: {
        riskFactor: { select: { id: true, name: true, cas: true } },
        confirmedBy: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async rejectRiskLink(linkId: string, userId: number, notes?: string) {
    const link = await this.getActiveRiskLink(linkId);

    return this.prisma.biologicalIndicatorToRisk.update({
      where: { id: link.id },
      data: {
        isConfirmed: false,
        isPrimary: false,
        confirmedById: userId,
        confirmedAt: new Date(),
        notes: notes ?? 'Vínculo rejeitado na curadoria.',
        deleted_at: new Date(),
      },
    });
  }

  async setPrimaryRiskLink(linkId: string) {
    const link = await this.getActiveRiskLink(linkId);

    if (!link.isConfirmed) {
      throw new BadRequestException(
        'Somente vínculos confirmados podem ser marcados como principal.',
      );
    }

    await this.prisma.$transaction([
      this.prisma.biologicalIndicatorToRisk.updateMany({
        where: {
          indicatorId: link.indicatorId,
          deleted_at: null,
          id: { not: link.id },
        },
        data: { isPrimary: false },
      }),
      this.prisma.biologicalIndicatorToRisk.update({
        where: { id: link.id },
        data: { isPrimary: true },
      }),
    ]);

    return this.prisma.biologicalIndicatorToRisk.findUnique({
      where: { id: link.id },
      include: {
        riskFactor: { select: { id: true, name: true, cas: true } },
      },
    });
  }

  async createExamLink(params: {
    indicatorId: string;
    examId: number;
    userId: number;
    notes?: string;
  }) {
    const indicator = await this.getById(params.indicatorId);
    const exam = await this.prisma.exam.findFirst({
      where: { id: params.examId, deleted_at: null },
    });

    if (!exam) {
      throw new NotFoundException('Exame não encontrado.');
    }

    const requiresReview =
      indicator.requiresNormativeReview ||
      indicator.isSubstanceGroup ||
      indicator.tableNumber === 'QUADRO_2' ||
      indicator.indicatorType === 'IBE_SC';

    return this.prisma.biologicalIndicatorToExam.upsert({
      where: {
        indicatorId_examId: {
          indicatorId: params.indicatorId,
          examId: params.examId,
        },
      },
      create: {
        indicatorId: params.indicatorId,
        examId: params.examId,
        matchConfidence: BiologicalIndicatorMatchConfidenceEnum.MANUAL,
        matchMethod: BiologicalIndicatorMatchMethodEnum.MANUAL,
        requiresReview,
        isConfirmed: false,
        isDefault: false,
        examNameSnapshot: exam.name,
        examMaterialSnapshot: exam.material,
        notes: params.notes,
      },
      update: {
        deleted_at: null,
        examNameSnapshot: exam.name,
        examMaterialSnapshot: exam.material,
        matchConfidence: BiologicalIndicatorMatchConfidenceEnum.MANUAL,
        matchMethod: BiologicalIndicatorMatchMethodEnum.MANUAL,
        requiresReview,
        notes: params.notes ?? undefined,
      },
      include: {
        exam: {
          select: {
            id: true,
            name: true,
            material: true,
            analyses: true,
            instruction: true,
            esocial27Code: true,
          },
        },
      },
    });
  }

  async confirmExamLink(linkId: string, userId: number, notes?: string) {
    const link = await this.getActiveExamLink(linkId);

    return this.prisma.biologicalIndicatorToExam.update({
      where: { id: link.id },
      data: {
        isConfirmed: true,
        confirmedById: userId,
        confirmedAt: new Date(),
        notes: notes ?? link.notes,
        deleted_at: null,
      },
      include: {
        exam: {
          select: {
            id: true,
            name: true,
            material: true,
            analyses: true,
            instruction: true,
            esocial27Code: true,
          },
        },
        confirmedBy: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async rejectExamLink(linkId: string, userId: number, notes?: string) {
    const link = await this.getActiveExamLink(linkId);

    return this.prisma.biologicalIndicatorToExam.update({
      where: { id: link.id },
      data: {
        isConfirmed: false,
        isDefault: false,
        confirmedById: userId,
        confirmedAt: new Date(),
        notes: notes ?? 'Vínculo rejeitado na curadoria.',
        deleted_at: new Date(),
      },
    });
  }

  async setDefaultExamLink(linkId: string) {
    const link = await this.getActiveExamLink(linkId);

    if (!link.isConfirmed) {
      throw new BadRequestException(
        'Somente vínculos confirmados podem ser marcados como padrão.',
      );
    }

    await this.prisma.$transaction([
      this.prisma.biologicalIndicatorToExam.updateMany({
        where: {
          indicatorId: link.indicatorId,
          deleted_at: null,
          id: { not: link.id },
        },
        data: { isDefault: false },
      }),
      this.prisma.biologicalIndicatorToExam.update({
        where: { id: link.id },
        data: { isDefault: true },
      }),
    ]);

    return this.prisma.biologicalIndicatorToExam.findUnique({
      where: { id: link.id },
      include: {
        exam: { select: { id: true, name: true, material: true } },
      },
    });
  }

  async updateStatus(params: {
    indicatorId: string;
    status: BiologicalIndicatorStatusEnum;
    userId: number;
    reviewNotes?: string;
  }) {
    const indicator = await this.getById(params.indicatorId);

    if (params.status === BiologicalIndicatorStatusEnum.ACTIVE) {
      const pendencies = getActivationPendencies({
        indicator,
        riskLinks: indicator.riskLinks,
        examLinks: indicator.examLinks,
        activationReviewNotes: params.reviewNotes,
      });

      if (pendencies.length) {
        throw new BadRequestException({
          message: 'Indicador não atende aos critérios mínimos para ativação.',
          pendencies,
        });
      }

      if (
        indicator.requiresNormativeReview &&
        !indicator.reviewedAt &&
        !params.reviewNotes?.trim()
      ) {
        throw new BadRequestException({
          message: 'Notas de revisão normativa/médica são obrigatórias para ativação.',
          pendencies: [
            {
              code: 'NORMATIVE_REVIEW_REQUIRED',
              message:
                'Revisão normativa/médica obrigatória ainda não foi registrada para este indicador.',
            },
          ],
        });
      }
    }

    return this.prisma.occupationalBiologicalIndicator.update({
      where: { id: params.indicatorId },
      data: {
        status: params.status,
        reviewedById:
          params.status === BiologicalIndicatorStatusEnum.ACTIVE
            ? params.userId
            : indicator.reviewedById,
        reviewedAt:
          params.status === BiologicalIndicatorStatusEnum.ACTIVE
            ? new Date()
            : indicator.reviewedAt,
        reviewNotes: params.reviewNotes ?? indicator.reviewNotes,
      },
      include: {
        riskLinks: { where: { deleted_at: null } },
        examLinks: { where: { deleted_at: null } },
      },
    });
  }

  /**
   * 4M.0 — Atualiza APENAS a nota de revisão normativa/médica do indicador.
   * Não altera status, vínculos, exame padrão, requiresNormativeReview nem
   * reviewedAt/reviewedById. Não roda sync NR-7. Não reabre pendências.
   * Permitido em qualquer status (inclusive ACTIVE).
   */
  async updateReviewNotes(params: { indicatorId: string; reviewNotes: string }) {
    await this.ensureIndicatorExists(params.indicatorId);

    await this.prisma.occupationalBiologicalIndicator.update({
      where: { id: params.indicatorId },
      data: { reviewNotes: params.reviewNotes },
      select: { id: true },
    });

    return this.getById(params.indicatorId);
  }

  private async ensureIndicatorExists(indicatorId: string) {
    const indicator = await this.prisma.occupationalBiologicalIndicator.findFirst({
      where: { id: indicatorId, deleted_at: null },
      select: { id: true },
    });

    if (!indicator) {
      throw new NotFoundException('Indicador biológico não encontrado.');
    }
  }

  private async getActiveRiskLink(linkId: string) {
    const link = await this.prisma.biologicalIndicatorToRisk.findFirst({
      where: { id: linkId, deleted_at: null },
    });

    if (!link) {
      throw new NotFoundException('Vínculo indicador → risco não encontrado.');
    }

    return link;
  }

  private async getActiveExamLink(linkId: string) {
    const link = await this.prisma.biologicalIndicatorToExam.findFirst({
      where: { id: linkId, deleted_at: null },
    });

    if (!link) {
      throw new NotFoundException('Vínculo indicador → exame não encontrado.');
    }

    return link;
  }
}
