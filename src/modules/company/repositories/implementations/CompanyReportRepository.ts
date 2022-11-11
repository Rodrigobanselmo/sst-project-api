import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../../../prisma/prisma.service';
import {
  DailyCompanyReportDto,
  UpsertCompanyReportDto,
} from '../../dto/company-report.dto';
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

  async updateESocial(
    companyId: string,
    removePending = 0,
    options: Partial<Prisma.CompanyReportUpdateArgs> = {},
  ) {
    let report = await this.prisma.companyReport.findFirst({
      where: { companyId },
    });

    if (!report) {
      report = await this.upsert({
        companyId,
        dailyReport: { esocial: {}, exam: {} },
      });
    }

    const dailyReport = (report?.dailyReport || {
      esocial: {},
      exam: {},
    }) as unknown as DailyCompanyReportDto;

    const group = await this.prisma.employeeESocialEvent.groupBy({
      by: ['status'],
      _count: true,
    });

    const done = group.find((g) => g.status === 'DONE')?._count || 0;
    // eslint-disable-next-line prettier/prettier
    const transmitted = group.find((g) => g.status === 'TRANSMITTED')?._count || 0;
    // eslint-disable-next-line prettier/prettier
    const processing = group.find((g) => g.status === 'PROCESSING')?._count || 0;
    // eslint-disable-next-line prettier/prettier
    const rejected = group.find((g) => g.status === 'INVALID' || g.status === 'ERROR') ?._count || 0;

    if (typeof done == 'number') dailyReport.esocial.done = done;
    // eslint-disable-next-line prettier/prettier
    if (typeof rejected == 'number') dailyReport.esocial.rejected = rejected;
    // eslint-disable-next-line prettier/prettier
    if (typeof processing == 'number') dailyReport.esocial.processing = processing;
    // eslint-disable-next-line prettier/prettier
    if (typeof transmitted == 'number') dailyReport.esocial.transmitted = transmitted;

    // eslint-disable-next-line prettier/prettier
    dailyReport.esocial.pending = (dailyReport.esocial?.pending || 0) - removePending;

    if (dailyReport.esocial.pending < 0) dailyReport.esocial.pending = 0;

    await this.prisma.companyReport.update({
      where: { companyId },
      data: { dailyReport: dailyReport as any },
      ...options,
    });

    return new CompanyReportEntity(report);
  }

  async updateESocialReport(
    companyId: string,
    dailyReport: Partial<DailyCompanyReportDto>,
    options: Partial<Prisma.CompanyReportUpdateArgs> = {},
  ) {
    let report = await this.prisma.companyReport.findFirst({
      where: { companyId },
    });

    if (!report) {
      report = await this.upsert({
        companyId,
        dailyReport: { esocial: {}, exam: {} },
      });
    }

    const newDailyReport = (report?.dailyReport || {
      esocial: {},
      exam: {},
    }) as unknown as DailyCompanyReportDto;

    newDailyReport.esocial = {
      ...newDailyReport.esocial,
      ...dailyReport?.esocial,
    };

    newDailyReport.exam = {
      ...newDailyReport.exam,
      ...dailyReport?.exam,
    };

    await this.prisma.companyReport.update({
      where: { companyId },
      data: { dailyReport: newDailyReport as any },
      ...options,
    });

    return new CompanyReportEntity(report);
  }

  async getESocialNewReport(companyId: string) {
    const esocial = {} as DailyCompanyReportDto['esocial'];

    const group = await this.prisma.employeeESocialEvent.groupBy({
      by: ['status'],
      where: { companyId },
      _count: true,
    });

    const done = group.find((g) => g.status === 'DONE')?._count || 0;
    // eslint-disable-next-line prettier/prettier
    const transmitted = group.find((g) => g.status === 'TRANSMITTED')?._count || 0;
    // eslint-disable-next-line prettier/prettier
    const processing = group.find((g) => g.status === 'PROCESSING')?._count || 0;
    // eslint-disable-next-line prettier/prettier
    const rejected = group.find((g) => g.status === 'INVALID' || g.status === 'ERROR') ?._count || 0;

    esocial.done = done;
    esocial.rejected = rejected;
    esocial.processing = processing;
    esocial.transmitted = transmitted;

    return esocial;
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
