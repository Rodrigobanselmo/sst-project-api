import { Injectable, NotFoundException } from '@nestjs/common';
import {
  BiologicalCollectionMomentEnum,
  BiologicalNormativeSourceEnum,
  PcmsoExamRiskRuleScopeEnum,
  PcmsoExamRiskRuleStatusEnum,
} from '@prisma/client';

import { PrismaService } from '@/prisma/prisma.service';
import { normalizeAgentName } from '@/shared/utils/agent-normalize.util';

import { buildRiskIndicatorLinkWhere } from '@/modules/sst/services/exam/find-exam/exam-origin.util';

import {
  ExamTechnicalSuggestionResponse,
  IndicatorTechnicalSnapshot,
} from './exam-technical-suggestion.types';
import { buildExamTechnicalSuggestion } from './exam-technical-suggestion.util';

@Injectable()
export class ExamTechnicalSuggestionService {
  constructor(private readonly prisma: PrismaService) {}

  async getSuggestion(params: {
    companyId: string;
    riskFactorId: string;
    examId: number;
  }): Promise<ExamTechnicalSuggestionResponse> {
    const exam = await this.prisma.exam.findFirst({
      where: {
        id: params.examId,
        deleted_at: null,
      },
      select: {
        id: true,
        material: true,
        analyses: true,
        instruction: true,
      },
    });

    if (!exam) {
      throw new NotFoundException('Exame não encontrado.');
    }

    const indicators = await this.findIndicatorSnapshots(
      params.riskFactorId,
      params.examId,
    );

    return buildExamTechnicalSuggestion({
      indicators,
      exam,
    });
  }

  private async findIndicatorSnapshots(
    riskFactorId: string,
    examId: number,
  ): Promise<IndicatorTechnicalSnapshot[]> {
    const directLinks = await this.prisma.biologicalIndicatorToExam.findMany({
      where: {
        examId,
        deleted_at: null,
        isConfirmed: true,
        indicator: {
          deleted_at: null,
          riskLinks: {
            some: buildRiskIndicatorLinkWhere(riskFactorId),
          },
        },
      },
      select: {
        isDefault: true,
        indicator: {
          select: {
            normativeSource: true,
            biologicalIndicatorOriginal: true,
            biologicalMatrix: true,
            collectionMoment: true,
            referenceValue: true,
            unit: true,
            technicalObservationsRaw: true,
            acgihBeiIndicator: {
              select: {
                samplingTime: true,
                notation: true,
                internalNotes: true,
              },
            },
          },
        },
      },
      orderBy: [{ isDefault: 'desc' }, { updated_at: 'desc' }],
    });

    const ruleCollectionMoment = await this.findRuleCollectionMoment(
      riskFactorId,
      examId,
    );

    const snapshots = directLinks.map((link) =>
      this.toSnapshot(link.indicator, ruleCollectionMoment),
    );

    if (snapshots.length) {
      return snapshots;
    }

    const fallbackIndicator = await this.findIndicatorFromLibraryRule(
      riskFactorId,
      examId,
    );

    return fallbackIndicator ? [fallbackIndicator] : [];
  }

  private toSnapshot(
    indicator: {
      normativeSource: BiologicalNormativeSourceEnum;
      biologicalIndicatorOriginal: string;
      biologicalMatrix: string;
      collectionMoment: BiologicalCollectionMomentEnum;
      referenceValue: string | null;
      unit: string | null;
      technicalObservationsRaw: string | null;
      acgihBeiIndicator: {
        samplingTime: string | null;
        notation: string | null;
        internalNotes: string | null;
      } | null;
    },
    ruleCollectionMoment: string | null,
  ): IndicatorTechnicalSnapshot {
    return {
      normativeSource: indicator.normativeSource,
      biologicalIndicatorOriginal: indicator.biologicalIndicatorOriginal,
      biologicalMatrix: indicator.biologicalMatrix,
      collectionMoment: indicator.collectionMoment,
      referenceValue: indicator.referenceValue,
      unit: indicator.unit,
      technicalObservationsRaw: indicator.technicalObservationsRaw,
      samplingTime: indicator.acgihBeiIndicator?.samplingTime ?? null,
      notation: indicator.acgihBeiIndicator?.notation ?? null,
      internalNotes: indicator.acgihBeiIndicator?.internalNotes ?? null,
      ruleCollectionMoment,
    };
  }

  private async findRuleCollectionMoment(
    riskFactorId: string,
    examId: number,
  ): Promise<string | null> {
    const risk = await this.prisma.riskFactors.findFirst({
      where: { id: riskFactorId, deleted_at: null },
      select: { cas: true, name: true },
    });
    if (!risk) return null;

    const agentNameNormalized = normalizeAgentName(risk.name);
    const ruleExam = await this.prisma.pcmsoExamRiskRuleExam.findFirst({
      where: {
        examId,
        deleted_at: null,
        rule: {
          deleted_at: null,
          status: PcmsoExamRiskRuleStatusEnum.ACTIVE,
          scope: PcmsoExamRiskRuleScopeEnum.AGENT,
          OR: [
            ...(agentNameNormalized
              ? [{ agentNameNormalized }]
              : []),
            ...(risk.cas?.trim() ? [{ agentCas: risk.cas.trim() }] : []),
          ],
        },
      },
      select: { collectionMoment: true },
      orderBy: { updated_at: 'desc' },
    });

    return ruleExam?.collectionMoment ?? null;
  }

  private async findIndicatorFromLibraryRule(
    riskFactorId: string,
    examId: number,
  ): Promise<IndicatorTechnicalSnapshot | null> {
    const risk = await this.prisma.riskFactors.findFirst({
      where: { id: riskFactorId, deleted_at: null },
      select: { cas: true, name: true },
    });
    if (!risk) return null;

    const agentNameNormalized = normalizeAgentName(risk.name);
    const rule = await this.prisma.pcmsoExamRiskRule.findFirst({
      where: {
        deleted_at: null,
        status: PcmsoExamRiskRuleStatusEnum.ACTIVE,
        scope: PcmsoExamRiskRuleScopeEnum.AGENT,
        sourceIndicatorId: { not: null },
        exams: {
          some: {
            examId,
            deleted_at: null,
          },
        },
        OR: [
          ...(agentNameNormalized
            ? [{ agentNameNormalized }]
            : []),
          ...(risk.cas?.trim() ? [{ agentCas: risk.cas.trim() }] : []),
        ],
      },
      select: {
        sourceIndicatorId: true,
        exams: {
          where: { examId, deleted_at: null },
          select: { collectionMoment: true },
          take: 1,
        },
      },
      orderBy: { updated_at: 'desc' },
    });

    if (!rule?.sourceIndicatorId) return null;

    const indicator = await this.prisma.occupationalBiologicalIndicator.findFirst({
      where: {
        id: rule.sourceIndicatorId,
        deleted_at: null,
      },
      select: {
        normativeSource: true,
        biologicalIndicatorOriginal: true,
        biologicalMatrix: true,
        collectionMoment: true,
        referenceValue: true,
        unit: true,
        technicalObservationsRaw: true,
        acgihBeiIndicator: {
          select: {
            samplingTime: true,
            notation: true,
            internalNotes: true,
          },
        },
      },
    });

    if (!indicator) return null;

    return this.toSnapshot(
      indicator,
      rule.exams[0]?.collectionMoment ?? null,
    );
  }
}
