/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../../../prisma/prisma.service';
import { PaginationQueryDto } from '../../../../shared/dto/pagination.dto';
import {
  FindCompanyGroupDto,
  UpsertCompanyGroupDto,
} from '../../dto/company-group.dto';
import { CompanyGroupEntity } from '../../entities/company-group.entity';

@Injectable()
export class CompanyGroupRepository {
  constructor(private prisma: PrismaService) {}

  async upsert({
    id,
    companyId,
    companiesIds,
    doctorResponsibleId,
    ...data
  }: UpsertCompanyGroupDto) {
    const group = await this.prisma.companyGroup.upsert({
      update: {
        ...data,
        doctorResponsible: doctorResponsibleId
          ? { connect: { id: doctorResponsibleId } }
          : undefined,
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
        companies: companiesIds
          ? {
              connect: companiesIds.map((companyId) => ({
                id: companyId,
              })),
            }
          : undefined,
      } as any,
      where: { id_companyId: { id: id || 0, companyId } },
      include: { doctorResponsible: true },
    });

    return new CompanyGroupEntity(group);
  }

  async findById(
    id: number,
    companyId: string,
    options: Prisma.CompanyGroupFindFirstArgs = {},
  ) {
    const group = await this.prisma.companyGroup.findFirst({
      where: { companyId, id },
      include: { doctorResponsible: true },
      ...options,
    });

    return new CompanyGroupEntity(group);
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

    if ('search' in query) {
      (where.AND as any).push({
        OR: [{ name: { contains: query.search, mode: 'insensitive' } }],
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
        include: { doctorResponsible: true },
      }),
    ]);

    return {
      data: response[1].map((group) => new CompanyGroupEntity(group)),
      count: response[0],
    };
  }
}
