import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../../../prisma/prisma.service';
import { PaginationQueryDto } from '../../../../shared/dto/pagination.dto';
import { prismaFilter } from '../../../../shared/utils/filters/prisma.filters';
import {
  CreateProfessionalResponsibleDto,
  FindProfessionalResponsibleDto,
  UpdateProfessionalResponsibleDto,
} from '../../dto/professional-responsible.dto';
import { ProfessionalResponsibleEntity } from '../../entities/professional-responsible.entity';

@Injectable()
export class ProfessionalResponsibleRepository {
  constructor(private prisma: PrismaService) {}

  async create(createCompanyDto: CreateProfessionalResponsibleDto) {
    const professionalResponsible = await this.prisma.professionalCouncilResponsible.create({
      data: createCompanyDto,
    });

    return new ProfessionalResponsibleEntity(professionalResponsible);
  }

  async update({ id, ...createCompanyDto }: UpdateProfessionalResponsibleDto) {
    const professionalResponsible = await this.prisma.professionalCouncilResponsible.update({
      data: createCompanyDto,
      where: { id },
    });

    return new ProfessionalResponsibleEntity(professionalResponsible);
  }

  async find(
    query: Partial<FindProfessionalResponsibleDto>,
    pagination: PaginationQueryDto,
    options: Prisma.ProfessionalCouncilResponsibleFindManyArgs = {},
  ) {
    const whereInit = {
      AND: [],
    } as typeof options.where;

    options.select = {
      id: true,
      startDate: true,
      type: true,
      professional: {
        select: {
          councilId: true,
          councilUF: true,
          councilType: true,
          professional: { select: { name: true, id: true } },
        },
      },
      ...options.select,
    };

    const { where } = prismaFilter(whereInit, {
      query,
      skip: ['search'],
    });

    if ('search' in query && query.search) {
      (where.AND as any).push({
        OR: [{ professional: { professional: { name: { contains: query.search, mode: 'insensitive' } } } }],
      } as typeof options.where);
      delete query.search;
    }

    const response = await this.prisma.$transaction([
      this.prisma.professionalCouncilResponsible.count({
        where,
      }),
      this.prisma.professionalCouncilResponsible.findMany({
        ...options,
        where,
        take: pagination.take || 20,
        skip: pagination.skip || 0,
        orderBy: { startDate: 'desc' },
      }),
    ]);

    return {
      data: response[1].map((professionalResponsible) => new ProfessionalResponsibleEntity(professionalResponsible)),
      count: response[0],
    };
  }

  async findNude(options: Prisma.ProfessionalCouncilResponsibleFindManyArgs = {}) {
    const professionalResponsible = await this.prisma.professionalCouncilResponsible.findMany({
      ...options,
    });

    return professionalResponsible.map(
      (professionalResponsible) => new ProfessionalResponsibleEntity(professionalResponsible),
    );
  }

  async findFirstNude(options: Prisma.ProfessionalCouncilResponsibleFindFirstArgs = {}) {
    const professionalResponsible = await this.prisma.professionalCouncilResponsible.findFirst({
      ...options,
    });

    return new ProfessionalResponsibleEntity(professionalResponsible);
  }

  async delete(id: number) {
    const professionalResponsible = await this.prisma.professionalCouncilResponsible.delete({
      where: { id },
    });

    return new ProfessionalResponsibleEntity(professionalResponsible);
  }
}
