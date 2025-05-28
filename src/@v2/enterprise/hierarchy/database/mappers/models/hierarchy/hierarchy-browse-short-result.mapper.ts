import { HierarchyBrowseResultModel } from '@/@v2/enterprise/hierarchy/domain/models/hierarchies/hierarchy-browse-result.model';
import { HierarchyBrowseShortResultModel } from '@/@v2/enterprise/hierarchy/domain/models/hierarchies/hierarchy-browse-short-result.model';
import { HierarchyTypeEnum } from '@/@v2/shared/domain/enum/company/hierarchy-type.enum';

export type IHierarchyBrowseShortResultModelMapper = {
  hierarchy_id: string;
  hierarchy_name: string;
  hierarchy_type: HierarchyTypeEnum;
};

export class HierarchyBrowseShortResultModelMapper {
  static toModel(prisma: IHierarchyBrowseShortResultModelMapper): HierarchyBrowseResultModel {
    return new HierarchyBrowseShortResultModel({
      id: prisma.hierarchy_id,
      type: HierarchyTypeEnum[prisma.hierarchy_type],
      name: prisma.hierarchy_name,
    });
  }

  static toModels(prisma: IHierarchyBrowseShortResultModelMapper[]): HierarchyBrowseResultModel[] {
    return prisma.map((rec) => HierarchyBrowseShortResultModelMapper.toModel(rec));
  }
}
