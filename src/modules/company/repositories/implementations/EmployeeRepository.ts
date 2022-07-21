/* eslint-disable @typescript-eslint/no-unused-vars */
import { ConflictException, Injectable } from '@nestjs/common';
import { IPrismaOptions } from '../../../../shared/interfaces/prisma-options.types';
import { transformStringToObject } from '../../../../shared/utils/transformStringToObject';

import { PrismaService } from '../../../../prisma/prisma.service';
import {
  CreateEmployeeDto,
  FindEmployeeDto,
  UpdateEmployeeDto,
} from '../../dto/employee.dto';
import { EmployeeEntity } from '../../entities/employee.entity';
import { PaginationQueryDto } from '../../../../shared/dto/pagination.dto';
import { Prisma } from '@prisma/client';
import { ErrorCompanyEnum } from '../../../../shared/constants/enum/errorMessage';
import { onlyNumbers } from '@brazilian-utils/brazilian-utils';

@Injectable()
export class EmployeeRepository {
  constructor(private prisma: PrismaService) {}

  async create({
    workspaceIds,
    hierarchyId,
    companyId,
    ...createCompanyDto
  }: CreateEmployeeDto): Promise<EmployeeEntity> {
    const hierarchy = await this.prisma.hierarchy.findUnique({
      where: { id: hierarchyId },
      include: { workspaces: true },
    });

    try {
      const employee = await this.prisma.employee.create({
        data: {
          ...createCompanyDto,
          company: { connect: { id: companyId } },
          workspaces:
            hierarchy.workspaces.length > 0
              ? {
                  connect: hierarchy.workspaces.map((workspace) => ({
                    id_companyId: { companyId, id: workspace.id },
                  })),
                }
              : undefined,
          hierarchy: {
            connect: { id: hierarchyId },
          },
        },
      });
      return new EmployeeEntity(employee);
    } catch (error) {
      if (error.code == 'P2002')
        throw new ConflictException(ErrorCompanyEnum.CPF_CONFLICT);
      throw new Error(error);
    }
  }

  async update({
    workspaceIds,
    hierarchyId,
    companyId,
    id,
    ...createCompanyDto
  }: UpdateEmployeeDto): Promise<EmployeeEntity> {
    const hierarchy = hierarchyId
      ? await this.prisma.hierarchy.findUnique({
          where: { id: hierarchyId },
          include: { workspaces: true },
        })
      : undefined;

    const employee = await this.prisma.employee.update({
      data: {
        ...createCompanyDto,
        workspaces:
          hierarchy && hierarchy.workspaces.length > 0
            ? {
                connect: hierarchy.workspaces.map((workspace) => ({
                  id_companyId: { companyId, id: workspace.id },
                })),
              }
            : undefined,
        hierarchy: !hierarchyId
          ? undefined
          : {
              connect: { id: hierarchyId },
            },
      },
      where: { id_companyId: { companyId, id } },
    });

    return new EmployeeEntity(employee);
  }

  async upsertMany(
    upsertEmployeeMany: (CreateEmployeeDto & { id: number })[],
    companyId: string,
  ): Promise<EmployeeEntity[]> {
    const data = await this.prisma.$transaction(
      upsertEmployeeMany.map(
        ({
          companyId: _,
          id,
          workspaceIds,
          hierarchyId,
          ...upsertEmployeeDto
        }) =>
          this.prisma.employee.upsert({
            create: {
              ...upsertEmployeeDto,
              company: { connect: { id: companyId } },
              workspaces: {
                connect: workspaceIds.map((id) => ({
                  id_companyId: { companyId, id },
                })),
              },
              hierarchy: {
                connect: { id: hierarchyId },
              },
            },
            update: {
              ...upsertEmployeeDto,
              workspaces: !workspaceIds
                ? undefined
                : {
                    set: workspaceIds.map((id) => ({
                      id_companyId: { companyId, id },
                    })),
                  },
              hierarchy: !hierarchyId
                ? undefined
                : {
                    connect: { id: hierarchyId },
                  },
            },
            where: { id_companyId: { companyId, id: id || -1 } },
          }),
      ),
    );

    return data.map((employee) => new EmployeeEntity(employee));
  }

  async findById(
    id: number,
    companyId: string,
    options?: IPrismaOptions<{ hierarchy?: boolean; company?: string }>,
  ): Promise<EmployeeEntity> {
    const include = options?.include || {};

    const employee = await this.prisma.employee.findUnique({
      where: { id_companyId: { companyId, id } },
      include: {
        company: !!include?.company,
        hierarchy: !!include?.hierarchy
          ? false
          : {
              ...transformStringToObject(
                Array.from({ length: 6 })
                  .map(() => 'include.parent')
                  .join('.'),
                true,
              ),
            },
      },
    });

    return new EmployeeEntity(employee);
  }

  async findAllByCompany(
    query: Partial<FindEmployeeDto>,
    pagination: PaginationQueryDto,
    options: Prisma.EmployeeFindManyArgs = {},
  ) {
    const where = {
      AND: [],
    } as typeof options.where;

    if ('search' in query) {
      (where.AND as any).push({
        OR: [
          { name: { contains: query.search, mode: 'insensitive' } },
          {
            cpf: {
              contains: query.search ? onlyNumbers(query.search) || 'no' : '',
            },
          },
        ],
      } as typeof options.where);
      delete query.search;
    }

    Object.entries(query).forEach(([key, value]) => {
      if (value)
        (where.AND as any).push({
          [key]: {
            contains: value,
            mode: 'insensitive',
          },
        } as typeof options.where);
    });

    const response = await this.prisma.$transaction([
      this.prisma.employee.count({
        where,
      }),
      this.prisma.employee.findMany({
        ...options,
        where,
        take: pagination.take || 20,
        skip: pagination.skip || 0,
        orderBy: { name: 'asc' },
      }),
    ]);

    return {
      data: response[1].map((employee) => new EmployeeEntity(employee)),
      count: response[0],
    };
  }
}
