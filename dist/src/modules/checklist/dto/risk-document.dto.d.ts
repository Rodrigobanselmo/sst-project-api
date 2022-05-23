import { StatusEnum } from '@prisma/client';
export declare class UpsertRiskDocumentDto {
    id?: string;
    name: string;
    riskGroupId: string;
    version: string;
    fileUrl: string;
    description?: string;
    status?: StatusEnum;
    companyId: string;
}
