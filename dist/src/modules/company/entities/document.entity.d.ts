import { Document, DocumentTypeEnum, StatusEnum } from '@prisma/client';
import { CompanyEntity } from './company.entity';
import { WorkspaceEntity } from './workspace.entity';
export declare class DocumentEntity implements Document {
    id: number;
    fileUrl: string;
    name: string;
    description: string;
    startDate: Date;
    endDate: Date;
    type: DocumentTypeEnum;
    status: StatusEnum;
    created_at: Date;
    updated_at: Date;
    companyId: string;
    workspaceId: string;
    workspace: WorkspaceEntity;
    company: CompanyEntity;
    oldDocuments: DocumentEntity[];
    parentDocumentId: number;
    parentDocument: DocumentEntity;
    constructor(partial: Partial<DocumentEntity>);
}
