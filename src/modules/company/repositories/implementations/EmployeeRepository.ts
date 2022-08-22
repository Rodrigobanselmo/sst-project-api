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
    shiftId,
    cidId,
    ...createCompanyDto
  }: CreateEmployeeDto): Promise<EmployeeEntity> {
    try {
      const employee = await this.prisma.employee.create({
        data: {
          ...createCompanyDto,
          company: { connect: { id: companyId } },
          hierarchy: hierarchyId
            ? {
                connect: { id: hierarchyId },
              }
            : undefined,
          shift: shiftId
            ? {
                connect: { id: shiftId },
              }
            : undefined,
          cid: cidId
            ? {
                connect: { cid: cidId },
              }
            : undefined,
        },
      });
      return new EmployeeEntity(employee);
    } catch (error) {
      if (error.code == 'P2002')
        throw new ConflictException(ErrorCompanyEnum.CPF_CONFLICT);
      throw new Error(error);
    }
  }

  async update(
    {
      workspaceIds,
      hierarchyId,
      companyId,
      shiftId,
      cidId,
      id,
      ...createCompanyDto
    }: UpdateEmployeeDto,
    removeSubOffices?: boolean,
  ): Promise<EmployeeEntity> {
    const employee = await this.prisma.employee.update({
      data: {
        ...createCompanyDto,
        hierarchy: !hierarchyId
          ? undefined
          : {
              connect: { id: hierarchyId },
            },
        subOffices: removeSubOffices ? { set: [] } : undefined,
        shift: shiftId
          ? {
              connect: { id: shiftId },
            }
          : undefined,
        cid: cidId
          ? {
              connect: { cid: cidId },
            }
          : undefined,
      },
      where: { id_companyId: { companyId, id } },
    });

    return new EmployeeEntity(employee);
  }

  async upsertMany(
    upsertEmployeeMany: (CreateEmployeeDto & {
      id: number;
      admissionDate?: Date;
    })[],
    companyId: string,
  ): Promise<EmployeeEntity[]> {
    const employeeHistory = await this.prisma.employeeHierarchyHistory.findMany(
      { where: { hierarchy: { companyId } }, include: { employee: true } },
    );

    const data = await this.prisma.$transaction(
      upsertEmployeeMany.map(
        ({
          companyId: _,
          id,
          workspaceIds,
          hierarchyId,
          shiftId,
          cidId,
          admissionDate,
          ...upsertEmployeeDto
        }) =>
          this.prisma.employee.upsert({
            create: {
              ...upsertEmployeeDto,
              company: { connect: { id: companyId } },
              hierarchy: hierarchyId
                ? {
                    connect: { id: hierarchyId },
                  }
                : undefined,
              shift: shiftId
                ? {
                    connect: { id: shiftId },
                  }
                : undefined,
              cid: cidId
                ? {
                    connect: { cid: cidId },
                  }
                : undefined,
              hierarchyHistory: hierarchyId
                ? {
                    create: {
                      motive: 'ADM',
                      startDate: admissionDate,
                      hierarchyId: hierarchyId,
                    },
                  }
                : undefined,
            },
            update: {
              ...upsertEmployeeDto,
              hierarchy: !hierarchyId
                ? undefined
                : {
                    connect: { id: hierarchyId },
                  },
              shift: shiftId
                ? {
                    connect: { id: shiftId },
                  }
                : undefined,
              cid: cidId
                ? {
                    connect: { cid: cidId },
                  }
                : undefined,
              hierarchyHistory: hierarchyId
                ? {
                    upsert: {
                      where: {
                        id:
                          employeeHistory.find(
                            ({ employee }) =>
                              employee.cpf === upsertEmployeeDto.cpf,
                          )?.id || -1,
                      },
                      create: {
                        motive: 'ADM',
                        startDate: admissionDate,
                        hierarchyId: hierarchyId,
                      },
                      update: {
                        motive: 'ADM',
                        startDate: admissionDate,
                        hierarchyId: hierarchyId,
                      },
                    },
                  }
                : undefined,
            },
            where: { cpf_companyId: { companyId, cpf: upsertEmployeeDto.cpf } },
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

    if ('hierarchySubOfficeId' in query) {
      (where.AND as any).push({
        subOffices: { some: { id: query.hierarchySubOfficeId } },
      } as typeof options.where);
      delete query.hierarchySubOfficeId;
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

  async findNude(options: Prisma.EmployeeFindManyArgs = {}) {
    const employees = await this.prisma.employee.findMany({
      ...options,
    });

    return employees.map((employee) => new EmployeeEntity(employee));
  }

  async findFirstNude(options: Prisma.EmployeeFindFirstArgs = {}) {
    const employee = await this.prisma.employee.findFirst({
      ...options,
    });

    return new EmployeeEntity(employee);
  }

  async disconnectSubOffices(
    employeesIds: number[],
    companyId: string,
  ): Promise<EmployeeEntity[]> {
    const response = await this.prisma.$transaction([
      ...employeesIds.map((id) => {
        return this.prisma.employee.update({
          data: {
            subOffices: { set: [] },
          },
          where: { id_companyId: { companyId, id } },
        });
      }),
    ]);

    return response.map((employee) => new EmployeeEntity(employee));
  }

  async disconnectUniqueSubOffice(
    employeeId: number,
    subOfficeId: string,
    companyId: string,
  ): Promise<EmployeeEntity> {
    const employee = await this.prisma.employee.update({
      data: {
        subOffices: { disconnect: { id: subOfficeId } },
      },
      where: { id_companyId: { companyId, id: employeeId } },
    });

    return new EmployeeEntity(employee);
  }
}
