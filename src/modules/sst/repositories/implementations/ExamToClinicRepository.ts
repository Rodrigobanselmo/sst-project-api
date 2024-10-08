import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { v4 } from 'uuid';

import { PrismaService } from '../../../../prisma/prisma.service';
import { FindExamToClinicDto, UpsertExamToClinicDto, UpsertManyExamToClinicDto } from '../../dto/exam-to-clinic.dto';
import { ExamToClinicEntity } from '../../entities/examToClinic';
import { PaginationQueryDto } from '../../../../shared/dto/pagination.dto';
import { prismaFilter } from '../../../../shared/utils/filters/prisma.filters';

@Injectable()
export class ExamToClinicRepository {
  constructor(private prisma: PrismaService) {}

  async create({ ...createExamToClinicDto }: UpsertExamToClinicDto): Promise<ExamToClinicEntity> {
    const examEntity = await this.prisma.examToClinic.create({
      data: {
        ...createExamToClinicDto,
      },
    });

    return new ExamToClinicEntity(examEntity);
  }

  async update({
    id,
    ...createExamToClinicDto
  }: UpsertExamToClinicDto & {
    id: number;
    endDate?: Date;
  }): Promise<ExamToClinicEntity> {
    const ExamToClinic = await this.prisma.examToClinic.update({
      data: {
        ...createExamToClinicDto,
      },
      where: { id },
    });

    return new ExamToClinicEntity(ExamToClinic);
  }

  async upsert({
    examId,
    companyId,
    startDate,
    groupId,
    ...createExamToClinicDto
  }: UpsertExamToClinicDto): Promise<ExamToClinicEntity> {
    const GROUP_ID = groupId || v4();
    const examEntity = await this.prisma.examToClinic.upsert({
      create: {
        examId,
        companyId,
        startDate,
        groupId: GROUP_ID,
        ...createExamToClinicDto,
      },
      update: {
        ...createExamToClinicDto,
      },
      where: {
        examId_companyId_startDate_groupId: {
          examId,
          companyId,
          startDate,
          groupId: GROUP_ID,
        },
      },
    });

    return new ExamToClinicEntity(examEntity);
  }

  async createMany({ companyId, data }: UpsertManyExamToClinicDto) {
    await this.prisma.examToClinic.createMany({
      data: data.map(({ id, endDate, groupId, ...examRisk }) => ({
        ...examRisk,
        companyId,
      })),
    });
  }

  async findNude(options: Prisma.ExamToClinicFindManyArgs) {
    const data = await this.prisma.examToClinic.findMany({
      ...options,
    });

    return data.map((exam) => new ExamToClinicEntity(exam));
  }

  async findFirstNude(options: Prisma.ExamToClinicFindManyArgs = {}) {
    const examClinic = await this.prisma.examToClinic.findFirst({
      ...options,
    });

    return new ExamToClinicEntity(examClinic);
  }

  async find(
    query: Partial<FindExamToClinicDto>,
    pagination: PaginationQueryDto,
    options: Prisma.ExamToClinicFindManyArgs = {},
  ) {
    const whereInit = {
      AND: [],
    } as typeof options.where;

    let orderBy = { exam: { name: 'asc' } } as typeof options.orderBy;
    if ('orderBy' in query) orderBy = { [query.orderBy]: query?.orderByDirection ?? 'asc' };

    const { where } = prismaFilter(whereInit, {
      query,
      skip: ['search'],
    });

    if ('search' in query && query.search) {
      (where.AND as any).push({
        OR: [{ exam: { name: { contains: query.search, mode: 'insensitive' } } }],
      } as typeof options.where);
    }

    const response = await this.prisma.$transaction([
      this.prisma.examToClinic.count({
        where,
      }),
      this.prisma.examToClinic.findMany({
        where,
        include: {
          exam: true,
          ...options?.include,
        },
        take: pagination.take || 20,
        skip: pagination.skip || 0,
        // distinct: ['companyId', 'examId'],
        orderBy,
      }),
    ]);

    return {
      data: response[1].map((exam) => new ExamToClinicEntity(exam as any)),
      count: response[0],
    };
  }

  async delete(id: number) {
    const examToClinic = await this.prisma.examToClinic.delete({
      where: { id },
    });

    return new ExamToClinicEntity(examToClinic);
  }
}
