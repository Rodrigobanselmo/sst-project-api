import { Attachments } from '.prisma/client';
import { RiskDocumentEntity } from './riskDocument.entity';

export class AttachmentEntity implements Attachments {
  id: string;
  name: string;
  url: string;
  created_at: Date;
  deleted_at: Date;
  updated_at: Date;
  riskFactorDocumentId: string;
  riskDocument: RiskDocumentEntity;

  constructor(partial: Partial<AttachmentEntity>) {
    Object.assign(this, partial);
  }
}
