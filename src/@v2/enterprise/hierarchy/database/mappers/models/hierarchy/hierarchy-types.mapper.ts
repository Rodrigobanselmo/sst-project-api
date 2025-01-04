import { HierarchiesTypesModel } from '@/@v2/enterprise/hierarchy/domain/models/hierarchies/hierarchies-types.model';
import { HierarchyTypeEnum } from '@/@v2/shared/domain/enum/company/hierarchy-type.enum';
import { HierarchyEnum } from '@prisma/client';

export type IHierarchiesTypesModelMapper = {
  type: HierarchyEnum
}[]

export class HierarchiesTypesModelMapper {
  static toModel(prisma: IHierarchiesTypesModelMapper): HierarchiesTypesModel {
    return new HierarchiesTypesModel({
      types: prisma.map(type => HierarchyTypeEnum[type.type])
    })
  }
}
