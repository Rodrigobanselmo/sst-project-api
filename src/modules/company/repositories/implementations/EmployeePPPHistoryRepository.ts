import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../../../prisma/prisma.service';

import { EmployeePPPHistoryEntity } from '../../entities/employee-ppp-history.entity';

const i = 0;

@Injectable()
export class EmployeePPPHistoryRepository {
  constructor(private prisma: PrismaService) {}

  async createManyNude(
    createData: Prisma.EmployeePPPHistoryCreateArgs['data'][],
    options?: Partial<Prisma.EmployeePPPHistoryCreateArgs>,
  ) {
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

  async upsertManyNude(
    createData: Pick<Prisma.EmployeePPPHistoryUpsertArgs, 'create' | 'update' | 'where'>[],
    options?: Partial<Prisma.EmployeePPPHistoryUpsertArgs>,
  ) {
    const data = await this.prisma.$transaction(
      createData.map((data) =>
        this.prisma.employeePPPHistory.upsert({
          ...data,
          ...options,
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

  async updateManyNude(options: Prisma.EmployeePPPHistoryUpdateManyArgs) {
    const data = await this.prisma.employeePPPHistory.updateMany({
      ...options,
    });

    return data;
  }

  async findFirstNude(options: Prisma.EmployeePPPHistoryFindFirstArgs = {}) {
    const data = await this.prisma.employeePPPHistory.findFirst({
      ...options,
    });

    return new EmployeePPPHistoryEntity(data);
  }
}
