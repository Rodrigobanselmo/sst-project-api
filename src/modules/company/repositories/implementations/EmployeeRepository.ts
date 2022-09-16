import { prismaFilter } from './../../../../shared/utils/filters/prisma.filters';
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
              status: 'ACTIVE',
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
              status: 'ACTIVE',
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
    options: Prisma.EmployeeFindManyArgs = {},
  ): Promise<EmployeeEntity> {
    const include = options?.include || {};

    const employee = await this.prisma.employee.findUnique({
      where: { id_companyId: { companyId, id } },
      include: {
        ...include,
        company: {
          select: {
            fantasy: true,
            name: true,
            cnpj: true,
            initials: true,
            blockResignationExam: true,
            primary_activity: true,
          },
        },
        hierarchy: !!include?.hierarchy
          ? false
          : { select: this.parentInclude() },
      },
    });

    return new EmployeeEntity(employee);
  }

  async find(
    query: Partial<FindEmployeeDto>,
    pagination: PaginationQueryDto,
    options: Prisma.EmployeeFindManyArgs = {},
  ) {
    const whereInit = {
      AND: [],
      ...options.where,
    } as typeof options.where;
    const select: Prisma.EmployeeSelect = {
      id: true,
      cpf: true,
      email: true,
      hierarchyId: true,
      name: true,
      companyId: true,
      status: true,
      ...options?.select,
    };

    if ('all' in query) {
      select.company = {
        select: { fantasy: true, name: true, cnpj: true, initials: true },
      };

      (whereInit.AND as any).push({
        OR: [
          { companyId: query.companyId, status: 'ACTIVE' },
          {
            company: {
              receivingServiceContracts: {
                some: { applyingServiceCompanyId: query.companyId },
              },
            },
            status: 'ACTIVE',
          },
        ],
      } as typeof options.where);
      delete query.companyId;
    }

    const { where } = prismaFilter(whereInit, {
      query,
      skip: ['search', 'hierarchySubOfficeId', 'all'],
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

      (where.AND as any).push({ OR } as typeof options.where);
      delete query.search;
    }

    if ('hierarchySubOfficeId' in query) {
      (where.AND as any).push({
        subOffices: { some: { id: query.hierarchySubOfficeId } },
      } as typeof options.where);
      delete query.hierarchySubOfficeId;
    }

    const response = await this.prisma.$transaction([
      this.prisma.employee.count({
        where,
      }),
      this.prisma.employee.findMany({
        ...options,
        select,
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

  async findCountNude(
    options: Prisma.EmployeeFindManyArgs = {},
    pagination: PaginationQueryDto,
  ) {
    const response = await this.prisma.$transaction([
      this.prisma.employee.count({
        where: options.where,
      }),
      this.prisma.employee.findMany({
        take: pagination.take || 20,
        skip: pagination.skip || 0,
        ...options,
      }),
    ]);

    return {
      data: response[1].map((employee) => new EmployeeEntity(employee)),
      count: response[0],
    };
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

  private parentInclude() {
    const objectSelect = (children?: any) => {
      return {
        parent: {
          ...(children && { select: { ...children } }),
        },
        id: true,
        name: true,
        parentId: true,
        status: true,
        type: true,
      } as Prisma.HierarchyFindManyArgs['select'];
    };

    return objectSelect(
      objectSelect(objectSelect(objectSelect(objectSelect()))),
    );
  }
}
