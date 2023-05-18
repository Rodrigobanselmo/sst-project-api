import { HierarchyEnum } from '@prisma/client';

export const hierarchyList = [
  HierarchyEnum.DIRECTORY,
  HierarchyEnum.MANAGEMENT,
  HierarchyEnum.SECTOR,
  HierarchyEnum.SUB_SECTOR,
  HierarchyEnum.OFFICE,
  HierarchyEnum.SUB_OFFICE,
];

export const hierarchyListReversed = [
  HierarchyEnum.SUB_OFFICE,
  HierarchyEnum.OFFICE,
  HierarchyEnum.SUB_SECTOR,
  HierarchyEnum.SECTOR,
  HierarchyEnum.MANAGEMENT,
  HierarchyEnum.DIRECTORY,
];
