import { prismaFilter } from '../../../../shared/utils/filters/prisma.filters';
import { ExamEntity } from '../../entities/exam.entity';
import { Injectable } from '@nestjs/common';
import { PaginationQueryDto } from '../../../../shared/dto/pagination.dto';

import { PrismaService } from '../../../../prisma/prisma.service';
import {
  CreateExamDto,
  FindExamDto,
  UpdateExamDto,
  UpsertExamDto,
} from '../../dto/exam.dto';
import { Prisma } from '@prisma/client';

let i = 0;

@Injectable()
export class ExamRepository {
  constructor(private prisma: PrismaService) {}

  async create({
    ...createExamDto
  }: CreateExamDto & { system: boolean }): Promise<ExamEntity> {
    const redMed = await this.prisma.exam.create({
      data: {
        ...createExamDto,
      },
    });

    return new ExamEntity(redMed);
  }

  async update({
    id,
    companyId,
    ...createExamDto
  }: UpdateExamDto & { id: number }): Promise<ExamEntity> {
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
    console.log('batch' + i);
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
  ) {
    const whereInit = {
      AND: [],
      ...options.where,
    } as typeof options.where;
    const include = { ...options?.include };

    const { where } = prismaFilter(whereInit, {
      query,
      skip: ['search', 'clinicId'],
    });

    if ('search' in query) {
      (where.AND as any).push({
        OR: [{ name: { contains: query.search, mode: 'insensitive' } }],
      } as typeof options.where);
    }

    const response = await this.prisma.$transaction([
      this.prisma.exam.count({
        where: { OR: [where, { system: true }] },
      }),
      this.prisma.exam.findMany({
        where: { OR: [where, { system: true }] },
        include: Object.keys(include).length > 0 ? include : undefined,
        take: pagination.take || 20,
        skip: pagination.skip || 0,
        orderBy: { name: 'asc' },
      }),
    ]);

    return {
      data: response[1].map((exam) => new ExamEntity(exam)),
      count: response[0],
    };
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

  async DeleteByCompanyAndIdSoft(
    id: number,
    companyId: string,
  ): Promise<ExamEntity> {
    const exam = await this.prisma.exam.update({
      where: { id_companyId: { id, companyId } },
      data: { deleted_at: new Date() },
    });

    return new ExamEntity(exam);
  }
}
