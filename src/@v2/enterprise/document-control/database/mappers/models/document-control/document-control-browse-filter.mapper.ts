import { DocumentControlBrowseFilterModel } from '@/@v2/enterprise/document-control/domain/models/document-control/document-control-browse-filter.model';

export type IDocumentControlBrowseFilterModelMapper = {
  filter_types: string[];
};

export class DocumentControlBrowseFilterModelMapper {
  static toModel(prisma: IDocumentControlBrowseFilterModelMapper): DocumentControlBrowseFilterModel {
    return new DocumentControlBrowseFilterModel({ types: prisma.filter_types });
  }
}
