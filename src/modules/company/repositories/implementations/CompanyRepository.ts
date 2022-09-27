import { prismaFilter } from './../../../../shared/utils/filters/prisma.filters';
import { PaginationQueryDto } from './../../../../shared/dto/pagination.dto';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../prisma/prisma.service';
import {
  CreateCompanyDto,
  FindCompaniesDto,
} from '../../dto/create-company.dto';
import { CompanyEntity } from '../../entities/company.entity';
import { ICompanyRepository } from '../ICompanyRepository.types';
import { v4 as uuidV4 } from 'uuid';
import { UpdateCompanyDto } from '../../dto/update-company.dto';
import { IPrismaOptions } from '../../../../shared/interfaces/prisma-options.types';
import { Prisma } from '@prisma/client';
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
    ...createCompanyDto
  }: ICreateCompany): Promise<CompanyEntity> {
    const companyUUId = uuidV4();
    const isReceivingService = !!companyId;
    const company = await this.prisma.company.create({
      data: {
        id: companyUUId,
        ...createCompanyDto,
        doctorResponsible: doctorResponsibleId
          ? { connect: { id: doctorResponsibleId } }
          : undefined,
        tecResponsible: tecResponsibleId
          ? { connect: { id: tecResponsibleId } }
          : undefined,
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
          create: [
            { email, phone, name: 'Contato principal', isPrincipal: true },
          ],
        },
      },
      include: {
        workspace: { include: { address: true } },
        group: true,
        primary_activity: true,
        secondary_activity: true,
        license: true,
        address: true,
        doctorResponsible: true,
        tecResponsible: true,
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
        doctorResponsible: doctorResponsibleId
          ? { connect: { id: doctorResponsibleId } }
          : undefined,
        tecResponsible: tecResponsibleId
          ? { connect: { id: tecResponsibleId } }
          : undefined,
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
            ...employees.map(
              ({
                id,
                hierarchyId,
                description,
                ghoDescription,
                realDescription,
                workspaceIds,
                ...rest
              }: any) => {
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
                    // workspaces: workspaceIds
                    //   ? {
                    //       connect: workspaceIds.map((workspaceId) => ({
                    //         id_companyId: { companyId, id: workspaceId },
                    //       })),
                    //     }
                    //   : undefined,
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
                    // workspaces: workspaceIds
                    //   ? {
                    //       set: workspaceIds.map((workspaceId) => ({
                    //         id_companyId: { companyId, id: workspaceId },
                    //       })),
                    //     }
                    //   : undefined,
                  },
                  where: { cpf_companyId: { cpf: rest.cpf, companyId } },
                  // cpf_esocialCode_companyId: {
                  //   cpf: rest.cpf,
                  //   esocialCode: rest.esocialCode,
                  //   companyId,
                  // },
                };
              },
            ),
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
          connect: [
            ...secondary_activity.map((activity) => ({ code: activity.code })),
          ],
        },
      },
      include: {
        workspace: include.workspace ? { include: { address: true } } : false,
        primary_activity: !!include.primary_activity,
        secondary_activity: !!include.secondary_activity,
        license: !!include.license,
        users: !!include.users,
        doctorResponsible: true,
        tecResponsible: true,
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
      updateCompanyDto.map(
        ({
          secondary_activity = [],
          primary_activity = [],
          employees = [],
          workspace = [],
          address,
          id,
          users,
          ...upsertRiskDto
        }) =>
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
              workspace: include.workspace
                ? { include: { address: true } }
                : false,
              primary_activity: !!include.primary_activity,
              secondary_activity: !!include.secondary_activity,
              license: !!include.license,
              users: !!include.users,
              group: true,
              doctorResponsible: true,
              tecResponsible: true,
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
          disconnect: [
            ...primary_activity.map((activity) => ({ code: activity.code })),
          ],
        },
        secondary_activity: {
          disconnect: [
            ...secondary_activity.map((activity) => ({ code: activity.code })),
          ],
        },
      },
      include: {
        workspace: { include: { address: true } },
        primary_activity: true,
        secondary_activity: true,
        group: true,
        license: true,
        doctorResponsible: true,
        tecResponsible: true,
      },
    });

    return new CompanyEntity(company);
  }

  async findByIdAll(
    id: string,
    workspaceId: string,
    options?: Partial<Prisma.CompanyFindUniqueArgs>,
  ): Promise<CompanyEntity> {
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
                  ...(query.isClinic
                    ? [{ companiesToClinicAvailable: { some: { companyId } } }]
                    : []),
                ],
                ...options?.where,
              },
            ]
          : []),
      ],
    } as typeof options.where;

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
      ],
    });

    if ('search' in query) {
      (where.AND as any).push({
        OR: [
          { group: { name: { contains: query.search, mode: 'insensitive' } } },
          { name: { contains: query.search, mode: 'insensitive' } },
          { fantasy: { contains: query.search, mode: 'insensitive' } },
          { initials: { contains: query.search, mode: 'insensitive' } },
          {
            cnpj: {
              contains: query.search ? onlyNumbers(query.search) || 'no' : '',
            },
          },
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

    const response = await this.prisma.$transaction([
      this.prisma.company.count({
        where,
      }),
      this.prisma.company.findMany({
        ...options,
        where,
        take: pagination.take || 20,
        skip: pagination.skip || 0,
        orderBy: { name: 'asc' },
      }),
    ]);

    //     workspace: { include: { address: true } },
    // group: true,
    // doctorResponsible: true,
    // tecResponsible: true,
    // address: true,
    // contacts: { where: { isPrincipal: true } },

    return {
      data: response[1].map((company) => new CompanyEntity(company)),
      count: response[0],
    };
  }

  async findAll(
    query: FindCompaniesDto,
    pagination: PaginationQueryDto,
    options: Partial<Prisma.CompanyFindManyArgs> = {},
  ) {
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
      ],
    });

    if ('search' in query) {
      (where.AND as any).push({
        OR: [
          { group: { name: { contains: query.search, mode: 'insensitive' } } },
          { name: { contains: query.search, mode: 'insensitive' } },
          { initials: { contains: query.search, mode: 'insensitive' } },
          { unit: { contains: query.search, mode: 'insensitive' } },
          {
            cnpj: {
              contains: query.search ? onlyNumbers(query.search) || 'no' : '',
            },
          },
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

    const response = await this.prisma.$transaction([
      this.prisma.company.count({
        where,
      }),
      this.prisma.company.findMany({
        ...options,
        where,
        include: {
          workspace: { include: { address: true } },
          group: true,
          doctorResponsible: true,
          tecResponsible: true,
          address: true,
          contacts: { where: { isPrincipal: true } },
          ...options?.include,
        },
        take: pagination.take || 20,
        skip: pagination.skip || 0,
        orderBy: { name: 'asc' },
      }),
    ]);

    return {
      data: response[1].map((company) => new CompanyEntity(company)),
      count: response[0],
    };
  }

  async findById(
    id: string,
    options?: Partial<Prisma.CompanyFindManyArgs>,
  ): Promise<CompanyEntity> {
    const include = options?.include || {};

    const employeeCount = await this.prisma.employee.count({
      where: { companyId: id },
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
        ...include,
        group: true,
        primary_activity: !!include?.primary_activity,
        secondary_activity: !!include?.secondary_activity,
        workspace: !!include?.workspace
          ? { include: { address: true } }
          : false,
        employees: !!include.employees ? true : false,
        address: true,
        doctorResponsible: true,
        tecResponsible: true,
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
    });
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
