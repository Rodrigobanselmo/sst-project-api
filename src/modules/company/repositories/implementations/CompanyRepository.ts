import { prismaFilter } from './../../../../shared/utils/filters/prisma.filters';
import { PaginationQueryDto } from './../../../../shared/dto/pagination.dto';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../prisma/prisma.service';
import { CreateCompanyDto, FindCompaniesDto, UpdateCompanyDto } from '../../dto/company.dto';
import { CompanyEntity } from '../../entities/company.entity';
import { ICompanyRepository } from '../ICompanyRepository.types';
import { v4 as uuidV4 } from 'uuid';
import { IPrismaOptions } from '../../../../shared/interfaces/prisma-options.types';
import { DocumentTypeEnum, Prisma } from '@prisma/client';
import { onlyNumbers } from '@brazilian-utils/brazilian-utils';
import { isEnvironment } from './CharacterizationRepository';

interface ICreateCompany extends CreateCompanyDto {
  companyId?: string;
}

@Injectable()
export class CompanyRepository implements ICompanyRepository {
  constructor(private prisma: PrismaService) {}

  async create({
    workspace = [],
    primary_activity = [],
    secondary_activity = [],
    license,
    address,
    companyId,
    doctorResponsibleId,
    tecResponsibleId,
    phone,
    email,
    // initials,
    ...createCompanyDto
  }: ICreateCompany): Promise<CompanyEntity> {
    const companyUUId = uuidV4();
    const isReceivingService = !!companyId;

    // if (!initials) {
    //   initials =
    //     (createCompanyDto.fantasy || createCompanyDto.name).slice(0, 1).toUpperCase() +
    //     Math.floor(Math.random() * 10) +
    //     Math.floor(Math.random() * 10) +
    //     Math.floor(Math.random() * 10);
    // }

    const company = await this.prisma.company.create({
      data: {
        id: companyUUId,
        ...createCompanyDto,
        doctorResponsible: doctorResponsibleId ? { connect: { id: doctorResponsibleId } } : undefined,
        tecResponsible: tecResponsibleId ? { connect: { id: tecResponsibleId } } : undefined,
        // initials,
        license:
          Object.keys(license).length === 0
            ? undefined
            : {
                connectOrCreate: {
                  create: { ...license, companyId: companyUUId },
                  where: { companyId: companyId || 'company not found' },
                },
              },
        receivingServiceContracts: isReceivingService
          ? {
              create: { applyingServiceCompanyId: companyId },
            }
          : undefined,
        address: address
          ? {
              create: { ...address },
            }
          : undefined,
        workspace: workspace
          ? {
              create: [
                ...workspace.map(({ id, address, ...work }) => ({
                  ...work,
                  address: { create: address },
                })),
              ],
            }
          : undefined,

        // TODO: should be connect only
        primary_activity: primary_activity
          ? {
              connectOrCreate: [
                ...primary_activity.map((activity) => ({
                  create: activity,
                  where: { code: activity.code },
                })),
              ],
            }
          : undefined,
        // TODO: should be connect only
        secondary_activity: secondary_activity
          ? {
              connectOrCreate: [
                ...secondary_activity.map((activity) => ({
                  create: activity,
                  where: { code: activity.code },
                })),
              ],
            }
          : undefined,
        contacts: {
          create: [{ email, phone, name: 'Contato principal', isPrincipal: true }],
        },
      },
      include: {
        workspace: { include: { address: true } },
        group: true,
        primary_activity: true,
        secondary_activity: true,
        license: true,
        address: true,
        doctorResponsible: { include: { professional: true } },
        tecResponsible: { include: { professional: true } },
      },
    });

    return new CompanyEntity(company);
  }

