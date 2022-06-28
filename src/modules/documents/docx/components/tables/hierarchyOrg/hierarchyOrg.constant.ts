/* eslint-disable prettier/prettier */
import { HierarchyEnum } from '@prisma/client';

export enum HierarchyPlanColumnEnum {
  GSE = 'GSE',
  DESCRIPTION = 'Description',
}

export const HierarchyPlanMap: Record<string, {text: string; size:number; position?: number;}> = {
  [HierarchyPlanColumnEnum.GSE] : { text: 'GSE', size: 2 },
  [HierarchyPlanColumnEnum.DESCRIPTION] : { text: 'Características do GSE', size: 5 },
  [HierarchyEnum.DIRECTORY]: { text: 'DIRETORIA', size: 3, position:0 },
  [HierarchyEnum.MANAGEMENT]: { text: 'GERÊNCIA', size: 3, position:1 },
  [HierarchyEnum.SECTOR]: { text: 'SETOR', size: 3, position:2 },
  [HierarchyEnum.SUB_SECTOR]: { text: 'SUB-SETOR', size: 3, position:3 },
  [HierarchyEnum.OFFICE]: { text: 'CARGO', size: 3 , position:4},
  [HierarchyEnum.SUB_OFFICE]: { text: 'CARGO DESENVOLVIDO', size: 3, position:5 },
}

