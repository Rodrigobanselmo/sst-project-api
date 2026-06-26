import { Injectable } from '@nestjs/common';
import {
  PcmsoExamRiskRuleScopeEnum,
  PcmsoExamRiskRuleSourceEnum,
  PcmsoExamRiskRuleStatusEnum,
  Prisma,
} from '@prisma/client';

import { PrismaService } from '@/prisma/prisma.service';

export type BrowseExamRiskRulesFilters = {
  search?: string;
  scope?: PcmsoExamRiskRuleScopeEnum;
  status?: PcmsoExamRiskRuleStatusEnum;
  source?: PcmsoExamRiskRuleSourceEnum;
};

export type BrowseExamRiskRulesParams = {
  page: number;
  limit: number;
  filters?: BrowseExamRiskRulesFilters;
};

const ruleInclude = {
  exams: {
    where: { deleted_at: null },
    orderBy: { created_at: 'asc' as const },
  },
} satisfies Prisma.PcmsoExamRiskRuleInclude;

@Injectable()
export class ExamRiskRuleRepository {
  constructor(private readonly prisma: PrismaService) {}

  private buildWhere(
    filters: BrowseExamRiskRulesFilters = {},
  ): Prisma.PcmsoExamRiskRuleWhereInput {
    const where: Prisma.PcmsoExamRiskRuleWhereInput = { deleted_at: null };

    if (filters.scope) where.scope = filters.scope;
    if (filters.status) where.status = filters.status;
    if (filters.source) where.source = filters.source;

    if (filters.search?.trim()) {
      const search = filters.search.trim();
      where.OR = [
        { riskNameSnapshot: { contains: search, mode: 'insensitive' } },
        { subTypeNameSnapshot: { contains: search, mode: 'insensitive' } },
        { agentName: { contains: search, mode: 'insensitive' } },
        { agentNameNormalized: { contains: search, mode: 'insensitive' } },
        { agentCas: { contains: search, mode: 'insensitive' } },
        { rationale: { contains: search, mode: 'insensitive' } },
      ];
    }

    return where;
  }

  async browse(params: BrowseExamRiskRulesParams) {
    const where = this.buildWhere(params.filters);
    const skip = (params.page - 1) * params.limit;

    const [count, data] = await this.prisma.$transaction([
      this.prisma.pcmsoExamRiskRule.count({ where }),
      this.prisma.pcmsoExamRiskRule.findMany({
        where,
        skip,
        take: params.limit,
        orderBy: [{ updated_at: 'desc' }, { created_at: 'desc' }],
        include: ruleInclude,
      }),
    ]);

    return { count, data, page: params.page, limit: params.limit };
  }

  findById(id: string) {
    return this.prisma.pcmsoExamRiskRule.findFirst({
      where: { id, deleted_at: null },
      include: ruleInclude,
    });
  }

  create(data: Prisma.PcmsoExamRiskRuleCreateInput) {
    return this.prisma.pcmsoExamRiskRule.create({
      data,
      include: ruleInclude,
    });
  }

  async update(
    id: string,
    data: Prisma.PcmsoExamRiskRuleUpdateInput,
    examsReplacement?: Prisma.PcmsoExamRiskRuleExamCreateManyRuleInput[],
  ) {
    if (!examsReplacement) {
      return this.prisma.pcmsoExamRiskRule.update({
        where: { id },
        data,
        include: ruleInclude,
      });
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.pcmsoExamRiskRuleExam.deleteMany({ where: { ruleId: id } });
      return tx.pcmsoExamRiskRule.update({
        where: { id },
        data: {
          ...data,
          exams: { createMany: { data: examsReplacement } },
        },
        include: ruleInclude,
      });
    });
  }

  updateStatus(id: string, status: PcmsoExamRiskRuleStatusEnum) {
    return this.prisma.pcmsoExamRiskRule.update({
      where: { id },
      data: { status },
      include: ruleInclude,
    });
  }

  softDelete(id: string) {
    return this.prisma.pcmsoExamRiskRule.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
  }

  findRiskById(riskFactorId: string) {
    return this.prisma.riskFactors.findFirst({
      where: {
        id: riskFactorId,
        deleted_at: null,
        OR: [{ system: true }, { representAll: true }],
      },
      select: { id: true, name: true, type: true, cas: true, system: true },
    });
  }

  findSubTypeById(riskSubTypeId: number) {
    return this.prisma.riskSubType.findFirst({
      where: { id: riskSubTypeId },
      select: { id: true, name: true, type: true, sub_type: true },
    });
  }

  findExamById(examId: number) {
    return this.prisma.exam.findFirst({
      where: { id: examId, deleted_at: null },
      select: { id: true, name: true, system: true },
    });
  }

  searchRiskCandidates(params: {
    search?: string;
    type?: Prisma.RiskFactorsWhereInput['type'];
    limit?: number;
  }) {
    const search = params.search?.trim();
    return this.prisma.riskFactors.findMany({
      where: {
        deleted_at: null,
        system: true,
        ...(params.type ? { type: params.type } : {}),
        ...(search
          ? {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { cas: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      take: params.limit ?? 30,
      orderBy: { name: 'asc' },
      select: { id: true, name: true, type: true, cas: true },
    });
  }

  findNr07IndicatorsForSync() {
    return this.prisma.occupationalBiologicalIndicator.findMany({
      where: {
        deleted_at: null,
        normativeSource: 'NR_07',
      },
      include: {
        riskLinks: {
          where: { deleted_at: null },
          include: {
            riskFactor: {
              select: { id: true, name: true, system: true, deleted_at: true },
            },
          },
        },
        examLinks: {
          where: { deleted_at: null },
          include: {
            exam: {
              select: { id: true, name: true, system: true, deleted_at: true },
            },
          },
        },
      },
      orderBy: [
        { substanceName: 'asc' },
        { biologicalIndicatorNormalized: 'asc' },
      ],
    });
  }

  findRuleBySourceIndicator(sourceIndicatorId: string) {
    return this.prisma.pcmsoExamRiskRule.findFirst({
      where: {
        source: PcmsoExamRiskRuleSourceEnum.NR_07,
        sourceIndicatorId,
        deleted_at: null,
      },
      include: ruleInclude,
    });
  }

  searchExamCandidates(params: { search?: string; limit?: number }) {
    const search = params.search?.trim();
    return this.prisma.exam.findMany({
      where: {
        deleted_at: null,
        system: true,
        ...(search
          ? { name: { contains: search, mode: 'insensitive' } }
          : {}),
      },
      take: params.limit ?? 30,
      orderBy: { name: 'asc' },
      select: { id: true, name: true, type: true, esocial27Code: true },
    });
  }
}
