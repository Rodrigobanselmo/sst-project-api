import { StatusEnum } from '@prisma/client';
export declare class UpsertRiskGroupDataDto {
    id?: string;
    name: string;
    status?: StatusEnum;
    companyId: string;
    source: string;
    elaboratedBy: string;
    approvedBy: string;
    revisionBy: string;
    documentDate: Date;
    visitDate: Date;
}
