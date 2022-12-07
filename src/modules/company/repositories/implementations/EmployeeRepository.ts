import { onlyNumbers } from '@brazilian-utils/brazilian-utils';
import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../../../prisma/prisma.service';
import { ErrorCompanyEnum } from '../../../../shared/constants/enum/errorMessage';
import { PaginationQueryDto } from '../../../../shared/dto/pagination.dto';
import { CreateEmployeeDto, FindEmployeeDto, UpdateEmployeeDto } from '../../dto/employee.dto';
import { EmployeeEntity } from '../../entities/employee.entity';
import { prismaFilter } from './../../../../shared/utils/filters/prisma.filters';
import { FindEvents2220Dto } from './../../../esocial/dto/event.dto';

/* eslint-disable @typescript-eslint/no-unused-vars */
@Injectable()
export class EmployeeRepository {
  constructor(private prisma: PrismaService) {}

  async create({ workspaceIds, hierarchyId, companyId, shiftId, cidId, ...createCompanyDto }: CreateEmployeeDto): Promise<EmployeeEntity> {
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
      if (error.code == 'P2002') throw new ConflictException(ErrorCompanyEnum.CPF_CONFLICT);
      throw new Error(error);
    }
  }

  async update(
    { workspaceIds, hierarchyId, companyId, shiftId, cidId, id, ...createCompanyDto }: UpdateEmployeeDto,
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

  async updateNude(options: Prisma.EmployeeUpdateArgs) {
    const employee = await this.prisma.employee.update(options);

    return new EmployeeEntity(employee);
  }

  async upsertMany(
    upsertEmployeeMany: (CreateEmployeeDto & {
      id: number;
      admissionDate?: Date;
    })[],
    companyId: string,
  ): Promise<EmployeeEntity[]> {
    const employeeHistory = await this.prisma.employeeHierarchyHistory.findMany({ where: { hierarchy: { companyId } }, include: { employee: true } });
    const data = await this.prisma.$transaction(
      upsertEmployeeMany.map(({ companyId: _, id, workspaceIds, hierarchyId, shiftId, cidId, admissionDate, ...upsertEmployeeDto }) =>
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
                      id: employeeHistory.find(({ employee }) => employee.cpf === upsertEmployeeDto.cpf)?.id || -1,
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

  async findById(id: number, companyId: string, options: Partial<Prisma.EmployeeFindUniqueArgs> = {}): Promise<EmployeeEntity> {
    const include = options?.include || {};

    const employee = await this.prisma.employee.findUnique({
      ...options,
      where: { id_companyId: { companyId, id } },
      ...(!options.select && {
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
          hierarchy: !!include?.hierarchy ? false : { select: this.parentInclude() },
        },
      }),
    });

    return new EmployeeEntity(employee);
  }

  async find(query: Partial<FindEmployeeDto>, pagination: PaginationQueryDto, options: Prisma.EmployeeFindManyArgs = {}) {
    const whereInit = {
      AND: [],
      ...options.where,
    } as typeof options.where;

    options.orderBy = {
      name: 'asc',
    };

    options.select = {
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
      options.select.company = {
        select: { fantasy: true, name: true, cnpj: true, initials: true },
      };

      (whereInit.AND as any).push({
        OR: [
          {
            companyId: query.companyId,
            // , status: 'ACTIVE'
          },
          {
            company: {
              receivingServiceContracts: {
                some: { applyingServiceCompanyId: query.companyId },
              },
            },
            // status: 'ACTIVE',
          },
        ],
      } as typeof options.where);
      delete query.companyId;
    }

    if ('expiredExam' in query) {
      options.orderBy = [{ expiredDateExam: 'asc' }, { name: 'asc' }];
      options.select.expiredDateExam = true;
      options.select.examsHistory = {
        select: {
          status: true,
          id: true,
          doneDate: true,
          evaluationType: true,
          hierarchyId: true,
          subOfficeId: true,
          examType: true,
          expiredDate: true,
        },
        where: {
          exam: { isAttendance: true },
          status: { in: ['PENDING', 'PROCESSING', 'DONE'] },
        },
        take: 1,
        orderBy: { created_at: 'desc' },
      };
    }

    const { where } = prismaFilter(whereInit, {
      query,
      skip: ['search', 'hierarchySubOfficeId', 'all', 'expiredExam'],
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
        take: pagination.take || 20,
        skip: pagination.skip || 0,
        ...options,
        where,
      }),
    ]);

    return {
      data: response[1].map((employee) => new EmployeeEntity(employee)),
      count: response[0],
    };
  }

  async findEvent2220(query: FindEvents2220Dto & { startDate: Date }, pagination: PaginationQueryDto, options: Prisma.EmployeeFindManyArgs = {}) {
    const companyId = query.companyId;

    const whereInit = {
      AND: [
        {
          hierarchyHistory: { some: { id: { gt: 0 } } },
          examsHistory: {
            some: {
              doneDate: { gte: query.startDate },
              sendEvent: true,
              exam: { esocial27Code: { not: null } },
              OR: [
                { status: 'DONE' },
                {
                  status: 'CANCELED',
                  AND: [
                    {
                      events: {
                        every: { id: { gt: 0 }, action: { not: 'EXCLUDE' }, status: 'DONE' },
                      },
                    },
                    {
                      events: {
                        some: { id: { gt: 0 }, receipt: { not: null } },
                      },
                    },
                  ],
                },
              ],
            },
          },
        },
      ],
      ...options.where,
    } as typeof options.where;

    options.orderBy = {
      name: 'asc',
    };

    options.select = {
      id: true,
      companyId: true,
      cpf: true,
      esocialCode: true,
      examsHistory: {
        where: {
          doneDate: { gte: query.startDate },
          OR: [
            { status: 'DONE' },
            {
              status: 'CANCELED',
              AND: [
                {
                  events: {
                    every: { id: { gt: 0 }, action: { not: 'EXCLUDE' } },
                  },
                },
                {
                  events: {
                    some: { id: { gt: 0 }, receipt: { not: null } },
                  },
                },
              ],
            },
          ],
          exam: {
            AND: [{ esocial27Code: { not: null } }, { esocial27Code: { not: '' } }],
          },
        },
        orderBy: [{ doneDate: 'asc' }, { exam: { isAttendance: 'asc' } }],
        select: {
          id: true,
          examType: true,
          evaluationType: true,
          doneDate: true,
          status: true,
          employeeId: true,
          sendEvent: true,
          events: true,
          doctor: {
            include: { professional: { select: { name: true, cpf: true } } },
          },
          exam: {
            select: {
              id: true,
              isAttendance: true,
              esocial27Code: true,
              obsProc: true,
              name: true,
            },
          },
        },
      },
      ...options?.select,
    };

    if ('all' in query) {
      options.select.company = {
        select: { fantasy: true, name: true, cnpj: true, initials: true },
      };

      (whereInit.AND as any).push({
        OR: [
          { companyId: query.companyId, status: 'ACTIVE' },
          {
            company: {
              receivingServiceContracts: {
                some: { applyingServiceCompanyId: companyId },
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
      skip: ['search', 'companiesIds', 'startDate', 'all'],
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

    if ('companiesIds' in query) {
      (where.AND as any).push({
        companyId: { in: query.companiesIds },
      } as typeof options.where);
    }

    const response = await this.prisma.$transaction([
      this.prisma.employee.count({
        where,
      }),
      this.prisma.employee.findMany({
        take: pagination.take || 20,
        skip: pagination.skip || 0,
        ...options,
        where,
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

  async countNude(options: Prisma.EmployeeCountArgs = {}) {
    const employees = await this.prisma.employee.count({
      ...options,
    });

    return employees;
  }

  async findOnlyCountNude(options: Prisma.EmployeeFindManyArgs = {}) {
    const count = await this.prisma.employee.count({
      where: options.where,
    });

    return count;
  }

  async findCountNude(options: Prisma.EmployeeFindManyArgs = {}, pagination: PaginationQueryDto) {
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

  async disconnectSubOffices(employeesIds: number[], companyId: string): Promise<EmployeeEntity[]> {
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

  async disconnectUniqueSubOffice(employeeId: number, subOfficeId: string, companyId: string): Promise<EmployeeEntity> {
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

    return objectSelect(objectSelect(objectSelect(objectSelect(objectSelect()))));
  }
}
