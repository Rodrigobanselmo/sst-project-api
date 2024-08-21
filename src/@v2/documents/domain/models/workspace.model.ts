
export type IWorkspaceModel = {
  id: string
  name: string
}

export class WorkspaceModel {
  id: string
  name: string

  constructor(params: IWorkspaceModel) {
    this.id = params.id;
    this.name = params.name
  }
}