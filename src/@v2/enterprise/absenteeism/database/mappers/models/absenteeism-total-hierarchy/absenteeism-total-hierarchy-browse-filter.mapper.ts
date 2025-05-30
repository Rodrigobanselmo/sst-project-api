import { AbsenteeismHierarchyTypeEnum } from '@/@v2/enterprise/absenteeism/domain/enums/absenteeism-hierarchy-type';
import { AbsenteeismTotalHierarchyFilterBrowseModel } from '@/@v2/enterprise/absenteeism/domain/models/absenteeism-total-hierarchy/absenteeism-total-hierarchy-browse-filter.model';
import { HierarchyEnum } from '@prisma/client';

export type IAbsenteeismTotalHierarchyFilterBrowseModelMapper = {
  types: HierarchyEnum[];
};

export class AbsenteeismTotalHierarchyFilterBrowseModelMapper {
  static toModel(prisma: IAbsenteeismTotalHierarchyFilterBrowseModelMapper): AbsenteeismTotalHierarchyFilterBrowseModel {
    return new AbsenteeismTotalHierarchyFilterBrowseModel({
      types: [AbsenteeismHierarchyTypeEnum.WORKSPACE, ...prisma.types.map((type) => AbsenteeismHierarchyTypeEnum[type]), AbsenteeismHierarchyTypeEnum.HOMOGENEOUS_GROUP],
    });
  }
}
