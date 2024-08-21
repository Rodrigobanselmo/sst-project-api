import { Workspace } from '@prisma/client';
import { WorkspaceModel } from '../../domain/models/workspace.model';

export type IWorkspaceMapper = Workspace

export class WorkspaceMapper {
  static toModel(data: IWorkspaceMapper): WorkspaceModel {
    return new WorkspaceModel({
      id: data.id,
      name: data.name,
    })
  }
}