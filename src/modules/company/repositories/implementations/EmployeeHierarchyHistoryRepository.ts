import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../../../prisma/prisma.service';
import { PaginationQueryDto } from '../../../../shared/dto/pagination.dto';
import { prismaFilter } from '../../../../shared/utils/filters/prisma.filters';
import {
  CreateEmployeeHierarchyHistoryDto,
  FindEmployeeHierarchyHistoryDto,
  UpdateEmployeeHierarchyHistoryDto,
} from '../../dto/employee-hierarchy-history';
import { EmployeeHierarchyHistoryEntity } from '../../entities/employee-hierarchy-history.entity';

@Injectable()
export class EmployeeHierarchyHistoryRepository {
  constructor(private prisma: PrismaService) {}

  async create(createData: CreateEmployeeHierarchyHistoryDto) {
    const data = await this.prisma.employeeHierarchyHistory.create({
      data: createData,
    });

    return new EmployeeHierarchyHistoryEntity(data);
  }

  async update({ id, ...updateData }: UpdateEmployeeHierarchyHistoryDto) {
    const data = await this.prisma.employeeHierarchyHistory.update({
      data: updateData,
      where: { id },
    });

    return new EmployeeHierarchyHistoryEntity(data);
  }

  async find(
    query: Partial<FindEmployeeHierarchyHistoryDto>,
    pagination: PaginationQueryDto,
    options: Prisma.EmployeeHierarchyHistoryFindManyArgs = {},
  ) {
    const whereInit = {
      AND: [
        {
          hierarchy: { companyId: query.companyId },
        },
      ],
    } as typeof options.where;

    const { where } = prismaFilter(whereInit, {
      query,
      skip: ['companyId'],
    });

    const response = await this.prisma.$transaction([
      this.prisma.employeeHierarchyHistory.count({
        where,
      }),
      this.prisma.employeeHierarchyHistory.findMany({
        ...options,
        where,
        take: pagination.take || 20,
        skip: pagination.skip || 0,
        orderBy: { startDate: 'desc' },
      }),
    ]);

    return {
      data: response[1].map((data) => new EmployeeHierarchyHistoryEntity(data)),
      count: response[0],
    };
  }

  async findNude(options: Prisma.EmployeeHierarchyHistoryFindManyArgs = {}) {
    const data = await this.prisma.employeeHierarchyHistory.findMany({
      ...options,
    });

    return data.map((data) => new EmployeeHierarchyHistoryEntity(data));
  }

  async findFirstNude(
    options: Prisma.EmployeeHierarchyHistoryFindFirstArgs = {},
  ) {
    const data = await this.prisma.employeeHierarchyHistory.findFirst({
      ...options,
    });

    return new EmployeeHierarchyHistoryEntity(data);
  }

  async delete(id: number) {
    const data = await this.prisma.employeeHierarchyHistory.delete({
      where: { id },
    });

    return new EmployeeHierarchyHistoryEntity(data);
  }
}
