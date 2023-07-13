import { prismaFilter } from '../../../../shared/utils/filters/prisma.filters';
import { Injectable } from '@nestjs/common';
import { PaginationQueryDto } from '../../../../shared/dto/pagination.dto';

import { PrismaService } from '../../../../prisma/prisma.service';

import { Prisma } from '@prisma/client';
import { CreateExamsRiskDto, FindExamRiskDto, UpdateExamRiskDto, UpsertManyExamsRiskDto } from '../../dto/exam-risk.dto';
import { ExamRiskEntity } from '../../entities/examRisk.entity';

@Injectable()
export class ExamRiskRepository {
  constructor(private prisma: PrismaService) { }

  async create({ ...createExamsRiskDto }: CreateExamsRiskDto): Promise<ExamRiskEntity> {
    const redMed = await this.prisma.examToRisk.create({
      data: {
        ...createExamsRiskDto,
      },
    });

    return new ExamRiskEntity(redMed);
  }

  async update({ id, companyId, addSkipCompanyId, ...createExamsRiskDto }: UpdateExamRiskDto): Promise<ExamRiskEntity> {
    const Exam = await this.prisma.examToRisk.update({
      data: {
        ...createExamsRiskDto,
        ...(addSkipCompanyId && {
          skipCompanies: {
            create: {
              companyId: addSkipCompanyId,
            }
          }
        })
      },
      where: { id_companyId: { companyId, id: id || 0 } },
    });

    return new ExamRiskEntity(Exam);
  }

  async find(query: Partial<FindExamRiskDto>, pagination: PaginationQueryDto, options: Prisma.ExamToRiskFindManyArgs = {}) {
    const whereInit = {
      AND: [{ skipCompanies: { none: { companyId: query.targetCompanyId } } }],
    } as typeof options.where;

    const include = { ...options?.include };

    const { where } = prismaFilter(whereInit, {
      query,
      skip: ['search', 'targetCompanyId'],
    });

    if ('search' in query && query.search) {
      (where.AND as any).push({
        OR: [{ exam: { name: { contains: query.search, mode: 'insensitive' } } }, { risk: { name: { contains: query.search, mode: 'insensitive' } } }],
      } as typeof options.where);
    }

    const response = await this.prisma.$transaction([
      this.prisma.examToRisk.count({
        where,
      }),
      this.prisma.examToRisk.findMany({
        where,
        include: Object.keys(include).length > 0 ? include : undefined,
        take: pagination.take || 20,
        skip: pagination.skip || 0,
        orderBy: [{ risk: { representAll: 'desc' } }, { risk: { name: 'asc' } }, { exam: { name: 'asc' } }],
      }),
    ]);

    return {
      data: response[1].map((exam) => new ExamRiskEntity(exam as any)),
      count: response[0],
    };
  }

  async createMany({ companyId, data }: UpsertManyExamsRiskDto) {
    await this.prisma.examToRisk.createMany({
      data: data.map(({ id, endDate, startDate, ...examRisk }) => ({
        ...examRisk,
        companyId,
      })),
    });
  }

  async upsertMany({ companyId, data }: UpsertManyExamsRiskDto) {
    const dataUpsert = await this.prisma.$transaction(
      data.map(({ id, ...examRisk }) =>
        this.prisma.examToRisk.upsert({
          create: {
            ...examRisk,
            companyId,
          },
          update: {
            ...examRisk,
          },
          where: { id },
        }),
      ),
    );

    return dataUpsert.map((risk) => new ExamRiskEntity(risk));
  }

  async findFirstNude(options: Prisma.ExamToRiskFindFirstArgs = {}) {
    const exam = await this.prisma.examToRisk.findFirst({
      ...options,
    });

    return new ExamRiskEntity(exam);
  }

  async findNude(options: Prisma.ExamToRiskFindManyArgs = {}): Promise<ExamRiskEntity[]> {
    const exams = await this.prisma.examToRisk.findMany(options);

    return exams.map((exam) => new ExamRiskEntity(exam));
  }
}
