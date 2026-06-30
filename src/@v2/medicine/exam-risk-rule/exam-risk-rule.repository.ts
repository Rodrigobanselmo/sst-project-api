import { Injectable } from '@nestjs/common';
import {
  PcmsoExamRiskRuleScopeEnum,
  PcmsoExamRiskRuleSourceEnum,
  PcmsoExamRiskRuleStatusEnum,
  Prisma,
} from '@prisma/client';

import { PrismaService } from '@/prisma/prisma.service';

import { resolveIndicatorRiskFactorForDisplay } from './exam-risk-rule-riskfactor-display.util';

export type BrowseExamRiskRulesFilters = {
  search?: string;
  scope?: PcmsoExamRiskRuleScopeEnum;
  status?: PcmsoExamRiskRuleStatusEnum;
  source?: PcmsoExamRiskRuleSourceEnum;
  /** IDs de indicadores NR-7 cujo RiskFactor correlacionado casa com a busca. */
  nr07SourceIndicatorIds?: string[];
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
  // Fontes complementares ativas (4I) — read-only, para selo/contagem na UI.
  references: {
    where: {
      deleted_at: null,
      status: 'ACTIVE' as const,
    },
    orderBy: { created_at: 'asc' as const },
    select: {
      id: true,
      sourceType: true,
      acgihBeiIndicatorId: true,
      nr7IndicatorId: true,
      referenceLabel: true,
      referenceYear: true,
      created_at: true,
    },
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
      const searchOr: Prisma.PcmsoExamRiskRuleWhereInput[] = [
        { riskNameSnapshot: { contains: search, mode: 'insensitive' } },
        { subTypeNameSnapshot: { contains: search, mode: 'insensitive' } },
        { agentName: { contains: search, mode: 'insensitive' } },
        { agentNameNormalized: { contains: search, mode: 'insensitive' } },
        { agentCas: { contains: search, mode: 'insensitive' } },
        { rationale: { contains: search, mode: 'insensitive' } },
      ];

      if (filters.nr07SourceIndicatorIds?.length) {
        searchOr.push({
          sourceIndicatorId: { in: filters.nr07SourceIndicatorIds },
        });
      }

      where.OR = searchOr;
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

  /** Regra por fonte + chave de proveniência (ex.: TECHNICAL + indicatorId::riskId). */
  findRuleBySourceAndIndicator(
    source: PcmsoExamRiskRuleSourceEnum,
    sourceIndicatorId: string,
  ) {
    return this.prisma.pcmsoExamRiskRule.findFirst({
      where: { source, sourceIndicatorId, deleted_at: null },
      include: ruleInclude,
    });
  }

  /**
   * Regra NR-07 existente para o mesmo agente (fator de risco) e exame — base
   * para anexar ACGIH/BEI como fonte complementar sem duplicar regra.
   */
  findAgentRuleByExam(params: {
    agentNameNormalized: string | null;
    examId: number;
  }) {
    if (!params.agentNameNormalized) return Promise.resolve(null);
    return this.prisma.pcmsoExamRiskRule.findFirst({
      where: {
        deleted_at: null,
        scope: PcmsoExamRiskRuleScopeEnum.AGENT,
        agentNameNormalized: params.agentNameNormalized,
        exams: {
          some: { deleted_at: null, examId: params.examId },
        },
      },
      include: ruleInclude,
    });
  }

  findNr07RuleByAgentAndExam(params: {
    agentNameNormalized: string | null;
    examId: number;
  }) {
    if (!params.agentNameNormalized) return Promise.resolve(null);
    return this.prisma.pcmsoExamRiskRule.findFirst({
      where: {
        deleted_at: null,
        source: PcmsoExamRiskRuleSourceEnum.NR_07,
        scope: PcmsoExamRiskRuleScopeEnum.AGENT,
        agentNameNormalized: params.agentNameNormalized,
        exams: {
          some: { deleted_at: null, examId: params.examId },
        },
      },
      include: ruleInclude,
    });
  }

  /** Indicadores oficiais ACGIH/BEI consolidados com vínculos de risco e exame. */
  findAcgihIndicatorsForSync() {
    return this.prisma.occupationalBiologicalIndicator.findMany({
      where: {
        deleted_at: null,
        normativeSource: 'ACGIH_BEI',
        acgihBeiIndicatorId: { not: null },
      },
      include: {
        riskLinks: {
          where: { deleted_at: null },
          include: {
            riskFactor: {
              select: { id: true, name: true, cas: true, system: true, deleted_at: true },
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
      orderBy: [{ substanceName: 'asc' }, { id: 'asc' }],
    });
  }

  /** IDs de indicadores NR-7 cujo RiskFactor correlacionado casa com a busca. */
  findNr07IndicatorIdsByRiskFactorNameSearch(search: string) {
    const term = search.trim();
    if (!term) return Promise.resolve([] as string[]);

    return this.prisma.biologicalIndicatorToRisk
      .findMany({
        where: {
          deleted_at: null,
          isConfirmed: true,
          indicator: {
            deleted_at: null,
            normativeSource: 'NR_07',
          },
          riskFactor: {
            deleted_at: null,
            name: { contains: term, mode: 'insensitive' },
          },
        },
        select: { indicatorId: true },
        distinct: ['indicatorId'],
      })
      .then((rows) => rows.map((row) => row.indicatorId));
  }

  /** Fatores de risco correlacionados (read-only) para enriquecer browse NR-7. */
  findNr07IndicatorRiskFactorsByIds(indicatorIds: string[]) {
    if (!indicatorIds.length) {
      return Promise.resolve(
        new Map<string, { riskFactorId: string; riskFactorName: string }>(),
      );
    }

    return this.prisma.occupationalBiologicalIndicator
      .findMany({
        where: {
          id: { in: indicatorIds },
          deleted_at: null,
          normativeSource: 'NR_07',
        },
        select: {
          id: true,
          riskLinks: {
            where: { deleted_at: null, isConfirmed: true },
            select: {
              deleted_at: true,
              isConfirmed: true,
              isPrimary: true,
              riskFactorId: true,
              riskFactor: {
                select: { id: true, name: true, deleted_at: true },
              },
            },
          },
        },
      })
      .then((indicators) => {
        const map = new Map<
          string,
          { riskFactorId: string; riskFactorName: string }
        >();

        for (const indicator of indicators) {
          const resolved = resolveIndicatorRiskFactorForDisplay(
            indicator.riskLinks,
          );
          if (resolved) map.set(indicator.id, resolved);
        }

        return map;
      });
  }

  /** Origem ACGIH/BEI (staging) a partir do indicador oficial consolidado. */
  findAcgihBeiOriginsByOfficialIndicatorIds(officialIndicatorIds: string[]) {
    if (!officialIndicatorIds.length) {
      return Promise.resolve(
        new Map<
          string,
          { acgihBeiIndicatorId: string; substanceName: string | null }
        >(),
      );
    }

    return this.prisma.occupationalBiologicalIndicator
      .findMany({
        where: {
          id: { in: officialIndicatorIds },
          deleted_at: null,
          normativeSource: 'ACGIH_BEI',
          acgihBeiIndicatorId: { not: null },
        },
        select: {
          id: true,
          substanceName: true,
          acgihBeiIndicatorId: true,
        },
      })
      .then((rows) => {
        const map = new Map<
          string,
          { acgihBeiIndicatorId: string; substanceName: string | null }
        >();

        for (const row of rows) {
          if (!row.acgihBeiIndicatorId) continue;
          map.set(row.id, {
            acgihBeiIndicatorId: row.acgihBeiIndicatorId,
            substanceName: row.substanceName,
          });
        }

        return map;
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

  // ── Suporte a export/import Excel (4A.1) ────────────────────────────────

  /** Todas as regras ativas (não deletadas) com seus exames, para export. */
  findAllRulesWithExams() {
    return this.prisma.pcmsoExamRiskRule.findMany({
      where: { deleted_at: null },
      orderBy: [{ scope: 'asc' }, { updated_at: 'desc' }],
      include: {
        exams: {
          where: { deleted_at: null },
          orderBy: { created_at: 'asc' },
        },
      },
    });
  }

  /**
   * Regras por id INCLUINDO soft-deleted e exames soft-deleted — usado por
   * preview/apply para resolver âncoras e detectar restauração.
   */
  findRulesByIdsRaw(ids: string[]) {
    if (!ids.length) return Promise.resolve([]);
    return this.prisma.pcmsoExamRiskRule.findMany({
      where: { id: { in: ids } },
      include: { exams: true },
    });
  }

  /** Exames system/global por id (read-only) — valida examId e dá snapshot. */
  findExamsByIds(ids: number[]) {
    if (!ids.length) return Promise.resolve([]);
    return this.prisma.exam.findMany({
      where: { id: { in: ids }, deleted_at: null },
      select: { id: true, name: true, system: true, esocial27Code: true },
    });
  }

  /** Nomes curados da Tabela 27 por código (read-only, apenas informativo). */
  findEsocialProcedureNamesByCodes(codes: string[]) {
    if (!codes.length) return Promise.resolve([]);
    return this.prisma.pcmsoEsocialProcedure.findMany({
      where: { procedureCode: { in: codes }, deleted_at: null },
      select: { procedureCode: true, procedureNameSnapshot: true },
    });
  }

  /**
   * Aplica o lote de curadoria em transação atômica. Toca SOMENTE
   * PcmsoExamRiskRule e PcmsoExamRiskRuleExam. Nunca escreve ExamToRisk,
   * empresas, Exam, RiskFactors, RiskSubType, Tabela 27 ou eSocial.
   */
  applyImportBatch(params: {
    ruleUpdates: { id: string; data: Prisma.PcmsoExamRiskRuleUpdateInput }[];
    examCreates: {
      ruleId: string;
      data: Prisma.PcmsoExamRiskRuleExamCreateWithoutRuleInput;
    }[];
    examUpdates: {
      id: string;
      data: Prisma.PcmsoExamRiskRuleExamUpdateInput;
    }[];
  }) {
    const { ruleUpdates, examCreates, examUpdates } = params;
    if (!ruleUpdates.length && !examCreates.length && !examUpdates.length) {
      return Promise.resolve();
    }

    return this.prisma.$transaction(async (tx) => {
      for (const update of ruleUpdates) {
        await tx.pcmsoExamRiskRule.update({
          where: { id: update.id },
          data: update.data,
        });
      }
      for (const create of examCreates) {
        await tx.pcmsoExamRiskRuleExam.create({
          data: {
            ...create.data,
            rule: { connect: { id: create.ruleId } },
          },
        });
      }
      for (const update of examUpdates) {
        await tx.pcmsoExamRiskRuleExam.update({
          where: { id: update.id },
          data: update.data,
        });
      }
    });
  }
}
