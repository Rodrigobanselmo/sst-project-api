import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../../../prisma/prisma.service';
import { CompanyReportEntity } from '../../entities/report.entity';

@Injectable()
export class CompanyReportRepository {
  constructor(private prisma: PrismaService) {}

  async findNude(
    options: Prisma.CompanyReportFindManyArgs = {},
  ): Promise<CompanyReportEntity[]> {
    const reports = await this.prisma.companyReport.findMany(options);

    return reports.map((exam) => new CompanyReportEntity(exam));
  }

  async findFirstNude(
    options: Prisma.CompanyReportFindFirstArgs = {},
  ): Promise<CompanyReportEntity> {
    const report = await this.prisma.companyReport.findFirst(options);

    return new CompanyReportEntity(report);
  }
}