  async update(
    {
      secondary_activity = [],
      primary_activity = [],
      workspace = [],
      employees = [],
      users = [],
      address,
      companyId,
      doctorResponsibleId,
      tecResponsibleId,
      ...updateCompanyDto
    }: UpdateCompanyDto,
    options?: IPrismaOptions<{
      primary_activity?: boolean;
      secondary_activity?: boolean;
      workspace?: boolean;
      employees?: boolean;
      license?: boolean;
      users?: boolean;
    }>,
    prismaRef?: boolean,
  ) {
    const include = options?.include || {};
    if (primary_activity.length)
      await this.prisma.company.update({
        where: { id: companyId },
        data: { primary_activity: { set: [] } },
      });

    const companyPrisma = this.prisma.company.update({
      where: { id: companyId },
      data: {
        ...updateCompanyDto,
        doctorResponsible: doctorResponsibleId ? { connect: { id: doctorResponsibleId } } : undefined,
        tecResponsible: tecResponsibleId ? { connect: { id: tecResponsibleId } } : undefined,
        users: {
          upsert: [
            ...users.map(({ userId, ...user }) => {
              const { roles = [], permissions = [] } = user;
              return {
                create: { ...user, permissions, roles, userId },
                update: { ...user },
                where: {
                  companyId_userId: { companyId, userId },
                },
              };
            }),
          ],
        },
        employees: {
          //! edit employee
          upsert: [
            ...employees.map(({ id, hierarchyId, description, ghoDescription, realDescription, ...rest }: any) => {
              return {
                create: {
                  ...rest,
                  hierarchy: hierarchyId //! edit employee
                    ? {
                        connect: {
                          id_companyId: { companyId, id: hierarchyId },
                        },
                      }
                    : undefined,
                },
                update: {
                  ...rest,
                  hierarchy: hierarchyId
                    ? {
                        connect: {
                          id_companyId: { companyId, id: hierarchyId },
                        },
                      }
                    : undefined,
                },
                where: { cpf_companyId: { cpf: rest.cpf, companyId } },
              };
            }),
          ],
        },
        address: address ? { update: { ...address } } : undefined,
        workspace: {
          upsert: [
            ...workspace.map(({ id, address, companyJson, ...work }) => ({
              create: {
                ...work,
                address: { create: address },
                companyJson: companyJson || undefined,
              },
              update: {
                ...work,
                companyJson: companyJson || undefined,
                address: { update: address },
              },
              where: {
                id_companyId: {
                  companyId,
                  id: id || 'no-id',
                },
              },
            })),
          ],
        },
        // TODO: should be connect only
        primary_activity: {
          connectOrCreate: [
            ...primary_activity.map((activity) => ({
              create: activity,
              where: { code: activity.code },
            })),
          ],
        },
        secondary_activity: {
          connect: [...secondary_activity.map((activity) => ({ code: activity.code }))],
        },
      },
      include: {
        workspace: include.workspace ? { include: { address: true } } : false,
        primary_activity: !!include.primary_activity,
        secondary_activity: !!include.secondary_activity,
        license: !!include.license,
        users: !!include.users,
        doctorResponsible: { include: { professional: true } },
        tecResponsible: { include: { professional: true } },
        group: true,
        employees: !!include.employees ? true : false,
      },
    });

    // if (updateCompanyDto.phone || updateCompanyDto.email) {
    //   await this.prisma.contact.findFirst({
    //     where: { companyId, isPrincipal: true },
    //   });

    //   await this.prisma.contacts.update({
    //     where: { id: companyId },
    //   });
    // }

    if (prismaRef) return companyPrisma;

    return new CompanyEntity(await companyPrisma);
  }

  async updateApplyService(companyId: string, applyIds: string[]) {
    await this.prisma.contract.deleteMany({
      where: { receivingServiceCompanyId: companyId },
    });

    const contract = await this.prisma.contract.createMany({
      data: applyIds.map((id) => ({ receivingServiceCompanyId: companyId, applyingServiceCompanyId: id })),
    });

    return contract;
  }

