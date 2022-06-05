import { StatusEnum } from '@prisma/client';
export declare class UpsertRiskDocumentDto {
    id?: string;
    name: string;
    riskGroupId: string;
    version: string;
    workspaceId: string;
    workspaceName: string;
    fileUrl: string;
    description?: string;
    status?: StatusEnum;
    companyId: string;
}
