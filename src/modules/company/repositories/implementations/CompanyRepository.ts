/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../prisma/prisma.service';
import { CreateCompanyDto } from '../../dto/create-company.dto';
import { CompanyEntity } from '../../entities/company.entity';
import { ICompanyRepository } from '../ICompanyRepository.types';
import { v4 as uuidV4 } from 'uuid';
import { UpdateCompanyDto } from '../../dto/update-company.dto';
import { IPrismaOptions } from '../../../../shared/interfaces/prisma-options.types';

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
    ...createCompanyDto
  }: ICreateCompany): Promise<CompanyEntity> {
    const companyUUId = uuidV4();
    const isReceivingService = !!companyId;
    const company = await this.prisma.company.create({
      data: {
        id: companyUUId,
        ...createCompanyDto,
        license: {
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
      },
      include: {
        workspace: { include: { address: true } },
        primary_activity: true,
        secondary_activity: true,
        license: true,
        address: true,
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
      license,
      companyId,
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

    const companyPrisma = this.prisma.company.update({
      where: { id: companyId },
      data: {
        ...updateCompanyDto,
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
          upsert: [
            ...employees.map(
              ({ id, hierarchyId, workplaceId, ...rest }: any) => {
                return {
                  create: {
                    ...rest,
                    hierarchy: hierarchyId
                      ? {
                          connect: {
                            id_companyId: { companyId, id: hierarchyId },
                          },
                        }
                      : undefined,
                    workplace: workplaceId
                      ? {
                          connect: {
                            id_companyId: { companyId, id: workplaceId },
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
                    workplace: workplaceId
                      ? {
                          connect: {
                            id_companyId: { companyId, id: workplaceId },
                          },
                        }
                      : undefined,
                  },
                  where: { id_companyId: { companyId, id: id || 'no-id' } },
                };
              },
            ),
          ],
        },
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
        employees: !!include.users,
      },
    });

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
          license,
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
              employees: !!include.users,
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
    license,
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
        license: true,
      },
    });

    return new CompanyEntity(company);
  }

  async findById(
    id: string,
    options?: IPrismaOptions<{
      primary_activity?: boolean;
      secondary_activity?: boolean;
      workspace?: boolean;
      employees?: boolean;
    }>,
  ): Promise<CompanyEntity> {
    const include = options?.include || {};

    const company = await this.prisma.company.findUnique({
      where: { id },
      include: {
        primary_activity: !!include?.primary_activity,
        secondary_activity: !!include?.secondary_activity,
        workspace: !!include?.workspace
          ? { include: { address: true } }
          : false,
        employees: !!include?.employees,
        address: true,
      },
    });

    return new CompanyEntity(company);
  }

  async findAllRelatedByCompanyId(
    companyId: string,
    options?: IPrismaOptions<{
      primary_activity?: boolean;
      secondary_activity?: boolean;
    }>,
  ): Promise<CompanyEntity[]> {
    const include = options?.include || {};

    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
      include: {
        primary_activity: !!include?.primary_activity,
        secondary_activity: !!include?.secondary_activity,
        workspace: { include: { address: true } },
      },
    });

    const companies = await this.prisma.contract.findMany({
      where: { applyingServiceCompanyId: companyId },
      include: {
        receivingServiceCompany: true,
      },
    });

    return [
      new CompanyEntity(company),
      ...companies.map(
        (applyingServiceCompany) =>
          new CompanyEntity(applyingServiceCompany.receivingServiceCompany),
      ),
    ];
  }

  async findAll(
    options?: IPrismaOptions<{
      primary_activity?: boolean;
      secondary_activity?: boolean;
    }>,
  ): Promise<CompanyEntity[]> {
    const include = options?.include || {};

    const companies = await this.prisma.company.findMany({
      include: {
        primary_activity: !!include?.primary_activity,
        secondary_activity: !!include?.secondary_activity,
        workspace: { include: { address: true } },
      },
    });

    return [...companies.map((company) => new CompanyEntity(company))];
  }
}
