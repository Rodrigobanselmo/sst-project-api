import { DocumentPGRModel } from '../../../domain/models/document-pgr.model';
import { IExamModel } from '../../../domain/models/exam.model';
import { DocumentBaseMapper, IDocumentBaseMapper } from '../document-base.mapper';
import { DocumentVersionMapper, IDocumentVersionMapper, } from '../document-version.mapper';
import { HierarchyMapper, IHierarchyMapper } from '../hierarchy.mapper';
import { HomogeneousGroupMapper, IHomogeneousGroupMapper } from '../homogeneous-group.mapper';


type IDocumentPGRMapper = {
  documentVersion: IDocumentVersionMapper
  hierarchies: IHierarchyMapper[]
  homogeneousGroups: IHomogeneousGroupMapper[]
  exams: IExamModel[]
}

export class DocumentPGRMapper {
  static toModel(data: IDocumentPGRMapper): DocumentPGRModel {
    return new DocumentPGRModel({
      documentVersion: DocumentVersionMapper.toModel(data.documentVersion),
      hierarchies: HierarchyMapper.toModels(data.hierarchies),
      homogeneousGroups: HomogeneousGroupMapper.toModels(data.homogeneousGroups),
      exams: data.exams
    })
  }
}
