import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../../../prisma/prisma.service';
import { PaginationQueryDto } from '../../../../shared/dto/pagination.dto';

import { prismaFilter } from '../../../../shared/utils/filters/prisma.filters';
import { CidDto, FindCidDto } from '../../dto/cid.dto';
import { CidEntity } from '../../entities/cid.entity';
import { EmployeePPPHistoryEntity } from '../../entities/employee-ppp-history.entity';

const i = 0;

@Injectable()
export class EmployeePPPHistoryRepository {
  constructor(private prisma: PrismaService) {}

  async createManyNude(createData: Prisma.EmployeePPPHistoryCreateArgs['data'][], options?: Partial<Prisma.EmployeePPPHistoryCreateArgs>) {
    const data = await this.prisma.$transaction(
      createData.map((data) =>
        this.prisma.employeePPPHistory.create({
          data,
          select: { id: true },
        }),
      ),
    );

    return data.map((data) => new EmployeePPPHistoryEntity(data));
  }

  async findNude(options: Prisma.EmployeePPPHistoryFindManyArgs = {}) {
    const data = await this.prisma.employeePPPHistory.findMany({
      ...options,
    });

    return data.map((data) => new EmployeePPPHistoryEntity(data));
  }

  async findFirstNude(options: Prisma.EmployeePPPHistoryFindFirstArgs = {}) {
    const data = await this.prisma.employeePPPHistory.findFirst({
      ...options,
    });

    return new EmployeePPPHistoryEntity(data);
  }
}
