import { Attachments, RiskFactorDocument } from '@prisma/client';
import { AttachmentModel } from '../../domain/models/attachment.model';
import { DocumentVersionModel } from '../../domain/models/document-version.model';
import { DocumentBaseMapper, IDocumentBaseMapper } from './document-base.mapper';
import { DocumentVersionEntity } from '../../domain/entities/document-version.entity';
import { AttachmentEntity } from '../../domain/entities/attachment.entity';

export type IDocumentVersionEntityMapper = RiskFactorDocument & {
  attachments: Attachments[]
}

export type IDocumentVersionModelMapper = RiskFactorDocument & {
  attachments: Attachments[]
  documentData: IDocumentBaseMapper
}

export class DocumentVersionMapper {
  static toEntity(data: IDocumentVersionEntityMapper): DocumentVersionEntity {
    return new DocumentVersionEntity({
      id: data.id,
      fileUrl: data.fileUrl,
      status: data.status,
      attachments: data.attachments.map((attachment, index) => {
        return new AttachmentEntity({
          id: attachment.id,
          name: attachment.name || `Anexo ${index}`,
          url: attachment.url,
        })
      })
    })
  }

  static toModel(data: IDocumentVersionModelMapper): DocumentVersionModel {
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
          link: attachment.url,
          type: 'Anexo',
        })
      })
    })
  }
}
