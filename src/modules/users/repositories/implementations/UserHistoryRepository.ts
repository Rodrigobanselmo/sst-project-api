import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../../../prisma/prisma.service';
import { PaginationQueryDto } from '../../../../shared/dto/pagination.dto';

import { UserHistoryEntity } from '../../entities/userHistory.entity';
import { prismaFilter } from '../../../../shared/utils/filters/prisma.filters';
import { CreateUserHistoryDto, FindUserHistoryDto, UpdateUserHistoryDto } from '../../dto/user-history.dto';

@Injectable()
export class UserHistoryRepository {
  constructor(private prisma: PrismaService) { }

  async create(createCompanyDto: CreateUserHistoryDto) {
    const userHistory = await this.prisma.userHistory.create({
      data: createCompanyDto,
    });

    return new UserHistoryEntity(userHistory);
  }

  async update({ id, ...createCompanyDto }: UpdateUserHistoryDto) {
    const userHistory = await this.prisma.userHistory.update({
      data: { id, ...createCompanyDto },
      where: { id },
    });

    return new UserHistoryEntity(userHistory);
  }

  async findAllByCompany(query: Partial<FindUserHistoryDto>, pagination: PaginationQueryDto, options: Prisma.UserHistoryFindManyArgs = {}) {
    const whereInit = {
      AND: [
        // { companyId: query.companyId },
      ],
    } as typeof options.where;

    options.select = {
      id: true,
      city: true,
      country: true,
      ip: true,
      region: true,
      userAgent: true,
      created_at: true,
      updated_at: true,
      companyId: true,
      ...(!query.userId && {
        user: { select: { email: true, name: true, cpf: true } },
        company: { select: { name: true, fantasy: true, cnpj: true, id: true } },
      }),
    };


    const { where } = prismaFilter(whereInit, {
      query,
      skip: ['search'],
    });

    if ('search' in query && query.search) {
      (where.AND as any).push({
        ...(!query.userId && {
          OR: [
            { user: { email: { contains: query.search, mode: 'insensitive' } } },
            { user: { name: { contains: query.search, mode: 'insensitive' } } },
          ]
        })
      } as typeof options.where);
      delete query.search;
    }

    const response = await this.prisma.$transaction([
      this.prisma.userHistory.count({
        where,
      }),
      this.prisma.userHistory.findMany({
        ...options,
        orderBy: { created_at: 'desc' },
        where,
        take: pagination.take || 20,
        skip: pagination.skip || 0,
      }),
    ]);

    return {
      data: response[1].map((userHistory) => new UserHistoryEntity(userHistory)),
      count: response[0],
    };
  }

  async findNude(options: Prisma.UserHistoryFindManyArgs = {}) {
    const userHistorys = await this.prisma.userHistory.findMany({
      ...options,
    });

    return userHistorys.map((userHistory) => new UserHistoryEntity(userHistory));
  }

  async findFirstNude(options: Prisma.UserHistoryFindFirstArgs = {}) {
    const userHistory = await this.prisma.userHistory.findFirst({
      ...options,
    });

    return new UserHistoryEntity(userHistory);
  }

  async delete(id: number) {
    const userHistory = await this.prisma.userHistory.delete({
      where: { id },
    });

    return new UserHistoryEntity(userHistory);
  }
}
