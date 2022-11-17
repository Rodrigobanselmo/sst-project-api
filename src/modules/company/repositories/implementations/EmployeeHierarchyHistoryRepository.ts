import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../../../prisma/prisma.service';
import { PaginationQueryDto } from '../../../../shared/dto/pagination.dto';
import { prismaFilter } from '../../../../shared/utils/filters/prisma.filters';
import { CreateEmployeeHierarchyHistoryDto, FindEmployeeHierarchyHistoryDto, UpdateEmployeeHierarchyHistoryDto } from '../../dto/employee-hierarchy-history';
import { EmployeeHierarchyHistoryEntity } from '../../entities/employee-hierarchy-history.entity';
import { transformStringToObject } from './../../../../shared/utils/transformStringToObject';

@Injectable()
export class EmployeeHierarchyHistoryRepository {
  constructor(private prisma: PrismaService) {}

  async create({ subOfficeId, ...createData }: CreateEmployeeHierarchyHistoryDto, employeeId: number, hierarchyId?: string | null) {
    const status = createData.motive === 'DEM' ? 'INACTIVE' : 'ACTIVE';

    const response = await this.prisma.$transaction([
      this.prisma.employeeHierarchyHistory.create({
        data: {
          ...createData,
          ...(subOfficeId && {
            subHierarchies: { connect: { id: subOfficeId } },
          }),
        },
      }),
      this.prisma.employee.update({
        data:
          hierarchyId !== undefined
            ? {
                hierarchyId,
                status,
                ...(subOfficeId && {
                  subOffices: { connect: { id: subOfficeId } },
                }),
                ...(!subOfficeId && {
                  subOffices: { set: [] },
                }),
              }
            : { status },
        where: { id: employeeId },
      }),
    ]);

    return new EmployeeHierarchyHistoryEntity(response[0]);
  }

  async update({ id, subOfficeId, ...updateData }: UpdateEmployeeHierarchyHistoryDto, employeeId: number, hierarchyId?: string | null) {
    const status = updateData.motive === 'DEM' ? 'INACTIVE' : 'ACTIVE';

    const response = await this.prisma.$transaction([
      this.prisma.employeeHierarchyHistory.update({
        data: {
          ...updateData,
          ...(subOfficeId && {
            subHierarchies: { connect: { id: subOfficeId } },
          }),
          ...(!subOfficeId && {
            subHierarchies: { set: [] },
          }),
        },
        where: { id },
      }),
      this.prisma.employee.update({
        data:
          hierarchyId !== undefined
            ? {
                hierarchyId,
                status,
                ...(subOfficeId && {
                  subOffices: { connect: { id: subOfficeId } },
                }),
                ...(!subOfficeId && {
                  subOffices: { set: [] },
                }),
              }
            : { status },
        where: { id: employeeId },
      }),
    ]);

    return new EmployeeHierarchyHistoryEntity(response[0]);
  }

  async find(query: Partial<FindEmployeeHierarchyHistoryDto>, pagination: PaginationQueryDto, options: Prisma.EmployeeHierarchyHistoryFindManyArgs = {}) {
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

    const optionsFind = transformStringToObject(
      Array.from({ length: 5 })
        .map(() => 'include.parent')
        .join('.'),
      true,
    );

    const response = await this.prisma.$transaction([
      this.prisma.employeeHierarchyHistory.count({
        where,
      }),
      this.prisma.employeeHierarchyHistory.findMany({
        ...options,
        where,
        take: pagination.take || 20,
        skip: pagination.skip || 0,
        include: {
          subHierarchies: { select: { id: true, name: true } },
          hierarchy: {
            include: {
              company: { select: { initials: true, name: true } },
              ...optionsFind.include,
            },
          },
        },
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

  async findFirstNude(options: Prisma.EmployeeHierarchyHistoryFindFirstArgs = {}) {
    const data = await this.prisma.employeeHierarchyHistory.findFirst({
      ...options,
    });

    return new EmployeeHierarchyHistoryEntity(data);
  }

  async delete(id: number, employeeId: number, hierarchyId?: string | null) {
    const response = await this.prisma.$transaction([
      this.prisma.employeeHierarchyHistory.delete({
        where: { id },
      }),
      this.prisma.employee.update({
        data: hierarchyId !== undefined ? { hierarchyId, status: 'ACTIVE' } : {},
        where: { id: employeeId },
      }),
    ]);

    return new EmployeeHierarchyHistoryEntity(response[0]);
  }
}
