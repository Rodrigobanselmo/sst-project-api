import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../../../prisma/prisma.service';
import { PaginationQueryDto } from '../../../../shared/dto/pagination.dto';

import { prismaFilter } from '../../../../shared/utils/filters/prisma.filters';
import { CreateCompanyShiftDto, FindCompanyShiftDto, UpdateCompanyShiftDto } from '../../dto/company-shift.dto';
import { CompanyShiftEntity } from '../../entities/company-shift.entity';

@Injectable()
export class CompanyShiftRepository {
  constructor(private prisma: PrismaService) {}

  async create(createData: CreateCompanyShiftDto) {
    const data = await this.prisma.companyShift.create({
      data: createData,
    });

    return new CompanyShiftEntity(data);
  }

  async update({ id, companyId, ...updateData }: UpdateCompanyShiftDto) {
    const data = await this.prisma.companyShift.update({
      data: updateData,
      where: { id_companyId: { companyId, id } },
    });

    return new CompanyShiftEntity(data);
  }

  async find(query: Partial<FindCompanyShiftDto>, pagination: PaginationQueryDto, options: Prisma.CompanyShiftFindManyArgs = {}) {
    const whereInit = {
      AND: [],
    } as typeof options.where;

    const { where } = prismaFilter(whereInit, {
      query,
      skip: [],
    });

    const response = await this.prisma.$transaction([
      this.prisma.companyShift.count({
        where,
      }),
      this.prisma.companyShift.findMany({
        ...options,
        where,
        take: pagination.take || 20,
        skip: pagination.skip || 0,
        orderBy: { name: 'asc' },
      }),
    ]);

    return {
      data: response[1].map((data) => new CompanyShiftEntity(data)),
      count: response[0],
    };
  }

  async findNude(options: Prisma.CompanyShiftFindManyArgs = {}) {
    const data = await this.prisma.companyShift.findMany({
      ...options,
    });

    return data.map((data) => new CompanyShiftEntity(data));
  }

  async findFirstNude(options: Prisma.CompanyShiftFindFirstArgs = {}) {
    const data = await this.prisma.companyShift.findFirst({
      ...options,
    });

    return new CompanyShiftEntity(data);
  }

  async delete(id: number) {
    const data = await this.prisma.companyShift.delete({
      where: { id },
    });

    return new CompanyShiftEntity(data);
  }
}
