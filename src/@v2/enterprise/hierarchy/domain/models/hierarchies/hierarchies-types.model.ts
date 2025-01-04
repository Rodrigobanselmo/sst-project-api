import { HierarchyTypeEnum } from "@/@v2/shared/domain/enum/company/hierarchy-type.enum"

export type IHierarchiesTypesModel = {
  types: HierarchyTypeEnum[]
}

export class HierarchiesTypesModel {
  types: HierarchyTypeEnum[]

  constructor(params: IHierarchiesTypesModel) {
    this.types = params.types
  }
}