import { CompanyReport, Prisma } from '@prisma/client';
export declare class CompanyReportEntity implements CompanyReport {
    id: number;
    lastDailyReport: Date;
    dailyReport: Prisma.JsonValue;
    created_at: Date;
    updated_at: Date;
    companyId: string;
    constructor(partial: Partial<CompanyReportEntity>);
    esocialPendent: number;
    esocialReject: number;
    esocialDone: number;
    esocialProgress: number;
}
