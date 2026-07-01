import { Injectable } from '@nestjs/common';
import {
  PcmsoExamRiskRuleStatusEnum,
  Prisma,
  StatusEnum,
} from '@prisma/client';

import { PrismaService } from '@/prisma/prisma.service';

import {
  CoverageGapsActiveRule,
  CoverageGapsBiologicalLink,
  CoverageGapsRiskRow,
} from './exam-risk-rule-coverage-gaps.types';

export type LoadCoverageGapsRisksParams = {
  type?: Prisma.RiskFactorsWhereInput['type'];
  search?: string;
  onlyPcmso?: boolean;
};

@Injectable()
export class ExamRiskRuleCoverageGapsRepository {
  constructor(private readonly prisma: PrismaService) {}

  loadActiveRules(): Promise<CoverageGapsActiveRule[]> {
    return this.prisma.pcmsoExamRiskRule.findMany({
      where: {
        deleted_at: null,
        status: PcmsoExamRiskRuleStatusEnum.ACTIVE,
      },
      select: {
        id: true,
        scope: true,
        source: true,
        riskFactorId: true,
        riskCategory: true,
        riskSubTypeId: true,
        agentCas: true,
        agentNameNormalized: true,
        exams: {
          where: { deleted_at: null },
          select: {
            examId: true,
            examNameSnapshot: true,
          },
        },
        references: {
          where: {
            deleted_at: null,
            status: 'ACTIVE',
          },
          select: {
            sourceType: true,
            referenceLabel: true,
          },
        },
      },
    });
  }

  loadGlobalRisks(
    params: LoadCoverageGapsRisksParams,
  ): Promise<CoverageGapsRiskRow[]> {
    const search = params.search?.trim();

    return this.prisma.riskFactors.findMany({
      where: {
        system: true,
        deleted_at: null,
        status: StatusEnum.ACTIVE,
        ...(params.onlyPcmso !== false ? { isPCMSO: true } : {}),
        ...(params.type ? { type: params.type } : {}),
        ...(search
          ? {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { cas: { contains: search, mode: 'insensitive' } },
                { esocialCode: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      orderBy: [{ type: 'asc' }, { name: 'asc' }],
      select: {
        id: true,
        name: true,
        type: true,
        cas: true,
        esocialCode: true,
        subTypes: {
          select: {
            sub_type: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    }).then((risks) =>
      risks.map((risk) => ({
        id: risk.id,
        name: risk.name,
        type: risk.type,
        cas: risk.cas,
        esocialCode: risk.esocialCode,
        subTypes: risk.subTypes.map((link) => ({
          id: link.sub_type.id,
          name: link.sub_type.name,
        })),
      })),
    );
  }

  async loadBiologicalLinksByRiskIds(
    riskIds: string[],
  ): Promise<Map<string, CoverageGapsBiologicalLink[]>> {
    if (!riskIds.length) return new Map();

    const links = await this.prisma.biologicalIndicatorToRisk.findMany({
      where: {
        deleted_at: null,
        isConfirmed: true,
        riskFactorId: { in: riskIds },
        riskFactor: {
          system: true,
          deleted_at: null,
        },
        indicator: {
          deleted_at: null,
        },
      },
      select: {
        riskFactorId: true,
        indicator: {
          select: {
            id: true,
            substanceName: true,
            examLinks: {
              where: {
                deleted_at: null,
                isConfirmed: true,
              },
              select: {
                examNameSnapshot: true,
                exam: {
                  select: { name: true },
                },
              },
            },
          },
        },
      },
    });

    const grouped = new Map<string, CoverageGapsBiologicalLink[]>();

    for (const link of links) {
      const confirmedExamNames = link.indicator.examLinks
        .map(
          (examLink) =>
            examLink.examNameSnapshot?.trim() || examLink.exam?.name?.trim(),
        )
        .filter((name): name is string => Boolean(name));

      const entry: CoverageGapsBiologicalLink = {
        indicatorId: link.indicator.id,
        substanceName: link.indicator.substanceName,
        confirmedExamCount: link.indicator.examLinks.length,
        confirmedExamNames: Array.from(new Set(confirmedExamNames)),
      };

      const current = grouped.get(link.riskFactorId) ?? [];
      current.push(entry);
      grouped.set(link.riskFactorId, current);
    }

    return grouped;
  }
}
