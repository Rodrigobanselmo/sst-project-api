import { prismaFilter } from '../../../../shared/utils/filters/prisma.filters';
import { ExamEntity } from '../../entities/exam.entity';
import { Injectable } from '@nestjs/common';
import { PaginationQueryDto } from '../../../../shared/dto/pagination.dto';

import { PrismaService } from '../../../../prisma/prisma.service';
import { CreateExamDto, FindExamDto, UpdateExamDto, UpsertExamDto } from '../../dto/exam.dto';
import { BiologicalNormativeSourceEnum, Prisma } from '@prisma/client';
import {
  agentIndicatorMatches,
  agentRuleMatches,
  buildAgentIndicatorWhere,
  buildAgentLibraryWhere,
  buildExamOrderBy,
  buildExamOriginConstraint,
  buildRiskApplicabilityConstraint,
  buildRiskIndicatorExamWhere,
  buildRiskIndicatorLinkWhere,
  mergeRecommendedExamIds,
  resolveExamOrigin,
  resolveExamOriginSources,
  shouldApplyAgentFilter,
} from '../../services/exam/find-exam/exam-origin.util';
import {
  normalizeAgentName,
  normalizeCas,
} from '../../../../shared/utils/agent-normalize.util';

let i = 0;

@Injectable()
export class ExamRepository {
  constructor(private prisma: PrismaService) {}

  async create({ ...createExamDto }: CreateExamDto & { system: boolean }): Promise<ExamEntity> {
    const redMed = await this.prisma.exam.create({
      data: {
        ...createExamDto,
      },
    });

    return new ExamEntity(redMed);
  }

  async update({ id, companyId, ...createExamDto }: UpdateExamDto & { id: number }): Promise<ExamEntity> {
    const Exam = await this.prisma.exam.update({
      data: {
        ...createExamDto,
      },
      where: { id_companyId: { companyId, id: id || 0 } },
    });

    return new ExamEntity(Exam);
  }

  async upsertMany(upsertDtoMany: UpsertExamDto[]): Promise<ExamEntity[]> {
    i++;
    console.info('batch' + i);
    const data = await this.prisma.$transaction(
      upsertDtoMany.map(({ id, ...upsertRiskDto }) =>
        this.prisma.exam.upsert({
          create: {
            ...upsertRiskDto,
          },
          update: { ...upsertRiskDto },
          where: { id },
        }),
      ),
    );

    return data.map((exam) => new ExamEntity(exam));
  }

