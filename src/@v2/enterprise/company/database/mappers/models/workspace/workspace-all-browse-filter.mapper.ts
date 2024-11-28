import { WorkspaceBrowseFilterModel } from "@/@v2/enterprise/company/domain/models/workspace/workspace-browse-all-filter.model"

export type IWorkspaceBrowseFilterModelMapper = {
}

export class WorkspaceBrowseFilterModelMapper {
  static toModel(prisma: IWorkspaceBrowseFilterModelMapper): WorkspaceBrowseFilterModel {
    return new WorkspaceBrowseFilterModel(prisma)
  }
}
