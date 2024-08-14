export type IHierarchyVO = {
  name: string
  description: string
}

export class HierarchyVO {
  name: string
  description: string

  constructor(params: IHierarchyVO) {
    this.name = params.name
    this.description = params.description;
  }
}