  async find(
    query: Partial<FindExamDto>,
    pagination: PaginationQueryDto,
    options: Prisma.ExamFindManyArgs = {},
    extra: { withOrigin?: boolean } = {},
  ) {
    const whereInit = {
      AND: [],
      ...options.where,
    } as typeof options.where;
    const include = { ...options?.include };

    const { where } = prismaFilter(whereInit, {
      query,
      skip: [
        'search',
        'clinicId',
        'companyId',
        'origin',
        'riskType',
        'includeIncompatible',
        'agentCas',
        'agentName',
        'riskFactorId',
      ],
    });

    if ('companyId' in query) {
      (where.AND as any).push({
        OR: [
          { companyId: query.companyId },
          {
            company: {
              applyingServiceContracts: {
                some: { receivingServiceCompanyId: query.companyId, status: 'ACTIVE' },
              },
            },
          },
          { system: true },
        ],
      } as typeof options.where);
    }

    if ('search' in query && query.search) {
      (where.AND as any).push({
        OR: [{ name: { contains: query.search, mode: 'insensitive' } }],
      } as typeof options.where);
    }

    // Origin support (opt-in). Keeps legacy behavior untouched when withOrigin
    // is not requested (e.g. clinic exam picker).
    const nr07ExamIds = extra.withOrigin
      ? await this.getNr07ExamIds()
      : new Set<number>();
    const originConstraint = extra.withOrigin
      ? buildExamOriginConstraint(query.origin, nr07ExamIds)
      : null;
    // Risk applicability filter (Fase 1): hides exams incompatible with the
    // selected risk category. Opt-in via riskType, only when withOrigin.
    const applicabilityConstraint = extra.withOrigin
      ? buildRiskApplicabilityConstraint(
          query.riskType,
          query.includeIncompatible,
          nr07ExamIds,
        )
      : null;
    // Agent recommendation filter (Fase 2): restricts the list to exams
    // recommended for a specific agent (Library ACTIVE/AGENT rules + biological
    // indicator links). Opt-in via agentCas/agentName, only when withOrigin and
    // not includeIncompatible. CAS is matched on digits; name on canonical form.
    const agentCasNormalized = extra.withOrigin
      ? normalizeCas(query.agentCas)
      : null;
    const agentNameNormalized = extra.withOrigin
      ? normalizeAgentName(query.agentName)
      : null;
    // Consolidated ACGIH/BEI path is keyed by the selected company risk factor.
    // It is only honored when origin metadata is requested (company exam picker).
    const riskFactorId =
      extra.withOrigin && query.riskFactorId ? query.riskFactorId : null;
    const applyAgentFilter = shouldApplyAgentFilter(
      extra.withOrigin,
      query.includeIncompatible,
      agentCasNormalized,
      agentNameNormalized,
      riskFactorId,
    );

    let agentRecommendationConstraint: Prisma.ExamWhereInput | null = null;
    let agentFilter: { applied: true; recommendedCount: number } | undefined;

    if (applyAgentFilter) {
      const [rules, links] = await this.prisma.$transaction([
        this.prisma.pcmsoExamRiskRule.findMany({
          where: buildAgentLibraryWhere(),
          select: {
            agentCas: true,
            agentNameNormalized: true,
            exams: { where: { deleted_at: null }, select: { examId: true } },
          },
        }),
        this.prisma.biologicalIndicatorToExam.findMany({
          where: buildAgentIndicatorWhere(),
          select: {
            examId: true,
            indicator: {
              select: {
                casPrimary: true,
                casNumbers: true,
                substanceNameNormalized: true,
              },
            },
          },
        }),
      ]);

      const libraryExamIds = rules
        .filter((rule) =>
          agentRuleMatches(rule, agentCasNormalized, agentNameNormalized),
        )
        .flatMap((rule) => rule.exams.map((exam) => exam.examId))
        .filter((examId): examId is number => examId != null);

      const indicatorExamIds = links
        .filter((link) =>
          agentIndicatorMatches(
            link.indicator,
            agentCasNormalized,
            agentNameNormalized,
          ),
        )
        .map((link) => link.examId);

      // Consolidated ACGIH/BEI path: riskFactorId → confirmed indicator→risk
      // links → confirmed indicator→exam links. Independent of CAS/name, so it
      // resolves group/isomer agents. Confirmed-only on both hops (user rule).
      const riskFactorExamIds = riskFactorId
        ? await this.findRiskFactorRecommendedExamIds(riskFactorId)
        : [];

      const recommendedExamIds = mergeRecommendedExamIds(
        libraryExamIds,
        indicatorExamIds,
        riskFactorExamIds,
      );
      // Empty recommendation set still applies: never fall back to the broad
      // catalog. `{ id: { in: [] } }` yields an empty page with count 0.
      agentRecommendationConstraint = {
        id: { in: Array.from(recommendedExamIds) },
      };
      agentFilter = { applied: true, recommendedCount: recommendedExamIds.size };
    }

    const extraConstraints = [
      originConstraint,
      applicabilityConstraint,
      agentRecommendationConstraint,
    ].filter(
      (constraint): constraint is Prisma.ExamWhereInput => Boolean(constraint),
    );
    const orderBy = buildExamOrderBy(query.orderBy, query.orderByDirection);

    let response: [number, any[]];

    if (extraConstraints.length > 0) {
      // When applying extra constraints (origin and/or risk applicability),
      // count and data must share the same where so totals stay consistent
      // with the visible rows.
      const consistentWhere = {
        AND: [{ OR: [where, { system: true }] }, ...extraConstraints],
      };
      response = await this.prisma.$transaction([
        this.prisma.exam.count({ where: consistentWhere }),
        this.prisma.exam.findMany({
          where: consistentWhere,
          include: Object.keys(include).length > 0 ? include : undefined,
          take: pagination.take || 20,
          skip: pagination.skip || 0,
          orderBy,
        }),
      ]);
    } else {
      response = await this.prisma.$transaction([
        this.prisma.exam.count({ where }),
        this.prisma.exam.findMany({
          where: { OR: [where, { system: true }] },
          include: Object.keys(include).length > 0 ? include : undefined,
          take: pagination.take || 20,
          skip: pagination.skip || 0,
          orderBy,
        }),
      ]);
    }

    // Accumulative technical/normative sources (NR-07 / ACGIH-BEI / ...). The
    // NR-07 set is reused as-is (preserves the legacy chip); ACGIH/BEI links are
    // fetched in a single batched query scoped to the current page's exam ids
    // (no N+1), restricted to active + confirmed links over a non-deleted
    // indicator. Only computed when origin metadata is requested.
    const acgihBeiExamIds = extra.withOrigin
      ? await this.getAcgihBeiExamIds(response[1].map((exam) => exam.id))
      : new Set<number>();

    return {
      data: response[1].map(
        (exam) =>
          new ExamEntity({
            ...(exam as any),
            ...(extra.withOrigin
              ? {
                  origin: resolveExamOrigin(exam, nr07ExamIds),
                  originSources: resolveExamOriginSources(
                    exam,
                    nr07ExamIds,
                    acgihBeiExamIds,
                  ),
                }
              : {}),
          }),
      ),
      count: response[0],
      ...(agentFilter ? { agentFilter } : {}),
    };
  }

