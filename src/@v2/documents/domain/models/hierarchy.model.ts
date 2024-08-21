export type IHierarchyModel = {
  id: string
  name: string
  description: string
}

export class HierarchyModel {
  id: string
  name: string
  description: string

  constructor(params: IHierarchyModel) {
    this.id = params.id
    this.name = params.name
    this.description = params.description;
  }
}