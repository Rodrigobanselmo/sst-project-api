import { IPaginationModelMapper, PaginationModelMapper } from '@/@v2/shared/utils/database/pagination-mapper';
import { DocumentControlBrowseFilterModelMapper, IDocumentControlBrowseFilterModelMapper } from './document-control-browse-filter.mapper';
import { DocumentControlBrowseResultModelMapper, IDocumentControlBrowseResultModelMapper } from './document-control-browse-result.mapper';
import { DocumentControlBrowseModel } from '@/@v2/enterprise/document-control/domain/models/document-control/document-control-browse.model';

export type IDocumentControlBrowseModelMapper = {
  results: IDocumentControlBrowseResultModelMapper[];
  filters: IDocumentControlBrowseFilterModelMapper;
  pagination: IPaginationModelMapper;
};

export class DocumentControlBrowseModelMapper {
  static toModel(prisma: IDocumentControlBrowseModelMapper): DocumentControlBrowseModel {
    return new DocumentControlBrowseModel({
      results: DocumentControlBrowseResultModelMapper.toModels(prisma.results),
      filters: DocumentControlBrowseFilterModelMapper.toModel(prisma.filters),
      pagination: PaginationModelMapper.toModel(prisma.pagination),
    });
  }
}
