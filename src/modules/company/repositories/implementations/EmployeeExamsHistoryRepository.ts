import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

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
  constructor(private prisma: PrismaService) {}

  async create(createData: CreateEmployeeExamHistoryDto) {
    const data = await this.prisma.employeeExamsHistory.create({
      data: createData,
    });

    return new EmployeeExamsHistoryEntity(data);
  }

  async update({ id, ...updateData }: UpdateEmployeeExamHistoryDto) {
    const data = await this.prisma.employeeExamsHistory.update({
      data: updateData,
      where: { id },
    });

    return new EmployeeExamsHistoryEntity(data);
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

  async delete(id: number) {
    const data = await this.prisma.employeeExamsHistory.delete({
      where: { id },
    });

    return new EmployeeExamsHistoryEntity(data);
  }
}
