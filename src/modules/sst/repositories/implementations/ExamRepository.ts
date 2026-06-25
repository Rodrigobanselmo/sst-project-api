import { prismaFilter } from '../../../../shared/utils/filters/prisma.filters';
import { ExamEntity } from '../../entities/exam.entity';
import { Injectable } from '@nestjs/common';
import { PaginationQueryDto } from '../../../../shared/dto/pagination.dto';

import { PrismaService } from '../../../../prisma/prisma.service';
import { CreateExamDto, FindExamDto, UpdateExamDto, UpsertExamDto } from '../../dto/exam.dto';
import { BiologicalNormativeSourceEnum, Prisma } from '@prisma/client';
import {
  buildExamOrderBy,
  buildExamOriginConstraint,
  buildRiskApplicabilityConstraint,
  resolveExamOrigin,
} from '../../services/exam/find-exam/exam-origin.util';

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
    const extraConstraints = [originConstraint, applicabilityConstraint].filter(
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

    return {
      data: response[1].map(
        (exam) =>
          new ExamEntity({
            ...(exam as any),
            ...(extra.withOrigin
              ? { origin: resolveExamOrigin(exam, nr07ExamIds) }
              : {}),
          }),
      ),
      count: response[0],
    };
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
