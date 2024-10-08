import { ExamEntity } from './../../../sst/entities/exam.entity';
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
import { PermissionCompanyEnum } from './../../../../shared/constants/enum/permissionsCompany';

/* eslint-disable @typescript-eslint/no-unused-vars */
@Injectable()
export class EmployeeRepository {
  constructor(private prisma: PrismaService) {}

  async create({
    hierarchyId,
    companyId,
    shiftId,
    cidIds,
    ...createCompanyDto
  }: CreateEmployeeDto & {
    hierarchyId?: string;
  }): Promise<EmployeeEntity> {
    try {
      const employee = await this.prisma.employee.create({
        data: {
          ...createCompanyDto,
          company: { connect: { id: companyId } },
          cids: { connect: cidIds.map((cidId) => ({ cid: cidId })) },
          hierarchy: hierarchyId ? { connect: { id: hierarchyId } } : undefined,
          shift: shiftId ? { connect: { id: shiftId } } : undefined,
        },
      });
      return new EmployeeEntity(employee);
    } catch (error) {
      if (error.code == 'P2002') throw new ConflictException(ErrorCompanyEnum.CPF_CONFLICT);
      throw new Error(error);
    }
  }

  async update(
    {
      hierarchyId,
      companyId,
      shiftId,
      cidIds,
      id,
      ...createCompanyDto
    }: UpdateEmployeeDto & {
      hierarchyId?: string;
    },
    removeSubOffices?: boolean,
  ): Promise<EmployeeEntity> {
    const employee = await this.prisma.employee.update({
      data: {
        ...createCompanyDto,
        hierarchy: hierarchyId ? { connect: { id: hierarchyId } } : undefined,
        subOffices: removeSubOffices ? { set: [] } : undefined,
        cids: cidIds ? { set: cidIds.map((cidId) => ({ cid: cidId })) } : undefined,
        shift: shiftId ? { connect: { id: shiftId } } : undefined,
        ...('lastExam' in createCompanyDto &&
          !createCompanyDto.lastExam && {
            lastExam: null,
          }),
      },
      where: { id_companyId: { companyId, id } },
    });

    return new EmployeeEntity(employee);
  }

