export type IHierarchyEntity = {
  id: string
  name: string
  description: string
}

export class HierarchyEntity {
  id: string
  name: string
  description: string

  constructor(params: IHierarchyEntity) {
    this.id = params.id
    this.name = params.name
    this.description = params.description;
  }
}