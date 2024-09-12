import { Attachments, RiskFactorDocument } from '@prisma/client';
import { AttachmentModel } from '../../domain/models/attachment.model';
import { DocumentVersionModel } from '../../domain/models/document-version.model';
import { DocumentBaseMapper, IDocumentBaseMapper } from './document-base.mapper';

export type IDocumentVersionMapper = RiskFactorDocument & {
  attachments: Attachments[]
  documentData: IDocumentBaseMapper
}

export class DocumentVersionMapper {
  static toModel(data: IDocumentVersionMapper): DocumentVersionModel {
    return new DocumentVersionModel({
      id: data.id,
      createdAt: data.created_at,
      description: data.description,
      fileUrl: data.fileUrl,
      version: data.version,
      name: data.name,
      documentBase: DocumentBaseMapper.toModel(data.documentData),
      attachments: data.attachments.map((attachment, index) => {
        return new AttachmentModel({
          name: attachment.name || `Anexo ${index}`,
          url: attachment.url,
        })
      })
    })
  }
}