  async upsertMany(
    updateCompanyDto: UpdateCompanyDto[],
    options?: IPrismaOptions<{
      primary_activity?: boolean;
      secondary_activity?: boolean;
      workspace?: boolean;
      employees?: boolean;
      license?: boolean;
      users?: boolean;
    }>,
  ): Promise<CompanyEntity[]> {
    const include = options?.include || {};

    const data = await this.prisma.$transaction(
      updateCompanyDto.map(({ secondary_activity = [], primary_activity = [], employees = [], workspace = [], address, id, users, ...upsertRiskDto }) =>
        this.prisma.company.upsert({
          where: { id: id || 'no-id' },
          create: {
            name: '',
            cnpj: '',
            fantasy: '',
            ...upsertRiskDto,
            workspace: {
              create: [
                ...workspace.map(({ id, address, ...work }) => ({
                  ...work,
                  address: { create: address },
                })),
              ],
            },
            primary_activity: {
              connect: [
                ...primary_activity.map((activity) => ({
                  code: activity.code,
                })),
              ],
            },
            secondary_activity: {
              connect: [
                ...secondary_activity.map((activity) => ({
                  code: activity.code,
                })),
              ],
            },
          },
          update: {
            ...upsertRiskDto,
            workspace: {
              upsert: [
                ...workspace.map(({ id, address, ...work }) => ({
                  create: {
                    ...work,
                    address: { create: address },
                  },
                  update: {
                    ...work,
                    address: { update: address },
                  },
                  where: {
                    id_companyId: {
                      companyId: upsertRiskDto.companyId,
                      id: id || 'no-id',
                    },
                  },
                })),
              ],
            },
            primary_activity: {
              connect: [
                ...primary_activity.map((activity) => ({
                  code: activity.code,
                })),
              ],
            },
            secondary_activity: {
              connect: [
                ...secondary_activity.map((activity) => ({
                  code: activity.code,
                })),
              ],
            },
          },
          include: {
            workspace: include.workspace ? { include: { address: true } } : false,
            primary_activity: !!include.primary_activity,
            secondary_activity: !!include.secondary_activity,
            license: !!include.license,
            users: !!include.users,
            group: true,
            doctorResponsible: { include: { professional: true } },
            tecResponsible: { include: { professional: true } },
            employees: !!include.employees ? true : false,
          },
        }),
      ),
    );

    return data.map((company) => new CompanyEntity(company));
  }

  async updateDisconnect({
    secondary_activity = [],
    primary_activity = [],
    workspace = [],
    employees = [],
    users = [],
    address,
    companyId,
    ...updateCompanyDto
  }: UpdateCompanyDto) {
    const company = await this.prisma.company.update({
      where: { id: companyId },
      data: {
        ...updateCompanyDto,
        users: {
          delete: [
            ...users.map(({ userId }) => ({
              companyId_userId: {
                companyId: companyId,
                userId,
              },
            })),
          ],
        },
        primary_activity: {
          disconnect: [...primary_activity.map((activity) => ({ code: activity.code }))],
        },
        secondary_activity: {
          disconnect: [...secondary_activity.map((activity) => ({ code: activity.code }))],
        },
      },
      include: {
        workspace: { include: { address: true } },
        primary_activity: true,
        secondary_activity: true,
        group: true,
        license: true,
        doctorResponsible: { include: { professional: true } },
        tecResponsible: { include: { professional: true } },
      },
    });

    return new CompanyEntity(company);
  }

  async findAllCompanyData(id: string, workspaceId: string, options?: Partial<Prisma.CompanyFindUniqueArgs>): Promise<CompanyEntity> {
    const company = (await this.prisma.company.findUnique({
      where: { id },
      ...options,
    })) as CompanyEntity;

    const employeeCount = await this.prisma.employee.count({
      where: {
        companyId: id, //! edit employee
        hierarchy: { workspaces: { some: { id: workspaceId } } },
      },
    });

    company.environments = [];
    if (company.characterization) {
      company.characterization.forEach((characterization) => {
        const isEnv = isEnvironment(characterization.type);
        if (isEnv) company.environments.push(characterization);
      });
    }

    return new CompanyEntity({ ...company, employeeCount });
  }

