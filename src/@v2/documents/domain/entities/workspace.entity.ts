
export type IWorkspaceEntity = {
  id: string
  name: string
}

export class WorkspaceEntity {
  id: string
  name: string

  constructor(params: IWorkspaceEntity) {
    this.id = params.id;
    this.name = params.name
  }
}