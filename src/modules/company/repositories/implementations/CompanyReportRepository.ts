import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../../../prisma/prisma.service';
import { UpsertCompanyReportDto } from '../../dto/company-report.dto';
import { CompanyReportEntity } from '../../entities/report.entity';

@Injectable()
export class CompanyReportRepository {
  constructor(private prisma: PrismaService) {}

  async upsert(
    { companyId, dailyReport, lastDailyReport }: UpsertCompanyReportDto,
    options: Partial<Prisma.CompanyReportUpsertArgs> = {},
  ) {
    const report = await this.prisma.companyReport.upsert({
      where: { companyId },
      create: { lastDailyReport, dailyReport: dailyReport as any, companyId },
      update: { lastDailyReport, dailyReport: dailyReport as any, companyId },
      ...options,
    });

    return new CompanyReportEntity(report);
  }

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

  async findAllGroupBy() {
    const report = await this.prisma.companyReport.groupBy({
      by: ['companyId'],
    });

    return report;
  }
}