  async findAllRelatedByCompanyId(
    companyId: string | null,
    queryFind: FindCompaniesDto,
    pagination: PaginationQueryDto,
    options: Partial<Prisma.CompanyFindManyArgs> = { where: undefined },
  ) {
    const query = { isGroup: false, isClinic: false, ...queryFind };
    if (query.findAll) {
      delete query.isGroup;
      delete query.isClinic;
      delete query.findAll;
    }

    const whereInit = {
      AND: [
        ...(companyId
          ? [
              {
                OR: [
                  { id: companyId },
                  {
                    receivingServiceContracts: {
                      some: { applyingServiceCompanyId: companyId },
                    },
                  },
                  ...(query.isClinic ? [{ companiesToClinicAvailable: { some: { companyId } } }] : []),
                ],
                ...options?.where,
              },
            ]
          : []),
      ],
    } as typeof options.where;

    if (!options.orderBy)
      options.orderBy = [
        { status: 'asc' },
        {
          name: 'asc',
        },
      ];

    if (!options.select)
      options.select = {
        id: true,
        name: true,
        status: true,
        group: { select: { id: true, name: true } },
        cnpj: true,
        fantasy: true,
        initials: true,
        isConsulting: true,
        address: true,
      };

    const { where } = prismaFilter(whereInit, {
      query,
      skip: [
        'search',
        'userId',
        'groupId',
        'companiesIds',
        'clinicsCompanyId',
        'clinicExamsIds',
        'isPeriodic',
        'isChange',
        'isAdmission',
        'isReturn',
        'isDismissal',
        'findAll',
        'selectReport',
        'scheduleBlockId',
        'companyToClinicsId',
        'companiesGroupIds',
        'uf',
        'cities',
      ],
    });

    if ('search' in query) {
      const cnpj = onlyNumbers(query.search);
      (where.AND as any).push({
        OR: [
          { group: { name: { contains: query.search, mode: 'insensitive' } } },
          { name: { contains: query.search, mode: 'insensitive' } },
          { fantasy: { contains: query.search, mode: 'insensitive' } },
          { initials: { contains: query.search, mode: 'insensitive' } },

          ...(query.isClinic ? [{ address: { city: { contains: query.search, mode: 'insensitive' } } }] : []),
          ...(cnpj && cnpj.length == query.search.length ? [{ cnpj: { contains: onlyNumbers(query.search) } }] : []),
        ],
      } as typeof options.where);
    }

    if ('userId' in query) {
      (where.AND as any).push({
        users: { some: { userId: query.userId } },
      } as typeof options.where);
    }

    if ('scheduleBlockId' in query) {
      (where.AND as any).push({
        scheduleBlocks: { some: { id: query.scheduleBlockId } },
      } as typeof options.where);
    }

    if ('groupId' in query) {
      (where.AND as any).push({
        group: { id: query.groupId },
      } as typeof options.where);
    }

    if ('companiesIds' in query) {
      if (query.isClinic) {
        (where.AND as any).push({
          OR: [
            {
              companiesToClinicAvailable: { some: { companyId: { in: query.companiesIds } } },
            },
            {
              companiesToClinicAvailable: { some: { company: { companyGroup: { companies: { some: { id: { in: query.companiesIds } } } } } } },
            },
          ],
        } as typeof options.where);
      } else {
        (where.AND as any).push({
          id: { in: query.companiesIds },
        } as typeof options.where);
      }
    }

    if ('companiesGroupIds' in query) {
      (where.AND as any).push({
        ...(query.isClinic && { companiesToClinicAvailable: { some: { companyId: { in: query.companiesGroupIds } } } }),
        ...(!query.isClinic && { group: { companyGroup: { id: { in: query.companiesGroupIds } } } }),
      } as typeof options.where);
    }

    if ('cities' in query) {
      (where.AND as any).push({
        address: { city: { in: query.cities } },
      } as typeof options.where);
    }

    if ('uf' in query) {
      (where.AND as any).push({
        address: { state: { in: query.uf } },
      } as typeof options.where);
    }

    if ('clinicsCompanyId' in query) {
      (where.AND as any).push({
        clinicsAvailable: { some: { companyId: query.clinicsCompanyId } },
      } as typeof options.where);
    }

    if ('companyToClinicsId' in query) {
      (where.AND as any).push({
        OR: [
          {
            companiesToClinicAvailable: { some: { companyId: query.companyToClinicsId } },
          },
          {
            companiesToClinicAvailable: { some: { company: { companyGroup: { companies: { some: { id: query.companyToClinicsId } } } } } },
          },
        ],
      } as typeof options.where);
    }

    if ('clinicExamsIds' in query) {
      (where.AND as any).push({
        clinicExams: {
          some: {
            examId: { in: query.clinicExamsIds },
            ...('isPeriodic' in query && { isPeriodic: query?.isPeriodic }),
            ...('isChange' in query && { isChange: query?.isChange }),
            ...('isAdmission' in query && { isAdmission: query?.isAdmission }),
            ...('isReturn' in query && { isReturn: query?.isReturn }),
            ...('isDismissal' in query && { isDismissal: query?.isDismissal }),
          },
        },
      } as typeof options.where);
    }

    if ('selectReport' in query) {
      options.select.esocialStart = true;
      options.select.esocialSend = true;
      options.select.report = true;
      options.orderBy = [{ report: { esocialReject: 'desc' } }, { report: { esocialPendent: 'desc' } }];
    }

    const response = await this.prisma.$transaction([
      this.prisma.company.count({
        where,
      }),
      this.prisma.company.findMany({
        ...options,
        where,
        take: pagination.take || 20,
        skip: pagination.skip || 0,
      }),
    ]);

    //     workspace: { include: { address: true } },
    // group: true,
    // doctorResponsible: { include: { professional: true } },
    // tecResponsible: { include: { professional: true } },
    // address: true,
    // contacts: { where: { isPrincipal: true } },

    return {
      data: response[1].map((company) => new CompanyEntity(company)),
      count: response[0],
    };
  }

