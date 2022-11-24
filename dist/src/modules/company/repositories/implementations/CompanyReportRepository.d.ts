import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../../prisma/prisma.service';
import { DailyCompanyReportDto, UpsertCompanyReportDto } from '../../dto/company-report.dto';
import { CompanyReportEntity } from '../../entities/report.entity';
export declare class CompanyReportRepository {
    private prisma;
    constructor(prisma: PrismaService);
    upsert({ companyId, dailyReport, lastDailyReport }: UpsertCompanyReportDto, options?: Partial<Prisma.CompanyReportUpsertArgs>): Promise<CompanyReportEntity>;
    updateESocial(companyId: string, removePending?: number, options?: Partial<Prisma.CompanyReportUpdateArgs>): Promise<CompanyReportEntity>;
    updateESocialReport(companyId: string, dailyReport: Partial<DailyCompanyReportDto>, options?: Partial<Prisma.CompanyReportUpdateArgs>): Promise<CompanyReportEntity>;
    getESocialNewReport(companyId: string): Promise<{
        processing?: number;
        pending?: number;
        done?: number;
        transmitted?: number;
        rejected?: number;
        S2240?: import("../../dto/company-report.dto").IESocialPropsDto;
        S2220?: import("../../dto/company-report.dto").IESocialPropsDto;
        S2210?: import("../../dto/company-report.dto").IESocialPropsDto;
    }>;
    findNude(options?: Prisma.CompanyReportFindManyArgs): Promise<CompanyReportEntity[]>;
    findFirstNude(options?: Prisma.CompanyReportFindFirstArgs): Promise<CompanyReportEntity>;
    findAllGroupBy(): Promise<(Prisma.PickArray<Prisma.CompanyReportGroupByOutputType, "companyId"[]> & {})[]>;
}
