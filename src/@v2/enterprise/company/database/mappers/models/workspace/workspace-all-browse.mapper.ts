import { IPaginationModelMapper, PaginationModelMapper } from '@/@v2/shared/utils/database/pagination-mapper';
import { WorkspaceBrowseFilterModelMapper, IWorkspaceBrowseFilterModelMapper } from './workspace-all-browse-filter.mapper';
import { WorkspaceBrowseResultModelMapper, IWorkspaceBrowseResultModelMapper } from './workspace-all-browse-result.mapper';
import { WorkspaceBrowseModel } from '@/@v2/enterprise/company/domain/models/workspace/workspace-browse-all.model';

export type IWorkspaceBrowseModelMapper = {
  results: IWorkspaceBrowseResultModelMapper[]
  filters: IWorkspaceBrowseFilterModelMapper
}

export class WorkspaceBrowseModelMapper {
  static toModel(prisma: IWorkspaceBrowseModelMapper): WorkspaceBrowseModel {
    return new WorkspaceBrowseModel({
      results: WorkspaceBrowseResultModelMapper.toModels(prisma.results),
      filters: WorkspaceBrowseFilterModelMapper.toModel(prisma.filters),
    })
  }
}