  async findAll(query: FindCompaniesDto, pagination: PaginationQueryDto, options: Partial<Prisma.CompanyFindManyArgs> = {}) {
    const whereInit = { AND: [] } as typeof options.where;

    if (query.findAll) {
      delete query.isGroup;
      delete query.isClinic;
      delete query.findAll;
    }

    const { where } = prismaFilter(whereInit, {
      query,
      skip: [
        'search',
        'userId',
        'groupId',
        'companiesIds',
        'clinicsCompanyId',
        'clinicExamsIds',
        'isPeriodic',
        'isChange',
        'isAdmission',
        'isReturn',
        'isDismissal',
        'findAll',
        'selectReport',
      ],
    });

    if ('search' in query) {
      const cnpj = onlyNumbers(query.search);
      (where.AND as any).push({
        OR: [
          { group: { name: { contains: query.search, mode: 'insensitive' } } },
          { name: { contains: query.search, mode: 'insensitive' } },
          { initials: { contains: query.search, mode: 'insensitive' } },
          { unit: { contains: query.search, mode: 'insensitive' } },
          ...(query.isClinic ? [{ address: { city: { contains: query.search, mode: 'insensitive' } } }] : []),
          ...(cnpj && cnpj.length == query.search.length ? [{ cnpj: { contains: onlyNumbers(query.search) } }] : []),
        ],
      } as typeof options.where);
    }

    if ('userId' in query) {
      (where.AND as any).push({
        users: { some: { userId: query.userId } },
      } as typeof options.where);
    }

    if ('groupId' in query) {
      (where.AND as any).push({
        group: { id: query.groupId },
      } as typeof options.where);
    }

    if ('companiesIds' in query) {
      (where.AND as any).push({
        id: { in: query.companiesIds },
      } as typeof options.where);
    }

    if ('clinicsCompanyId' in query) {
      (where.AND as any).push({
        clinicsAvailable: { some: { companyId: query.clinicsCompanyId } },
      } as typeof options.where);
    }

    if ('clinicExamsIds' in query) {
      (where.AND as any).push({
        clinicExams: {
          some: {
            examId: { in: query.clinicExamsIds },
            ...('isPeriodic' in query && { isPeriodic: query?.isPeriodic }),
            ...('isChange' in query && { isChange: query?.isChange }),
            ...('isAdmission' in query && { isAdmission: query?.isAdmission }),
            ...('isReturn' in query && { isReturn: query?.isReturn }),
            ...('isDismissal' in query && { isDismissal: query?.isDismissal }),
          },
        },
      } as typeof options.where);
    }

    if ('selectReport' in query) {
      options.select.esocialStart = true;
      options.select.esocialSend = true;
      options.select.report = true;
      options.orderBy = [{ report: { esocialReject: 'desc' } }, { report: { esocialPendent: 'desc' } }];
    }

    const response = await this.prisma.$transaction([
      this.prisma.company.count({
        where,
      }),
      this.prisma.company.findMany({
        ...options,
        where,
        ...(!options?.select && {
          include: {
            workspace: { include: { address: true } },
            doctorResponsible: { include: { professional: true } },
            group: true,
            tecResponsible: { include: { professional: true } },
            address: true,
            contacts: { where: { isPrincipal: true } },
            ...options?.include,
          },
        }),
        take: pagination.take || 20,
        skip: pagination.skip || 0,
        orderBy: { name: 'asc' },
      }),
    ]);

    return {
      data: response[1].map((company) => new CompanyEntity(company as any)),
      count: response[0],
    };
  }

