import { AbsenteeismHierarchyTypeEnum } from '@/@v2/enterprise/absenteeism/domain/enums/absenteeism-hierarchy-type';
import {
  AbsenteeismTotalHierarchyResultBrowseModel,
  IAbsenteeismTotalHierarchyModel,
} from '@/@v2/enterprise/absenteeism/domain/models/absenteeism-total-hierarchy/absenteeism-total-hierarchy-browse-result.model';
import { HierarchyTypeEnum } from '@/@v2/shared/domain/enum/company/hierarchy-type.enum';

export type IAbsenteeismTotalHierarchyResultBrowseModelMapper = {
  hierarchy_id: string | null;
  hierarchy_name: string | null;
  hierarchy_type: HierarchyTypeEnum | null;
  hierarchy_parent_1_id: string | null;
  hierarchy_parent_1_name: string | null;
  hierarchy_parent_1_type: HierarchyTypeEnum | null;
  hierarchy_parent_2_id: string | null;
  hierarchy_parent_2_name: string | null;
  hierarchy_parent_2_type: HierarchyTypeEnum | null;
  hierarchy_parent_3_id: string | null;
  hierarchy_parent_3_name: string | null;
  hierarchy_parent_3_type: HierarchyTypeEnum | null;
  hierarchy_parent_4_id: string | null;
  hierarchy_parent_4_name: string | null;
  hierarchy_parent_4_type: HierarchyTypeEnum | null;
  workspace_id: string;
  workspace_name: string;
  homo_id: string;
  homo_name: string;
  total_absenteeism_count: number | null;
  total_absenteeism_days: number | null;
  avg_absenteeism_per_employee: number | null;
  daysInRange: number;
};

export class AbsenteeismTotalHierarchyResultBrowseModelMapper {
  static toModel(prisma: IAbsenteeismTotalHierarchyResultBrowseModelMapper): AbsenteeismTotalHierarchyResultBrowseModel {
    const hierarchies = [
      {
        id: prisma.hierarchy_id,
        name: prisma.hierarchy_name,
        type: prisma.hierarchy_type,
      },
      {
        id: prisma.hierarchy_parent_1_id,
        name: prisma.hierarchy_parent_1_name,
        type: prisma.hierarchy_parent_1_type,
      },
      {
        id: prisma.hierarchy_parent_2_id,
        name: prisma.hierarchy_parent_2_name,
        type: prisma.hierarchy_parent_2_type,
      },
      {
        id: prisma.hierarchy_parent_3_id,
        name: prisma.hierarchy_parent_3_name,
        type: prisma.hierarchy_parent_3_type,
      },
      {
        id: prisma.hierarchy_parent_4_id,
        name: prisma.hierarchy_parent_4_name,
        type: prisma.hierarchy_parent_4_type,
      },
    ];

    const hierarchyMap = hierarchies.reduce(
      (acc, hierarchy) => {
        if (hierarchy.id && hierarchy.name) {
          acc[hierarchy.type] = {
            id: hierarchy.id,
            name: hierarchy.name,
          };
        }
        return acc;
      },
      {} as Partial<Record<AbsenteeismHierarchyTypeEnum, IAbsenteeismTotalHierarchyModel>>,
    );

    if (prisma.workspace_id) {
      hierarchyMap.WORKSPACE = {
        id: prisma.workspace_id,
        name: prisma.workspace_name,
      };
    }

    if (prisma.homo_id) {
      hierarchyMap.HOMOGENEOUS_GROUP = {
        id: prisma.homo_id,
        name: prisma.homo_name,
      };
    }

    return new AbsenteeismTotalHierarchyResultBrowseModel({
      averageDays: Number(prisma.avg_absenteeism_per_employee) / 60 / 24 / prisma.daysInRange,
      total: Number(prisma.total_absenteeism_count),
      totalDays: Number(prisma.total_absenteeism_days) / 60 / 24,
      ...hierarchyMap,
    });
  }

  static toModels(prisma: IAbsenteeismTotalHierarchyResultBrowseModelMapper[], daysInRange: number): AbsenteeismTotalHierarchyResultBrowseModel[] {
    return prisma.map((rec) => AbsenteeismTotalHierarchyResultBrowseModelMapper.toModel({ ...rec, daysInRange }));
  }
}