  async upsertImport({
    cpf,
    birthday,
    companyId,
    cbo,
    name,
    email,
    esocialCode,
    lastExam,
    socialName,
    sex,
    phone,
    isPCD,
    cidIds,
    rg,
  }: UpdateEmployeeDto): Promise<EmployeeEntity> {
    const employee = await this.prisma.employee.upsert({
      create: {
        cpf,
        birthday,
        companyId,
        cbo,
        name,
        email,
        esocialCode,
        lastExam,
        socialName,
        sex,
        phone,
        isPCD,
        rg,
        cids: cidIds?.length ? { connect: cidIds.map((cidId) => ({ cid: cidId })) } : undefined,
        ...(cidIds.length && { isPCD: true }),
      },
      update: {
        cpf,
        birthday,
        companyId,
        cbo,
        name,
        email,
        esocialCode,
        lastExam,
        socialName,
        sex,
        phone,
        isPCD,
        rg,
        cids: cidIds ? { set: (cidIds || []).map((cidId) => ({ cid: cidId })) } : undefined,
        ...(cidIds.length && { isPCD: true }),
        ...(!cidIds.length && { isPCD: false }),
      },
      where: {
        cpf_companyId: { companyId, cpf },
      },
      select: {
        id: true,
        hierarchyHistory: true,
        cpf: true,
      },
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
      hierarchyId?: string;
      admissionDate?: Date;
    })[],
    companyId: string,
  ): Promise<EmployeeEntity[]> {
    const employeeHistory = await this.prisma.employeeHierarchyHistory.findMany({
      where: { hierarchy: { companyId } },
      include: { employee: true },
    });
    const data = await this.prisma.$transaction(
      upsertEmployeeMany.map(({ companyId: _, id, hierarchyId, shiftId, cbo, admissionDate, ...upsertEmployeeDto }) =>
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
            // cid: cidId
            //   ? {
            //       connect: { cid: cidId },
            //     }
            //   : undefined,
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
            ...(cbo && { cbo: onlyNumbers(cbo) }),
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
            // cid: cidId
            //   ? {
            //       connect: { cid: cidId },
            //     }
            //   : undefined,
            status: 'ACTIVE',
            ...(cbo && { cbo: onlyNumbers(cbo) }),
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

  async findById(
    id: number,
    companyId: string,
    options: Partial<Prisma.EmployeeFindUniqueArgs> = {},
  ): Promise<EmployeeEntity> {
    const include = options?.include || {};

    const employee = await this.prisma.employee.findUnique({
      ...options,
      where: { id_companyId: { companyId, id } },
      ...(!options.select && {
        include: {
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
          hierarchy: { select: { id: true, name: true } },
          subOffices: { select: { id: true, name: true } },
          hierarchyHistory: {
            select: {
              motive: true,
              startDate: true,
            },
            orderBy: { startDate: 'desc' },
            take: 1,
          },
          examsHistory: {
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
            distinct: ['status'],
            take: 3,
            orderBy: { doneDate: 'desc' },
          },
          cids: { select: { cid: true, description: true } },
          ...include,
        },
      }),
    });

    return new EmployeeEntity(employee as any);
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

    options.orderBy = {
      name: 'asc',
    };

    options.select = {
      id: true,
      cpf: true,
      rg: true,
      email: true,
      hierarchyId: true,
      name: true,
      companyId: true,
      lastExam: true,
      status: true,
      hierarchy: { select: { id: true, name: true, companyId: true } },
      hierarchyHistory: {
        select: {
          motive: true,
          startDate: true,
        },
        orderBy: { startDate: 'desc' },
        ...(query.dateFrom && {
          where: {
            startDate: {
              lte: query.dateFrom,
            },
          },
        }),
        take: 1,
      },
      ...options?.select,
    };

    if ('all' in query) {
      options.select.company = {
        select: {
          fantasy: true,
          name: true,
          cnpj: true,
          initials: true,
          permissions: true,
          ...(typeof options.select.company != 'boolean' &&
            options.select.company?.select &&
            options.select.company.select),
          ...(query?.getGroup && {
            unit: true,
            group: { select: { name: true } },
          }),
        },
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

    const { where } = prismaFilter(whereInit, {
      query,
      skip: [
        'search',
        'hierarchySubOfficeId',
        'lteExpiredDateExam',
        'all',
        'expiredExam',
        'companiesIds',
        'uf',
        'cities',
        'companiesGroupIds',
        `getAllExams`,
        'workspacesIds',
        'getAllHierarchyIds',
        'noPagination',
        'getAllExamsWithSchedule',
        'getSector',
        'getEsocialCode',
        'getGroup',
        'dateFrom',
        'dateFromExams',
        'getHierarchyIdFromScheduledExam',
        'scheduleMedicalVisitId',
        'getSocialName',
        'getExamName',
        'isSchedule',
        'getAllHierarchyNames',
        'getHierarchyDescription',
      ],
    });

    if ('search' in query && query.search) {
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

    if ('companiesIds' in query) {
      (where.AND as any).push({
        company: {
          id: { in: query.companiesIds },
        },
      } as typeof options.where);
    }

    if ('scheduleMedicalVisitId' in query) {
      (where.AND as any).push({
        examsHistory: {
          some: { scheduleMedicalVisitId: query.scheduleMedicalVisitId },
        },
      } as typeof options.where);
    }

    if ('workspacesIds' in query) {
      (where.AND as any).push({
        company: {
          workspace: {
            some: {
              id: { in: query.workspacesIds },
            },
          },
        },
      } as typeof options.where);
    }

    if ('companiesGroupIds' in query) {
      (where.AND as any).push({
        company: {
          group: { companyGroup: { id: { in: query.companiesGroupIds } } },
        },
      } as typeof options.where);
    }

    if ('cities' in query) {
      (where.AND as any).push({
        company: {
          address: { city: { in: query.cities } },
        },
      } as typeof options.where);
    }

    if ('uf' in query) {
      (where.AND as any).push({
        company: {
          address: { state: { in: query.uf } },
        },
      } as typeof options.where);
    }

    if ('isSchedule' in query && !query?.search && !!query?.all) {
      (where.AND as any).push({
        company: {
          permissions: { has: PermissionCompanyEnum.schedule },
        },
      } as typeof options.where);
    }

    if ('lteExpiredDateExam' in query) {
      (where.AND as any).push({
        OR: [
          {
            expiredDateExam: {
              lte: query.lteExpiredDateExam,
            },
          },
          { expiredDateExam: null },
        ],
      } as typeof options.where);
    }

    if ('getAllHierarchyIds' in query) {
      options.select.subOffices = { select: { id: true } };
      options.select.hierarchy = {
        select: {
          id: true,
          parent: {
            select: {
              id: true,
              parent: {
                select: {
                  id: true,
                  parent: {
                    select: {
                      id: true,
                      parent: { select: { id: true } },
                    },
                  },
                },
              },
            },
          },
        },
      };
    }

    if ('getAllHierarchyNames' in query) {
      options.select.subOffices = { select: { name: true } };
      options.select.hierarchy = {
        select: {
          name: true,
          type: true,
          parent: {
            select: {
              name: true,
              type: true,
              parent: {
                select: {
                  name: true,
                  type: true,
                  parent: {
                    select: {
                      name: true,
                      type: true,
                      parent: {
                        select: {
                          type: true,
                          name: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      };
    }

    if ('expiredExam' in query) {
      options.orderBy = [
        { expiredDateExam: { sort: 'asc', nulls: 'first' } },
        { company: { group: { name: 'asc' } } },
        { company: { name: 'asc' } },
        { name: 'asc' },
      ];
      options.select.expiredDateExam = true;
      options.select.newExamAdded = true;
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
        distinct: ['status'],
        take: 3,
        orderBy: { doneDate: 'desc' },
      };
    }

    if ('getSector' in query) {
      options.select.hierarchy = {
        select: {
          name: true,
          parent: { select: { name: true, type: true, parent: { select: { name: true, type: true } } } },
        },
      };
    }

    if ('getEsocialCode' in query) {
      options.select.esocialCode = true;
    }

    if ('getSocialName' in query) {
      options.select.socialName = true;
    }

    if ('getAllExams' in query) {
      options.orderBy = [
        { expiredDateExam: { sort: 'asc', nulls: 'first' } },
        { company: { group: { name: 'asc' } } },
        { company: { name: 'asc' } },
        { name: 'asc' },
      ];
      options.select.hierarchyId = true;
      options.select.lastExam = true;
      options.select.status = true;
      options.select.expiredDateExam = true;
      options.select.birthday = true;
      options.select.sex = true;
      options.select.subOffices = { select: { id: true } };
      options.select.hierarchyHistory = {
        take: 2,
        select: { startDate: true, motive: true, hierarchyId: true },
        orderBy: { startDate: 'desc' },
        ...(query.dateFrom && {
          where: {
            startDate: {
              lte: query.dateFrom,
            },
          },
        }),
      };
      options.select.examsHistory = {
        select: {
          doneDate: true,
          expiredDate: true,
          status: true,
          examType: true,
          evaluationType: true,
          hierarchyId: true,
          ...(query.getHierarchyIdFromScheduledExam && { subOfficeId: true }),
          validityInMonths: true,
          examId: true,
          exam: {
            select: { isAttendance: true },
          },
        },
        orderBy: { doneDate: 'desc' },
        distinct: ['examId', 'status'],
        where: {
          exam: { isAvaliation: false },
          ...(query.dateFromExams && { doneDate: { lte: query.dateFromExams } }),
          ...(!query.getAllExamsWithSchedule && { status: { in: ['DONE'] } }),
          ...(query.getAllExamsWithSchedule && {
            OR: [
              { status: { in: ['DONE'] } },
              {
                status: { in: ['PROCESSING'] },
                doneDate: { gte: new Date() },
                ...(query.dateFromExams && { doneDate: { lte: query.dateFromExams } }),
              },
            ],
          }),
        },
      };

      (where.AND as any).push({
        status: { not: 'CANCELED' },
        OR: [
          {
            skippedDismissalExam: false,
          },
          {
            skippedDismissalExam: null,
          },
        ],
      } as typeof options.where);
    }

    if ('getExamName' in query) {
      if (typeof options.select?.examsHistory != 'boolean' && options.select.examsHistory.select) {
        if (typeof options.select.examsHistory.select?.exam != 'boolean') {
          if (!options.select.examsHistory.select?.exam) options.select.examsHistory.select.exam = {};
          if (!options.select.examsHistory.select.exam?.select) options.select.examsHistory.select.exam.select = {};

          options.select.examsHistory.select.exam.select.name = true;
        }
      }
    }

    if ('getHierarchyDescription' in query) {
      if (typeof options.select?.hierarchy != 'boolean' && options.select.hierarchy.select) {
        options.select.hierarchy.select.description = true;
        options.select.hierarchy.select.realDescription = true;
      }
    }

    const response = await this.prisma.$transaction([
      this.prisma.employee.count({
        where,
      }),
      this.prisma.employee.findMany({
        ...(!query.noPagination && {
          take: pagination.take || 20,
          skip: pagination.skip || 0,
        }),
        ...options,
        where,
      }),
    ]);

    return {
      data: response[1].map((employee) => new EmployeeEntity(employee)),
      count: response[0],
      exams: [] as ExamEntity[],
    };
  }

  async findEvent2220(
    query: FindEvents2220Dto & { startDate: Date },
    pagination: PaginationQueryDto,
    options: Prisma.EmployeeFindManyArgs = {},
  ) {
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
                        every: {
                          OR: [
                            { id: { gt: 0 }, action: { not: 'EXCLUDE' } },
                            { id: { gt: 0 }, action: 'EXCLUDE', status: { in: ['INVALID', 'ERROR'] } },
                          ],
                        },
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
                    every: {
                      OR: [
                        { id: { gt: 0 }, action: { not: 'EXCLUDE' } },
                        { id: { gt: 0 }, action: 'EXCLUDE', status: { in: ['INVALID', 'ERROR'] } },
                      ],
                    },
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
              isAvaliation: true,
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

    if ('search' in query && query.search) {
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

  async findNude(options: Prisma.EmployeeFindManyArgs = {}, partial?: { skipNewExamAdded?: boolean }) {
    const employees = await this.prisma.employee.findMany({
      ...options,
    });

    return employees.map((employee) => new EmployeeEntity(employee, partial));
  }

  async findReloadEmployeeExamTime(
    data: { employeeIds: number[]; companyId: string },
    options: Prisma.EmployeeFindManyArgs = {},
    partial?: { skipNewExamAdded?: boolean },
  ) {
    const employees = await this.prisma.employee.findMany({
      ...options,
      where: {
        companyId: data.companyId,
        status: { not: 'CANCELED' },
        OR: [
          {
            skippedDismissalExam: false,
          },
          {
            skippedDismissalExam: null,
          },
        ],
        ...(data.employeeIds && { id: { in: data.employeeIds } }),
        ...options.where,
      },
      select: {
        id: true,
        lastExam: true,
        expiredDateExam: true,
        hierarchyId: true,
        newExamAdded: true,
        birthday: true,
        sex: true,
        rg: true,
        subOffices: { select: { id: true } },
        hierarchyHistory: {
          take: 1,
          select: { startDate: true },
          orderBy: { startDate: 'desc' },
          where: {
            motive: 'DEM',
          },
        },
        examsHistory: {
          select: {
            doneDate: true,
            expiredDate: true,
            status: true,
            evaluationType: true,
            validityInMonths: true,
          },
          where: {
            exam: { isAttendance: true },
            status: { in: ['DONE', 'PROCESSING', 'PENDING'] },
          },
          orderBy: { doneDate: 'desc' },
        },
        ...options.select,
      },
    });

    return employees.map((employee) => new EmployeeEntity(employee as any, partial));
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