  async findById(id: string, options?: Partial<Prisma.CompanyFindManyArgs>): Promise<CompanyEntity> {
    const include = options?.include || {};

    const employeeCount = await this.prisma.employee.count({
      where: { companyId: id, hierarchyId: { not: null } },
    });

    const riskGroupCount = await this.prisma.riskFactorGroupData.count({
      where: { companyId: id },
    });

    const hierarchyCount = await this.prisma.hierarchy.count({
      where: { companyId: id },
    });

    const homogenousGroupCount = await this.prisma.homogeneousGroup.count({
      where: { companyId: id },
    });

    const professionalCount = await this.prisma.professional.count({
      where: { companyId: id },
    });

    const examCount = await this.prisma.examToClinic.count({
      where: { companyId: id },
    });

    const usersCount = await this.prisma.userCompany.count({
      where: { companyId: id },
    });

    const company = await this.prisma.company.findUnique({
      where: { id },
      include: {
        employees: !!include.employees ? true : false,
        ...include,
        group: {
          include: {
            doctorResponsible: { include: { professional: true } },
            tecResponsible: { include: { professional: true } },
          },
        },
        primary_activity: !!include?.primary_activity,
        secondary_activity: !!include?.secondary_activity,
        workspace: !!include?.workspace ? { include: { address: true } } : false,
        address: true,
        doctorResponsible: { include: { professional: true } },
        tecResponsible: { include: { professional: true } },
      },
    });

    if (company?.workspace) {
      company.workspace = await Promise.all(
        company.workspace.map(async (workspace) => {
          const employeeCount = await this.prisma.employee.count({
            where: {
              OR: [
                //! edit employee
                { hierarchy: { workspaces: { some: { id: workspace.id } } } },
              ],
            },
          });

          return { ...workspace, employeeCount };
        }),
      );
    }

    return new CompanyEntity({
      ...company,
      employeeCount: employeeCount,
      riskGroupCount: riskGroupCount,
      homogenousGroupCount,
      hierarchyCount,
      professionalCount,
      examCount,
      usersCount,
    } as any);
  }

  async findNude(options: Prisma.CompanyFindManyArgs = {}) {
    const data = await this.prisma.company.findMany({
      ...options,
    });

    return data.map((data) => new CompanyEntity(data));
  }

  async findFirstNude(options: Prisma.CompanyFindFirstArgs = {}) {
    const data = await this.prisma.company.findFirst({
      ...options,
    });

    return new CompanyEntity(data);
  }

  async findDocumentData(companyId: string, options?: { workspaceId?: string; type?: DocumentTypeEnum }) {
    const workspaceId = options?.workspaceId;
    const type = options?.type;

    let company = (await this.prisma.company.findUnique({
      where: { id: companyId },
      include: {
        ...(workspaceId &&
          type && {
            documentData: {
              where: { workspaceId, type },
              include: {
                professionalsSignatures: {
                  include: { professional: { include: { professional: true } } },
                },
              },
            },
          }),
        primary_activity: true,
        address: true,
        covers: true,
        riskFactorGroupData: { select: { id: true } },
        receivingServiceContracts: {
          include: {
            applyingServiceCompany: {
              include: { address: true, covers: true },
            },
          },
        },
      },
    })) as CompanyEntity;

    company = new CompanyEntity({ ...company });

    if (workspaceId) {
      company.employeeCount = await this.prisma.employee.count({
        where: {
          companyId,
          hierarchy: { workspaces: { some: { id: workspaceId } } },
        },
      });
    }

    return company;
  }

  async countRelations(
    id: string,
    options?: {
      riskGroupCount?: boolean;
      hierarchyCount?: boolean;
      homogenousGroupCount?: boolean;
    },
  ) {
    const riskGroupCount = await this.prisma.riskFactorGroupData.count({
      where: { companyId: id },
    });

    const hierarchyCount = await this.prisma.hierarchy.count({
      where: { companyId: id },
    });

    const homogenousGroupCount = await this.prisma.homogeneousGroup.count({
      where: { companyId: id },
    });

    return {
      riskGroupCount: riskGroupCount,
      homogenousGroupCount,
      hierarchyCount,
    };
  }
}
