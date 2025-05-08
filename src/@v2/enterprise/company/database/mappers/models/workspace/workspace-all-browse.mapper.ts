import { WorkspaceBrowseModel } from '@/@v2/enterprise/company/domain/models/workspace/workspace-browse-all.model';
import { IWorkspaceBrowseFilterModelMapper, WorkspaceBrowseFilterModelMapper } from './workspace-all-browse-filter.mapper';
import { IWorkspaceBrowseResultModelMapper, WorkspaceBrowseResultModelMapper } from './workspace-all-browse-result.mapper';

export type IWorkspaceBrowseModelMapper = {
  results: IWorkspaceBrowseResultModelMapper[];
  filters: IWorkspaceBrowseFilterModelMapper;
};

export class WorkspaceBrowseModelMapper {
  static toModel(prisma: IWorkspaceBrowseModelMapper): WorkspaceBrowseModel {
    return new WorkspaceBrowseModel({
      results: WorkspaceBrowseResultModelMapper.toModels(prisma.results),
      filters: WorkspaceBrowseFilterModelMapper.toModel(prisma.filters),
    });
  }
}
