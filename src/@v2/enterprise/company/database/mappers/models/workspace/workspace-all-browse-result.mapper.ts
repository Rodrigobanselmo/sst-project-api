import { WorkspaceStatusEnum } from '@/@v2/enterprise/company/domain/enums/workspace-status.enum';
import { WorkspaceBrowseResultModel } from '@/@v2/enterprise/company/domain/models/workspace/workspace-browse-all-result.model';
import { StatusEnum } from '@prisma/client';

export type IWorkspaceBrowseResultModelMapper = {
  id: string;
  created_at: Date;
  updated_at: Date;
  name: string;
  status: StatusEnum;
}

export class WorkspaceBrowseResultModelMapper {
  static toModel(prisma: IWorkspaceBrowseResultModelMapper): WorkspaceBrowseResultModel {
    return new WorkspaceBrowseResultModel({
      id: prisma.id,
      createdAt: prisma.created_at,
      updatedAt: prisma.updated_at,
      name: prisma.name,
      status: WorkspaceStatusEnum[prisma.status],
    })
  }

  static toModels(prisma: IWorkspaceBrowseResultModelMapper[]): WorkspaceBrowseResultModel[] {
    return prisma.map((rec) => WorkspaceBrowseResultModelMapper.toModel(rec))
  }
}
