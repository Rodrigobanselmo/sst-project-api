/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { v4 } from 'uuid';

import { PrismaService } from '../../../../prisma/prisma.service';
import { PaginationQueryDto } from '../../../../shared/dto/pagination.dto';
import { FindCompanyGroupDto, UpsertCompanyGroupDto } from '../../dto/company-group.dto';
import { CompanyGroupEntity } from '../../entities/company-group.entity';

@Injectable()
export class CompanyGroupRepository {
  constructor(private prisma: PrismaService) {}

  async upsert({ id, companyId, companiesIds, doctorResponsibleId, tecResponsibleId, ...data }: UpsertCompanyGroupDto) {
    const uuid = v4();
    const group = await this.prisma.companyGroup.upsert({
      update: {
        ...data,
        doctorResponsible: doctorResponsibleId ? { connect: { id: doctorResponsibleId } } : undefined,
        tecResponsible: tecResponsibleId ? { connect: { id: tecResponsibleId } } : undefined,
        companies: companiesIds
          ? {
              set: companiesIds.map((companyId) => ({
                id: companyId,
              })),
            }
          : undefined,
      },
      create: {
        ...data,
        companyId,
        doctorResponsibleId: doctorResponsibleId,
        tecResponsibleId: tecResponsibleId,
        companies: companiesIds
          ? {
              connect: companiesIds.map((companyId) => ({
                id: companyId,
              })),
            }
          : undefined,
        companyGroup: {
          create: {
            id: uuid,
            name: `(GRUPO EMPRESARIAL) ${data.name}`,
            isGroup: true,
            applyingServiceContracts: {
              createMany: {
                data: companiesIds.map((companyId) => ({
                  receivingServiceCompanyId: companyId,
                })),
              },
            },
            receivingServiceContracts: {
              createMany: { data: [{ applyingServiceCompanyId: companyId }] },
            },
          },
        },
      },
      where: { id_companyId: { id: id || 0, companyId } },
      include: {
        companyGroup: { select: { id: true, clinicsAvailable: true } },
        doctorResponsible: {
          include: {
            professional: {
              select: {
                name: true,
                id: true,
                type: true,
                cpf: true,
                userId: true,
                companyId: true,
                email: true,
                phone: true,
              },
            },
          },
        },
        tecResponsible: {
          include: {
            professional: {
              select: {
                name: true,
                id: true,
                type: true,
                cpf: true,
                userId: true,
                companyId: true,
                email: true,
                phone: true,
              },
            },
          },
        },
      },
    });

    return new CompanyGroupEntity(group as any);
  }

  async findById(id: number, companyId: string, options: Prisma.CompanyGroupFindFirstArgs = {}) {
    const group = await this.prisma.companyGroup.findFirst({
      where: { companyId, id },
      include: {
        companyGroup: { select: { id: true, clinicsAvailable: true } },
        doctorResponsible: {
          include: {
            professional: {
              select: {
                name: true,
                id: true,
                type: true,
                cpf: true,
                userId: true,
                companyId: true,
                email: true,
                phone: true,
              },
            },
          },
        },
        tecResponsible: {
          include: {
            professional: {
              select: {
                name: true,
                id: true,
                type: true,
                cpf: true,
                userId: true,
                companyId: true,
                email: true,
                phone: true,
              },
            },
          },
        },
      },
      ...options,
    });

    return new CompanyGroupEntity(group as any);
  }

  async findAvailable(
    companyId: string,
    query: Partial<FindCompanyGroupDto>,
    pagination: PaginationQueryDto,
    options: Prisma.CompanyGroupFindManyArgs = {},
  ) {
    const where = {
      AND: [{ companyId }],
    } as typeof options.where;

    options.select = {
      companyGroup: { select: { id: true, clinicsAvailable: true } },
      description: true,
      companyId: true,
      name: true,
      id: true,
      blockResignationExam: true,
      numAsos: true,
      esocialSend: true,
      esocialStart: true,
      doctorResponsibleId: true,
      tecResponsibleId: true,
      doctorResponsible: {
        include: {
          professional: {
            select: {
              name: true,
              id: true,
              type: true,
              cpf: true,
              userId: true,
              companyId: true,
              email: true,
              phone: true,
            },
          },
        },
      },
      tecResponsible: {
        include: {
          professional: {
            select: {
              name: true,
              id: true,
              type: true,
              cpf: true,
              userId: true,
              companyId: true,
              email: true,
              phone: true,
            },
          },
        },
      },
      ...options.select,
    };

    if ('search' in query && query.search) {
      (where.AND as any).push({
        OR: query.search.map((s) => ({
          name: {
            contains: s,
            mode: 'insensitive',
          },
        })),
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
      this.prisma.companyGroup.count({
        where,
      }),
      this.prisma.companyGroup.findMany({
        ...options,
        where,
        take: pagination.take || 20,
        skip: pagination.skip || 0,
        orderBy: { name: 'asc' },
      }),
    ]);

    return {
      data: response[1].map((group) => new CompanyGroupEntity(group)),
      count: response[0],
    };
  }
}
