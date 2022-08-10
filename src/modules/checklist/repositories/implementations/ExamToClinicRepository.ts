import { prismaFilter } from './../../../../shared/utils/filters/prisma.filters';
import { PaginationQueryDto } from './../../../../shared/dto/pagination.dto';
import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../prisma/prisma.service';
import {
  FindExamToClinicDto,
  UpsertExamToClinicDto,
} from '../../dto/exam-to-clinic.dto';
import { ExamToClinicEntity } from '../../entities/examToClinic';
import { Prisma } from '@prisma/client';

@Injectable()
export class ExamToClinicRepository {
  constructor(private prisma: PrismaService) {}

  async upsert({
    examId,
    companyId,
    price,
    ...createExamToClinicDto
  }: UpsertExamToClinicDto): Promise<ExamToClinicEntity> {
    const examEntity = await this.prisma.examToClinic.upsert({
      create: {
        ...createExamToClinicDto,
        companyId,
        examId,
        pricings: price
          ? {
              create: {
                price,
                startDate: new Date(),
              },
            }
          : undefined,
      },
      update: {
        ...createExamToClinicDto,
      },
      where: { examId_companyId: { companyId, examId } },
    });

    return new ExamToClinicEntity(examEntity);
  }

  async update({
    examId,
    companyId,
    ...createExamToClinicDto
  }: UpsertExamToClinicDto): Promise<ExamToClinicEntity> {
    const ExamToClinic = await this.prisma.examToClinic.update({
      data: {
        ...createExamToClinicDto,
      },
      where: { examId_companyId: { companyId, examId } },
    });

    return new ExamToClinicEntity(ExamToClinic);
  }

  async find(
    query: Partial<FindExamToClinicDto>,
    pagination: PaginationQueryDto,
    options: Prisma.ExamToClinicFindManyArgs = {},
  ) {
    const whereInit = {
      AND: [],
    } as typeof options.where;

    const { where } = prismaFilter(whereInit, {
      query,
      skip: ['search'],
    });

    if ('search' in query) {
      (where.AND as any).push({
        OR: [
          { exam: { name: { contains: query.search, mode: 'insensitive' } } },
        ],
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
          pricings: { take: 1, orderBy: { startDate: 'desc' } },
          ...options?.include,
        },
        take: pagination.take || 20,
        skip: pagination.skip || 0,
        orderBy: { exam: { name: 'asc' } },
      }),
    ]);

    return {
      data: response[1].map((exam) => new ExamToClinicEntity(exam)),
      count: response[0],
    };
  }
}