  /**
   * Batched lookup of which exams (within the given page) are linked to an
   * ACGIH/BEI biological indicator. Read-only. Requires active (not deleted)
   * and confirmed links over a non-deleted indicator, matching the consolidated
   * recommendation rule. Single query with `examId in (...)` — avoids N+1.
   */
  private async getAcgihBeiExamIds(examIds: number[]): Promise<Set<number>> {
    if (examIds.length === 0) return new Set<number>();

    const links = await this.prisma.biologicalIndicatorToExam.findMany({
      where: {
        examId: { in: examIds },
        deleted_at: null,
        isConfirmed: true,
        indicator: {
          deleted_at: null,
          normativeSource: BiologicalNormativeSourceEnum.ACGIH_BEI,
        },
      },
      select: { examId: true },
    });

    return new Set(links.map((link) => link.examId));
  }

  /**
   * Resolves exam ids recommended for a company risk factor through the
   * consolidated ACGIH/BEI bridge: `BiologicalIndicatorToRisk.riskFactorId` →
   * indicator → `BiologicalIndicatorToExam.examId`. Read-only. Both hops require
   * active (not deleted) and confirmed links. Returns [] when the risk factor
   * has no confirmed indicator links, so the recommendation set stays empty
   * rather than falling back to the broad catalog.
   */
  private async findRiskFactorRecommendedExamIds(
    riskFactorId: string,
  ): Promise<number[]> {
    const riskLinks = await this.prisma.biologicalIndicatorToRisk.findMany({
      where: buildRiskIndicatorLinkWhere(riskFactorId),
      select: { indicatorId: true },
    });

    const indicatorIds = Array.from(
      new Set(riskLinks.map((link) => link.indicatorId)),
    );
    if (indicatorIds.length === 0) return [];

    const examLinks = await this.prisma.biologicalIndicatorToExam.findMany({
      where: buildRiskIndicatorExamWhere(indicatorIds),
      select: { examId: true },
    });

    return examLinks.map((link) => link.examId);
  }

  private async getNr07ExamIds(): Promise<Set<number>> {
    const links = await this.prisma.biologicalIndicatorToExam.findMany({
      where: {
        deleted_at: null,
        indicator: {
          deleted_at: null,
          normativeSource: BiologicalNormativeSourceEnum.NR_07,
        },
      },
      select: { examId: true },
    });
    return new Set(links.map((link) => link.examId));
  }

  async findNude(options: Prisma.ExamFindManyArgs = {}) {
    const response = await this.prisma.$transaction([
      this.prisma.exam.count({
        where: options.where,
      }),
      this.prisma.exam.findMany({
        ...options,
      }),
    ]);

    return {
      data: response[1].map((exam) => new ExamEntity(exam)),
      count: response[0],
    };
  }

  async findFirstNude(options: Prisma.ExamFindManyArgs = {}) {
    const examClinic = await this.prisma.exam.findFirst({
      ...options,
    });

    return new ExamEntity(examClinic);
  }

  async findAll(): Promise<ExamEntity[]> {
    const exams = await this.prisma.exam.findMany();

    return exams.map((exam) => new ExamEntity(exam));
  }

  async DeleteByIdSoft(id: number): Promise<ExamEntity> {
    const exams = await this.prisma.exam.update({
      where: { id },
      data: { deleted_at: new Date() },
    });

    return new ExamEntity(exams);
  }

  async DeleteByCompanyAndIdSoft(id: number, companyId: string): Promise<ExamEntity> {
    const exam = await this.prisma.exam.update({
      where: { id_companyId: { id, companyId } },
      data: { deleted_at: new Date() },
    });

    return new ExamEntity(exam);
  }
}
