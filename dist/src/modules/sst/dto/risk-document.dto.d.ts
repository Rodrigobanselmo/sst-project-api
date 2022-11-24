import { StatusEnum } from '@prisma/client';
import { AttachmentDto } from './attachment.dto';
export declare class UpsertRiskDocumentDto {
    id?: string;
    name: string;
    riskGroupId?: string;
    pcmsoId?: string;
    version: string;
    workspaceId: string;
    workspaceName: string;
    fileUrl?: string;
    description?: string;
    status?: StatusEnum;
    companyId: string;
    attachments?: AttachmentDto[];
}
