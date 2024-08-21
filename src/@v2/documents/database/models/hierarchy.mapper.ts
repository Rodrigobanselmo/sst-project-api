import { Hierarchy } from '@prisma/client';
import { HierarchyModel } from '../../domain/models/hierarchy.model';

export type IHierarchyMapper = Hierarchy

export class HierarchyMapper {
  static toModel(data: IHierarchyMapper): HierarchyModel {
    return new HierarchyModel({
      id: data.id,
      description: data.description,
      name: data.name,
    })
  }

  static toModels(data: IHierarchyMapper[]): HierarchyModel[] {
    return data.map(hierarchy => this.toModel(hierarchy))
  }
}
