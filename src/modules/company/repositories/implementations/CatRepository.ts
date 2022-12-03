import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../../../prisma/prisma.service';
import { PaginationQueryDto } from '../../../../shared/dto/pagination.dto';
import { CreateCatDto, FindCatDto, UpdateCatDto } from '../../dto/cat.dto';

import { CatEntity } from '../../entities/cat.entity';
import { prismaFilter } from '../../../../shared/utils/filters/prisma.filters';

@Injectable()
export class CatRepository {
  constructor(private prisma: PrismaService) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async create({ companyId, ...createCompanyDto }: CreateCatDto) {
    const cat = await this.prisma.cat.create({
      data: createCompanyDto,
    });

    return new CatEntity(cat);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async update({ id, companyId, ...createCompanyDto }: UpdateCatDto) {
    const cat = await this.prisma.cat.update({
      data: createCompanyDto,
      where: { id },
    });

    return new CatEntity(cat);
  }

  async find(query: Partial<FindCatDto>, pagination: PaginationQueryDto, options: Prisma.CatFindManyArgs = {}) {
    const whereInit = {
      AND: [],
    } as typeof options.where;

    const { where } = prismaFilter(whereInit, {
      query,
      skip: ['search', 'companyId', 'companiesIds', 'onlyCompany', 'withReceipt'],
    });

    if (!options.select)
      options.select = {
        id: true,
        employeeId: true,
        hrAcid: true,
        houveAfast: true,
        dtAcid: true,
        employee: { select: { name: true, cpf: true, id: true, companyId: true, company: { select: { id: true, name: true, initials: true, fantasy: true } } } },
      };

    if ('search' in query) {
      (where.AND as any).push({
        OR: [{ employee: { name: { contains: query.search, mode: 'insensitive' } } }],
      } as typeof options.where);
      delete query.search;
    }

    if ('withReceipt' in query) {
      (where.AND as any).push({
        OR: [{ events: { some: { receipt: { not: null } } } }, { events: { every: { action: { not: 'EXCLUDE' } } } }],
      } as typeof options.where);
      delete query.search;
    }

    if ('companyId' in query) {
      (where.AND as any).push({
        employee: {
          OR: [
            {
              companyId: query.companyId,
            },
            ...(!query.onlyCompany
              ? [
                  {
                    company: {
                      receivingServiceContracts: {
                        some: { applyingServiceCompanyId: query.companyId },
                      },
                    },
                  },
                ]
              : []),
          ],
        },
      } as typeof options.where);
      delete query.companiesIds;
    }

    if ('companiesIds' in query) {
      (where.AND as any).push({
        companyId: { in: query.companiesIds },
      } as typeof options.where);
      delete query.companiesIds;
    }

    const response = await this.prisma.$transaction([
      this.prisma.cat.count({
        where,
      }),
      this.prisma.cat.findMany({
        ...options,
        where,
        take: pagination.take || 20,
        skip: pagination.skip || 0,
        orderBy: { dtAcid: 'desc' },
      }),
    ]);

    return {
      data: response[1].map((cat) => new CatEntity(cat)),
      count: response[0],
    };
  }

  async findNude(options: Prisma.CatFindManyArgs = {}) {
    const cats = await this.prisma.cat.findMany({
      ...options,
    });

    return cats.map((cat) => new CatEntity(cat));
  }

  async findById({ companyId, id }: { companyId: string; id: number }, options: Prisma.CatFindFirstArgs = {}) {
    const cat = await this.prisma.cat.findFirst({
      where: { id, employee: { companyId } },
      include: {
        cid: true,
        city: true,
        codParteAtingEsocial13: true,
        countryCodeEsocial6: true,
        doc: { select: { professional: true } },
        esocialAgntCausador: true,
        esocialLesao: true,
        esocialLograd: true,
        esocialSitGeradora: true,
        catOrigin: { select: { id: true, esocialSitGeradora: true, dtAcid: true } },
      },
      ...options,
    });

    return new CatEntity(cat as any);
  }

  async findFirstNude(options: Prisma.CatFindFirstArgs = {}) {
    const cat = await this.prisma.cat.findFirst({
      ...options,
    });

    return new CatEntity(cat);
  }

  async delete(id: number) {
    const cat = await this.prisma.cat.delete({
      where: { id },
    });

    return new CatEntity(cat);
  }
}
