import { Hierarchy } from '@prisma/client';
import { HierarchyEntity } from '../../domain/entities/hierarchy.entity';

type IHierarchyModel = Hierarchy

export class HierarchyModel {
  static toEntity(data: IHierarchyModel): HierarchyEntity {
    return new HierarchyEntity({
      id: data.id,
      description: data.description,
      name: data.name,
    })
  }

  static toEntities(data: IHierarchyModel[]): HierarchyEntity[] {
    return data.map(hierarchy => this.toEntity(hierarchy))
  }
}
