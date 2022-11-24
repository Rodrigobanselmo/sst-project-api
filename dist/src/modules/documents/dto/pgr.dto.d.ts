import { StatusEnum } from '@prisma/client';
export declare class UpsertDocumentDto {
    id?: string;
    riskGroupId: string;
    pcmsoId: string;
    name: string;
    version: string;
    description?: string;
    status?: StatusEnum;
    companyId: string;
    workspaceId: string;
    workspaceName: string;
    isPGR: boolean;
    isPCMSO: boolean;
}
export declare class UpsertPgrDocumentDto extends UpsertDocumentDto {
}
export declare class UpsertPcmsoDocumentDto extends UpsertDocumentDto {
}
export declare class UploadPgrActionPlanDto {
    riskGroupId: string;
    companyId: string;
    workspaceId: string;
}
