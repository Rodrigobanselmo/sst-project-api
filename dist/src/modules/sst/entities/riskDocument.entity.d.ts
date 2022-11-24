import { RiskFactorDocument, StatusEnum } from '@prisma/client';
import { CompanyEntity } from '../../company/entities/company.entity';
import { AttachmentEntity } from './attachment.entity';
export declare class RiskDocumentEntity implements RiskFactorDocument {
    id: string;
    name: string;
    companyId: string;
    status: StatusEnum;
    created_at: Date;
    company?: Partial<CompanyEntity>;
    fileUrl: string;
    description: string;
    version: string;
    updated_at: Date;
    workspaceName: string;
    workspaceId: string;
    elaboratedBy: string;
    revisionBy: string;
    approvedBy: string;
    validity: string;
    complementaryDocs: string[];
    attachments: AttachmentEntity[];
    riskGroupId: string;
    pcmsoId: string;
    constructor(partial: Partial<RiskDocumentEntity>);
}
