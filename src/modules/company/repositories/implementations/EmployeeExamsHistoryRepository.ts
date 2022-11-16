import { onlyNumbers } from '@brazilian-utils/brazilian-utils';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../../../prisma/prisma.service';
import { PaginationQueryDto } from '../../../../shared/dto/pagination.dto';
import { DayJSProvider } from '../../../../shared/providers/DateProvider/implementations/DayJSProvider';
import { prismaFilter } from '../../../../shared/utils/filters/prisma.filters';
import { CreateEmployeeExamHistoryDto, FindEmployeeExamHistoryDto, UpdateEmployeeExamHistoryDto, UpdateManyScheduleExamDto } from '../../dto/employee-exam-history';
import { EmployeeExamsHistoryEntity } from '../../entities/employee-exam-history.entity';
import clone from 'clone';

@Injectable()
export class EmployeeExamsHistoryRepository {
  constructor(private prisma: PrismaService, private dayjs: DayJSProvider) {}

  async create({
    examsData = [],
    hierarchyId,
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
            hierarchyId,
            // isASO: true,
            expiredDate: this.dayjs
              .dayjs(createData.doneDate)
              .add(createData.validityInMonths || 0, 'months')
              .toDate(),
          },
        ].filter((i) => i),
        ...examsData.map((exam) => ({
          hierarchyId,
          employeeId: createData.employeeId,
          userDoneId: createData.userDoneId,
          userScheduleId: createData.userScheduleId,
          examType: createData.examType || undefined,
          expiredDate: this.dayjs
            .dayjs(exam.doneDate)
            .add(exam.validityInMonths || 0, 'months')
            .toDate(),
          ...exam,
        })),
      ],
    });

    return data;
  }

  async update({ id, examsData, hierarchyId, ...updateData }: UpdateEmployeeExamHistoryDto & { fileUrl?: string; sendEvent?: boolean }) {
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

  async updateMany(updateManyDto: Pick<UpdateManyScheduleExamDto, 'data'>) {
    const data = await this.prisma.$transaction(
      updateManyDto.data.map(({ id, examsData, hierarchyId, ...updateData }) =>
        this.prisma.employeeExamsHistory.update({
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
        }),
      ),
    );

    return data.map((data) => new EmployeeExamsHistoryEntity(data));
  }

  async updateManyNude(options: Prisma.EmployeeExamsHistoryUpdateManyArgs) {
    await this.prisma.employeeExamsHistory.updateMany(options);
  }

  async updateByIds(options: Prisma.EmployeeExamsHistoryUpdateManyArgs) {
    await this.prisma.employeeExamsHistory.updateMany({
      ...options,
    });
  }

  async find(
    query: Partial<FindEmployeeExamHistoryDto> & { userCompany?: string },
    pagination: PaginationQueryDto,
    { where: whereOptions, ...options }: Prisma.EmployeeExamsHistoryFindManyArgs = {},
  ) {
    const whereOptionsCopy = clone(whereOptions);
    const whereInit = {
      ...whereOptions,
      AND: [
        {
          employee: {
            companyId: query.companyId,
          },
          ...(!query.allCompanies && {
            employee: {
              companyId: query.companyId,
            },
          }),
          ...(query.allCompanies && {
            OR: [
              {
                employee: {
                  companyId: query.companyId,
                },
              },
              {
                employee: {
                  company: {
                    receivingServiceContracts: {
                      some: { applyingServiceCompanyId: query.companyId },
                    },
                  },
                },
              },
            ],
          }),
        },
        ...(whereOptionsCopy && (whereOptionsCopy as any)?.AND ? (whereOptionsCopy as any).AND : []),
      ],
    } as typeof whereOptions;

    const { where } = prismaFilter(whereInit, {
      query,
      skip: ['search', 'companyId', 'allCompanies', 'userCompany'],
    });

    if ('search' in query) {
      const OR = [];
      const CPF = onlyNumbers(query.search);
      const isCPF = CPF.length == 11;

      if (!isCPF) {
        OR.push({ name: { contains: query.search, mode: 'insensitive' } });
        OR.push({ email: { contains: query.search, mode: 'insensitive' } });
        OR.push({
          esocialCode: { contains: query.search, mode: 'insensitive' },
        });
      } else {
        OR.push({
          cpf: CPF,
        });
      }

      (where.AND as any).push({ employee: { OR } } as typeof whereOptions);
      delete query.search;
    }

    const response = await this.prisma.$transaction([
      options?.distinct
        ? this.prisma.employeeExamsHistory.findMany({
            where,
            ...(options?.distinct && { distinct: options.distinct }),
            select: { id: true },
            take: 1000,
          })
        : this.prisma.employeeExamsHistory.count({ where }),
      this.prisma.employeeExamsHistory.findMany({
        where,
        take: pagination.take || 20,
        skip: pagination.skip || 0,
        orderBy: [{ doneDate: 'desc' }, { exam: { isAttendance: 'desc' } }],
        ...options,
      }),
    ]);

    return {
      data: response[1].map((data) => new EmployeeExamsHistoryEntity(data)),
      count: Array.isArray(response[0]) ? response[0].length : response[0],
    };
  }

  async findNude(options: Prisma.EmployeeExamsHistoryFindManyArgs = {}) {
    const data = await this.prisma.employeeExamsHistory.findMany({
      ...options,
    });

    return data.map((data) => new EmployeeExamsHistoryEntity(data));
  }

  async countNude(options: Prisma.EmployeeExamsHistoryCountArgs = {}) {
    const data = await this.prisma.employeeExamsHistory.count({
      ...options,
    });

    return data;
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
