import { HierarchyBrowseResultModel, IHierarchyParentsModel } from "@/@v2/security/action-plan/domain/models/hierarchy/hierarchy-browse-result.model";
import { HierarchyTypeEnum } from "@/@v2/shared/domain/enum/company/hierarchy-type.enum";

export type IHierarchyBrowseResultModelMapper = {
  hierarchy_id: string;
  hierarchy_name: string;
  hierarchy_type: HierarchyTypeEnum;
  h_parent_1_id: string | null;
  h_parent_1_name: string | null;
  h_parent_1_type: HierarchyTypeEnum | null;
  h_parent_2_id: string | null;
  h_parent_2_name: string | null;
  h_parent_2_type: HierarchyTypeEnum | null;
  h_parent_3_id: string | null;
  h_parent_3_name: string | null;
  h_parent_3_type: HierarchyTypeEnum | null;
  h_parent_4_id: string | null;
  h_parent_4_name: string | null;
  h_parent_4_type: HierarchyTypeEnum | null;
  h_parent_5_id: string | null;
  h_parent_5_name: string | null;
  h_parent_5_type: HierarchyTypeEnum | null;
}

const mapTypeKey: Partial<Record<HierarchyTypeEnum, keyof IHierarchyParentsModel>> = {
  [HierarchyTypeEnum.OFFICE]: 'office',
  [HierarchyTypeEnum.SUB_SECTOR]: 'subSector',
  [HierarchyTypeEnum.SECTOR]: 'sector',
  [HierarchyTypeEnum.MANAGEMENT]: 'management',
  [HierarchyTypeEnum.DIRECTORY]: 'directory',
}

export class HierarchyBrowseResultModelMapper {
  static toModel(prisma: IHierarchyBrowseResultModelMapper): HierarchyBrowseResultModel {

    return new HierarchyBrowseResultModel({
      id: prisma.hierarchy_id,
      type: HierarchyTypeEnum[prisma.hierarchy_type],
      name: prisma.hierarchy_name,
      ...(!!prisma.h_parent_1_type && {
        [mapTypeKey[prisma.h_parent_1_type] as string]: {
          id: prisma.h_parent_1_id,
          name: prisma.h_parent_1_name,
        },
      }),
      ...(!!prisma.h_parent_2_type && {
        [mapTypeKey[prisma.h_parent_2_type] as string]: {
          id: prisma.h_parent_2_id,
          name: prisma.h_parent_2_name,
        },
      }),
      ...(!!prisma.h_parent_3_type && {
        [mapTypeKey[prisma.h_parent_3_type] as string]: {
          id: prisma.h_parent_3_id,
          name: prisma.h_parent_3_name,
        },
      }),
      ...(!!prisma.h_parent_4_type && {
        [mapTypeKey[prisma.h_parent_4_type] as string]: {
          id: prisma.h_parent_4_id,
          name: prisma.h_parent_4_name,
        },
      }),
      ...(!!prisma.h_parent_5_type && {
        [mapTypeKey[prisma.h_parent_5_type] as string]: {
          id: prisma.h_parent_5_id,
          name: prisma.h_parent_5_name,
        },
      }),
    })
  }

  static toModels(prisma: IHierarchyBrowseResultModelMapper[]): HierarchyBrowseResultModel[] {
    return prisma.map((rec) => HierarchyBrowseResultModelMapper.toModel(rec))
  }
}
