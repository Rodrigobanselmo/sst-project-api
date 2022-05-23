import { StatusEnum } from '@prisma/client';
export declare class UpsertPgrDto {
    id?: string;
    name: string;
    riskGroupId: string;
    version: string;
    description?: string;
    status?: StatusEnum;
    companyId: string;
}
