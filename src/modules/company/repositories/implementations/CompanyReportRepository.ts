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

    const transmitted =
      group.find((g) => g.status === 'TRANSMITTED')?._count || 0;

    const processing =
      group.find((g) => g.status === 'PROCESSING')?._count || 0;

    const rejected =
      group.find((g) => g.status === 'INVALID' || g.status === 'ERROR')
        ?._count || 0;

    if (typeof done == 'number') dailyReport.esocial.done = done;

    if (typeof rejected == 'number') dailyReport.esocial.rejected = rejected;

    if (typeof processing == 'number')
      dailyReport.esocial.processing = processing;

    if (typeof transmitted == 'number')
      dailyReport.esocial.transmitted = transmitted;

    dailyReport.esocial.pending =
      (dailyReport.esocial?.pending || 0) - removePending;

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
        dailyReport: {
          esocial: {
            S2220: {},
            S2240: {},
            S2210: {},
          },
          exam: {},
        },
      });
    }

    const newDailyReport = (report?.dailyReport || {
      esocial: { S2210: {}, S2220: {}, S2240: {} },
      exam: {},
    }) as unknown as DailyCompanyReportDto;

    newDailyReport.esocial = {
      ...newDailyReport.esocial,
      ...dailyReport?.esocial,
      S2210: {
        ...newDailyReport?.esocial?.S2210,
        ...dailyReport?.esocial?.S2210,
      },
      S2220: {
        ...newDailyReport?.esocial?.S2220,
        ...dailyReport?.esocial?.S2220,
      },
      S2240: {
        ...newDailyReport?.esocial?.S2240,
        ...dailyReport?.esocial?.S2240,
      },
    };

    const esocial = {
      processing:
        (newDailyReport.esocial.S2210.processing || 0) +
        (newDailyReport.esocial.S2220.processing || 0) +
        (newDailyReport.esocial.S2240.processing || 0),
      pending:
        (newDailyReport.esocial.S2210.pending || 0) +
        (newDailyReport.esocial.S2220.pending || 0) +
        (newDailyReport.esocial.S2240.pending || 0),
      done:
        (newDailyReport.esocial.S2210.done || 0) +
        (newDailyReport.esocial.S2220.done || 0) +
        (newDailyReport.esocial.S2240.done || 0),
      transmitted:
        (newDailyReport.esocial.S2210.transmitted || 0) +
        (newDailyReport.esocial.S2220.transmitted || 0) +
        (newDailyReport.esocial.S2240.transmitted || 0),
      rejected:
        (newDailyReport.esocial.S2210.rejected || 0) +
        (newDailyReport.esocial.S2220.rejected || 0) +
        (newDailyReport.esocial.S2240.rejected || 0),
    };

    newDailyReport.esocial = {
      ...newDailyReport.esocial,
      ...esocial,
    };

    newDailyReport.exam = {
      ...newDailyReport.exam,
      ...dailyReport?.exam,
    };

    await this.prisma.companyReport.update({
      where: { companyId },
      data: {
        dailyReport: newDailyReport as any,
        esocialDone: newDailyReport.esocial?.done || 0,
        esocialPendent:
          (newDailyReport.esocial?.pending || 0) +
          (newDailyReport.esocial?.transmitted || 0),
        esocialProgress: newDailyReport.esocial?.processing || 0,
        esocialReject: newDailyReport.esocial?.rejected || 0,
      },
      ...options,
    });

    return new CompanyReportEntity(report);
  }

  async getESocialNewReport(companyId: string) {
    const esocial = {
      ['S2210']: {},
      ['S2220']: {},
      ['S2240']: {},
    } as DailyCompanyReportDto['esocial'];

    const group = await this.prisma.employeeESocialEvent.groupBy({
      by: ['status', 'type'],
      where: { companyId },
      _count: true,
    });

    const doneRisk =
      group.find((g) => g.status === 'DONE' && g.type === 'RISK_2240')
        ?._count || 0;

    const doneExam =
      group.find((g) => g.status === 'DONE' && g.type === 'EXAM_2220')
        ?._count || 0;

    const doneCat =
      group.find((g) => g.status === 'DONE' && g.type === 'CAT_2210')?._count ||
      0;

    const transmittedRisk =
      group.find((g) => g.status === 'TRANSMITTED' && g.type === 'RISK_2240')
        ?._count || 0;

    const transmittedExam =
      group.find((g) => g.status === 'TRANSMITTED' && g.type === 'EXAM_2220')
        ?._count || 0;

    const transmittedCat =
      group.find((g) => g.status === 'TRANSMITTED' && g.type === 'CAT_2210')
        ?._count || 0;

    const processingRisk =
      group.find((g) => g.status === 'PROCESSING' && g.type === 'RISK_2240')
        ?._count || 0;

    const processingExam =
      group.find((g) => g.status === 'PROCESSING' && g.type === 'EXAM_2220')
        ?._count || 0;

    const processingCat =
      group.find((g) => g.status === 'PROCESSING' && g.type === 'CAT_2210')
        ?._count || 0;

    const rejectedRisk =
      group.find(
        (g) =>
          (g.status === 'INVALID' || g.status === 'ERROR') &&
          g.type === 'RISK_2240',
      )?._count || 0;

    const rejectedExam =
      group.find(
        (g) =>
          (g.status === 'INVALID' || g.status === 'ERROR') &&
          g.type === 'EXAM_2220',
      )?._count || 0;

    const rejectedCat =
      group.find(
        (g) =>
          (g.status === 'INVALID' || g.status === 'ERROR') &&
          g.type === 'CAT_2210',
      )?._count || 0;

    esocial.S2240.done = doneRisk;
    esocial.S2240.rejected = rejectedRisk;
    esocial.S2240.processing = processingRisk;
    esocial.S2240.transmitted = transmittedRisk;

    esocial.S2220.done = doneExam;
    esocial.S2220.rejected = rejectedExam;
    esocial.S2220.processing = processingExam;
    esocial.S2220.transmitted = transmittedExam;

    esocial.S2210.done = doneCat;
    esocial.S2210.rejected = rejectedCat;
    esocial.S2210.processing = processingCat;
    esocial.S2210.transmitted = transmittedCat;
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
