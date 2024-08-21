import { DocumentPGRModel } from '../../domain/models/document-pgr.model';
import { DocumentBaseMapper, IDocumentBaseMapper } from './document-base.mapper';
import { DocumentVersionMapper, IDocumentVersionMapper, } from './document-version.mapper';
import { HierarchyMapper, IHierarchyMapper } from './hierarchy.mapper';
import { HomogeneousGroupMapper, IHomogeneousGroupMapper } from './homogeneous-group.mapper';


type IDocumentPGRMapper = {
  documentVersion: IDocumentVersionMapper
  documentData: IDocumentBaseMapper
  hierarchies: IHierarchyMapper[]
  homogeneousGroups: IHomogeneousGroupMapper[]
}

export class DocumentPGRMapper {
  static toModel(data: IDocumentPGRMapper): DocumentPGRModel {
    return new DocumentPGRModel({
      documentVersion: DocumentVersionMapper.toModel(data.documentVersion),
      documentBase: DocumentBaseMapper.toModel(data.documentData),
      hierarchies: HierarchyMapper.toModels(data.hierarchies),
      homogeneousGroups: HomogeneousGroupMapper.toModels(data.homogeneousGroups)
    })
  }
}
