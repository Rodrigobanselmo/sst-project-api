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
import { BiologicalIndicatorMatchService } from '../biological-indicator-match.service';
import {
  BiologicalIndicatorExamMatchCandidate,
  BiologicalIndicatorRiskMatchCandidate,
} from '../biological-indicator-match.types';

import { RematchTarget } from '../application/curation/biological-indicator-curation.dto';
import { BiologicalIndicatorDAO } from '../database/dao/biological-indicator.dao';
import { getActivationPendencies } from './biological-indicator-activation.validator';

/** 4M.1 — Candidato exibível na prévia/resumo de reanálise. */
type RematchRiskCandidate = {
  riskFactorId: string;
  riskName: string | null;
  riskCas: string | null;
  matchMethod: string;
  matchConfidence: string;
  requiresReview: boolean;
};

type RematchExamCandidate = {
  examId: number;
  examName: string | null;
  examMaterial: string | null;
  matchMethod: string;
  matchConfidence: string;
  requiresReview: boolean;
};

type RematchBucket<TCandidate> = {
  created: TCandidate[];
  restored: TCandidate[];
  ignoredConfirmed: TCandidate[];
  ignoredExisting: TCandidate[];
  candidates: TCandidate[];
};

const emptyBucket = <TCandidate>(): RematchBucket<TCandidate> => ({
  created: [],
  restored: [],
  ignoredConfirmed: [],
  ignoredExisting: [],
  candidates: [],
});

