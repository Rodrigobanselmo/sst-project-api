import { Injectable } from '@nestjs/common';
import { Prisma, StatusEnum } from '@prisma/client';
import { DayJSProvider } from '../../../../shared/providers/DateProvider/implementations/DayJSProvider';

import { PrismaService } from '../../../../prisma/prisma.service';
import { PaginationQueryDto } from '../../../../shared/dto/pagination.dto';

import { prismaFilter } from '../../../../shared/utils/filters/prisma.filters';
import {
  CreateEmployeeExamHistoryDto,
  FindEmployeeExamHistoryDto,
  UpdateEmployeeExamHistoryDto,
} from '../../dto/employee-exam-history';
import { EmployeeExamsHistoryEntity } from '../../entities/employee-exam-history.entity';

@Injectable()
export class EmployeeExamsHistoryRepository {
  constructor(private prisma: PrismaService, private dayjs: DayJSProvider) {}

  async create({
    examsData = [],
    ...createData
  }: CreateEmployeeExamHistoryDto & {
    userDoneId?: number;
    userScheduleId?: number;
  }) {
    const data = await this.prisma.employeeExamsHistory.createMany({
      data: [
        ...[
          createData.examId && {
            ...createData,
            isScheduleMain: true,
            expiredDate: this.dayjs
              .dayjs(createData.doneDate)
              .add(createData.validityInMonths || 0, 'months')
              .toDate(),
          },
        ].filter((i) => i),
        ...examsData.map((exam, index) => ({
          employeeId: createData.employeeId,
          userDoneId: createData.userDoneId,
          userScheduleId: createData.userScheduleId,
          examType: createData.examType || undefined,
          expiredDate: this.dayjs
            .dayjs(exam.doneDate)
            .add(exam.validityInMonths || 0, 'months')
            .toDate(),
          ...exam,
          ...(!createData.examId &&
            index === 0 && {
              isScheduleMain: true,
            }),
        })),
      ],
    });

    return data;
  }

  async update({
    id,
    examsData,
    hierarchyId,
    ...updateData
  }: UpdateEmployeeExamHistoryDto) {
    const data = await this.prisma.employeeExamsHistory.update({
      data: {
        ...updateData,
        expiredDate:
          updateData.validityInMonths && updateData.doneDate
            ? this.dayjs
                .dayjs(updateData.doneDate)
                .add(updateData.validityInMonths || 0, 'months')
                .toDate()
            : undefined,
      },
      where: { id },
    });

    return new EmployeeExamsHistoryEntity(data);
  }

  async updateByIds(options: Prisma.EmployeeExamsHistoryUpdateManyArgs) {
    await this.prisma.employeeExamsHistory.updateMany({
      ...options,
    });
  }

  async find(
    query: Partial<FindEmployeeExamHistoryDto>,
    pagination: PaginationQueryDto,
    options: Prisma.EmployeeExamsHistoryFindManyArgs = {},
  ) {
    const whereInit = {
      AND: [
        {
          employee: {
            hierarchy: { companyId: query.companyId },
          },
        },
      ],
    } as typeof options.where;

    const { where } = prismaFilter(whereInit, {
      query,
      skip: ['companyId'],
    });

    const response = await this.prisma.$transaction([
      this.prisma.employeeExamsHistory.count({
        where,
      }),
      this.prisma.employeeExamsHistory.findMany({
        ...options,
        include: {
          exam: { select: { isAttendance: true, id: true, name: true } },
          userDone: { select: { email: true, name: true } },
          userSchedule: { select: { email: true, name: true } },
          ...options.include,
        },
        where,
        take: pagination.take || 20,
        skip: pagination.skip || 0,
        orderBy: { doneDate: 'desc' },
      }),
    ]);

    return {
      data: response[1].map((data) => new EmployeeExamsHistoryEntity(data)),
      count: response[0],
    };
  }

  async findNude(options: Prisma.EmployeeExamsHistoryFindManyArgs = {}) {
    const data = await this.prisma.employeeExamsHistory.findMany({
      ...options,
    });

    return data.map((data) => new EmployeeExamsHistoryEntity(data));
  }

  async findFirstNude(options: Prisma.EmployeeExamsHistoryFindFirstArgs = {}) {
    const data = await this.prisma.employeeExamsHistory.findFirst({
      ...options,
    });

    return new EmployeeExamsHistoryEntity(data);
  }

  async findUniqueNude(options: Prisma.EmployeeExamsHistoryFindUniqueArgs) {
    const data = await this.prisma.employeeExamsHistory.findUnique({
      ...options,
    });

    return new EmployeeExamsHistoryEntity(data);
  }

  async delete(id: number) {
    const data = await this.prisma.employeeExamsHistory.delete({
      where: { id },
    });

    return new EmployeeExamsHistoryEntity(data);
  }
}
