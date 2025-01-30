import { WorkspaceStatusEnum } from '../../enums/document-status.enum';

export type IWorkspaceBrowseResultModel = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  status: WorkspaceStatusEnum;
};

export class WorkspaceBrowseResultModel {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  status: WorkspaceStatusEnum;

  constructor(params: IWorkspaceBrowseResultModel) {
    this.id = params.id;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
    this.name = params.name;
    this.status = params.status;
  }
}