@Injectable()
export class BiologicalIndicatorCurationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly biologicalIndicatorDAO: BiologicalIndicatorDAO,
    private readonly matchService: BiologicalIndicatorMatchService,
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

  /**
   * 4M.1 — Reanálise SEGURA de vínculos de UM indicador NR-7.
   * - Não confirma, não ativa, não altera status/nota, não roda sync.
   * - Nunca altera/deprecia vínculos já confirmados.
   * - Cria/restaura apenas candidatos PENDENTES.
   * - dryRun: apenas calcula a prévia, sem escrever no banco.
   */
  async rematchIndicator(params: {
    indicatorId: string;
    target: RematchTarget;
    dryRun: boolean;
  }) {
    const computed = await this.matchService.computeCandidatesForIndicator(
      params.indicatorId,
    );

    if (!computed) {
      throw new NotFoundException('Indicador biológico não encontrado.');
    }

    const risk =
      params.target === 'RISK' || params.target === 'BOTH'
        ? await this.applySafeRiskRematch(
            params.indicatorId,
            computed.riskMatches,
            params.dryRun,
          )
        : emptyBucket<RematchRiskCandidate>();

    const exam =
      params.target === 'EXAM' || params.target === 'BOTH'
        ? await this.applySafeExamRematch(
            params.indicatorId,
            computed.examMatches,
            params.dryRun,
          )
        : emptyBucket<RematchExamCandidate>();

    const indicator = await this.getById(params.indicatorId);

    return {
      target: params.target,
      dryRun: params.dryRun,
      risk,
      exam,
      indicator,
    };
  }

  private async applySafeRiskRematch(
    indicatorId: string,
    matches: BiologicalIndicatorRiskMatchCandidate[],
    dryRun: boolean,
  ): Promise<RematchBucket<RematchRiskCandidate>> {
    const bucket = emptyBucket<RematchRiskCandidate>();

    // Carrega TODOS os vínculos (inclui soft-deleted) para classificar com segurança.
    const existing = await this.prisma.biologicalIndicatorToRisk.findMany({
      where: { indicatorId },
    });
    const byRiskId = new Map(existing.map((link) => [link.riskFactorId, link]));

    for (const match of matches) {
      const candidate: RematchRiskCandidate = {
        riskFactorId: match.riskFactorId,
        riskName: match.riskName,
        riskCas: match.riskCas,
        matchMethod: match.matchMethod,
        matchConfidence: match.matchConfidence,
        requiresReview: match.requiresReview,
      };
      bucket.candidates.push(candidate);

      const link = byRiskId.get(match.riskFactorId);

      if (link && !link.deleted_at && link.isConfirmed) {
        bucket.ignoredConfirmed.push(candidate);
        continue;
      }

      if (link && !link.deleted_at && !link.isConfirmed) {
        bucket.ignoredExisting.push(candidate);
        continue;
      }

      if (link && link.deleted_at) {
        if (!dryRun) {
          await this.prisma.biologicalIndicatorToRisk.update({
            where: { id: link.id },
            data: {
              deleted_at: null,
              isConfirmed: false,
              isPrimary: false,
              confirmedById: null,
              confirmedAt: null,
              matchConfidence: match.matchConfidence,
              matchMethod: match.matchMethod,
              requiresReview: match.requiresReview,
              riskNameSnapshot: match.riskName,
              riskCasSnapshot: match.riskCas,
              notes: 'Restaurado por reanálise de vínculos (pendente).',
            },
          });
        }
        bucket.restored.push(candidate);
        continue;
      }

      if (!dryRun) {
        await this.prisma.biologicalIndicatorToRisk.create({
          data: {
            indicatorId,
            riskFactorId: match.riskFactorId,
            matchConfidence: match.matchConfidence,
            matchMethod: match.matchMethod,
            requiresReview: match.requiresReview,
            isConfirmed: false,
            isPrimary: false,
            riskNameSnapshot: match.riskName,
            riskCasSnapshot: match.riskCas,
            notes: 'Criado por reanálise de vínculos (pendente).',
          },
        });
      }
      bucket.created.push(candidate);
    }

    return bucket;
  }

  private async applySafeExamRematch(
    indicatorId: string,
    matches: BiologicalIndicatorExamMatchCandidate[],
    dryRun: boolean,
  ): Promise<RematchBucket<RematchExamCandidate>> {
    const bucket = emptyBucket<RematchExamCandidate>();

    const existing = await this.prisma.biologicalIndicatorToExam.findMany({
      where: { indicatorId },
    });
    const byExamId = new Map(existing.map((link) => [link.examId, link]));

    for (const match of matches) {
      const candidate: RematchExamCandidate = {
        examId: match.examId,
        examName: match.examName,
        examMaterial: match.examMaterial,
        matchMethod: match.matchMethod,
        matchConfidence: match.matchConfidence,
        requiresReview: match.requiresReview,
      };
      bucket.candidates.push(candidate);

      const link = byExamId.get(match.examId);

      if (link && !link.deleted_at && link.isConfirmed) {
        bucket.ignoredConfirmed.push(candidate);
        continue;
      }

      if (link && !link.deleted_at && !link.isConfirmed) {
        bucket.ignoredExisting.push(candidate);
        continue;
      }

      if (link && link.deleted_at) {
        if (!dryRun) {
          await this.prisma.biologicalIndicatorToExam.update({
            where: { id: link.id },
            data: {
              deleted_at: null,
              isConfirmed: false,
              isDefault: false,
              confirmedById: null,
              confirmedAt: null,
              matchConfidence: match.matchConfidence,
              matchMethod: match.matchMethod,
              requiresReview: match.requiresReview,
              examNameSnapshot: match.examName,
              examMaterialSnapshot: match.examMaterial,
              notes: 'Restaurado por reanálise de vínculos (pendente).',
            },
          });
        }
        bucket.restored.push(candidate);
        continue;
      }

      if (!dryRun) {
        await this.prisma.biologicalIndicatorToExam.create({
          data: {
            indicatorId,
            examId: match.examId,
            matchConfidence: match.matchConfidence,
            matchMethod: match.matchMethod,
            requiresReview: match.requiresReview,
            isConfirmed: false,
            isDefault: false,
            examNameSnapshot: match.examName,
            examMaterialSnapshot: match.examMaterial,
            notes: 'Criado por reanálise de vínculos (pendente).',
          },
        });
      }
      bucket.created.push(candidate);
    }

    return bucket;
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
