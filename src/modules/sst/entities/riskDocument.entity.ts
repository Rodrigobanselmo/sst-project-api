import { RiskFactorDocument, StatusEnum } from '@prisma/client';
import { CompanyEntity } from '../../company/entities/company.entity';
import { AttachmentEntity } from './attachment.entity';
import { DocumentDataEntity } from './documentData.entity';

export class RiskDocumentEntity implements RiskFactorDocument {
  id: string;
  name: string;
  companyId: string;
  status: StatusEnum;
  created_at: Date;
  documentDate: Date | null;
  documentCreatedAt: Date | null;
  validityYears: number | null;
  validityMonths: number | null;
  validityEndSnapshot: Date | null;
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

  documentData?: DocumentDataEntity;
  documentDataId: string;
  officialRevisionSeries: number | null;

  constructor(partial: Partial<RiskDocumentEntity>) {
    Object.assign(this, partial);
  }
}
