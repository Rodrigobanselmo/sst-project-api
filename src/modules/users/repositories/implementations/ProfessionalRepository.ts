import { PaginationQueryDto } from './../../../../shared/dto/pagination.dto';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../../../prisma/prisma.service';
import {
  CreateProfessionalDto,
  FindProfessionalsDto,
  UpdateProfessionalDto,
} from '../../dto/professional.dto';
import { ProfessionalEntity } from '../../entities/professional.entity';
import { UserEntity } from '../../entities/user.entity';
import { UserCompanyEntity } from '../../entities/userCompany.entity';

@Injectable()
export class ProfessionalRepository {
  constructor(private prisma: PrismaService) {}

  async create(
    data: CreateProfessionalDto,
    companyId: string,
    options: Partial<Prisma.ProfessionalCreateArgs> = {},
  ) {
    const professional = await this.prisma.professional.create({
      ...options,
      data: { ...data, companyId },
      include: { user: true, ...options.include },
    });

    return new ProfessionalEntity({
      ...professional,
      user: new UserEntity(professional.user),
    });
  }

  async update(
    { id, ...data }: UpdateProfessionalDto,
    companyId: string,
    options: Partial<Prisma.ProfessionalUpdateArgs> = {},
  ) {
    const professional = await this.prisma.professional.update({
      ...options,
      data: { ...data, companyId },
      where: { id_companyId: { id, companyId } },
      include: { user: true, ...options.include },
    });

    return new ProfessionalEntity({
      ...professional,
      user: new UserEntity(professional.user),
    });
  }

  async findByCompanyId(
    query: Partial<FindProfessionalsDto>,
    pagination: PaginationQueryDto,
    options: Prisma.ProfessionalFindManyArgs = {},
  ) {
    const companyId = query.companyId;
    delete query.companyId;

    const where = {
      AND: [
        {
          OR: [
            { companyId },
            {
              company: {
                applyingServiceContracts: {
                  some: { receivingServiceCompanyId: companyId },
                },
              },
            },
            {
              user: {
                OR: [
                  { companies: { some: { companyId, status: 'ACTIVE' } } },
                  {
                    companies: {
                      some: {
                        company: {
                          applyingServiceContracts: {
                            some: { receivingServiceCompanyId: companyId },
                          },
                        },
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
      ],
    } as typeof options.where;

    if ('search' in query) {
      (where.AND as any).push({
        OR: [{ name: { contains: query.search, mode: 'insensitive' } }],
      } as typeof options.where);
      delete query.search;
    }

    Object.entries(query).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        (where.AND as any).push({
          [key]: { in: value },
        } as typeof options.where);
      } else if (value) {
        (where.AND as any).push({
          [key]: {
            contains: value,
            mode: 'insensitive',
          },
        } as typeof options.where);
      }
    });

    const response = await this.prisma.$transaction([
      this.prisma.professional.count({
        where,
      }),
      this.prisma.professional.findMany({
        where,
        take: pagination.take || 10,
        skip: pagination.skip || 0,
        orderBy: { name: 'asc' },
        include: { user: true },
      }),
    ]);

    return {
      data: response[1].map(
        (prof) =>
          new ProfessionalEntity({ ...prof, user: new UserEntity(prof.user) }),
      ),
      count: response[0],
    };
  }
}
