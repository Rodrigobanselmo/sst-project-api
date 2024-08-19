import { Attachments, RiskFactorDocument } from '@prisma/client';
import { DocumentAggregate } from '../../domain/aggregate/document.aggregate';
import { AttachmentEntity } from '../../domain/entities/attachment.entity';
import { DocumentVersionEntity } from '../../domain/entities/document-version.entity';
import { DocumentBaseModel, IDocumentBaseModel } from './document-base.model';
import { HierarchyEntity } from '../../domain/entities/hierarchy.entity';
import { HomogeneousGroupEntity } from '../../domain/entities/homogeneous-group.entity';

type IDocumentVersionModel = RiskFactorDocument & {
  attachments: Attachments[]
}

// type IDocumentAggregateModel = {
//   documentVersion: IDocumentVersionModel
//   documentBase: IDocumentBaseModel

//   hierarchies: () => Promise<HierarchyEntity[]>
//   homogeneousGroups: () => Promise<HomogeneousGroupEntity[]>
// }

export class DocumentVersionModel {
  static toEntity(data: IDocumentVersionModel): DocumentVersionEntity {
    return new DocumentVersionEntity({
      id: data.id,
      description: data.description,
      fileUrl: data.fileUrl,
      version: data.version,
      name: data.name,
      attachments: data.attachments.map((attachment, index) => {
        return new AttachmentEntity({
          id: attachment.id,
          name: attachment.name || `Anexo ${index}`,
          url: attachment.url,
        })
      })
    })
  }

  // static toAggragate(data: IDocumentAggregateModel): DocumentAggregate {
  //   return new DocumentAggregate({
  //     documentVersion: DocumentVersionModel.toEntity(data.documentVersion),
  //     documentBase: DocumentBaseModel.toEntity(data.documentBase),

  //     hierarchies: data.hierarchies,
  //     homogeneousGroups: data.homogeneousGroups,
  //   })
  // }

}
