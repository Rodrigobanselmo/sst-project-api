import { HierarchyEnum } from '@prisma/client';
import { palette } from '../../../../../../shared/constants/palette';
import { borderStyleGlobal } from '../../../base/config/styles';

export enum HierarchyPlanColumnEnum {
  GSE = 'GSE',
  DESCRIPTION = 'Description',
}

export const HierarchyPlanMap: Record<string, { text: string; size: number; position?: number; borders: any }> = {
  [HierarchyPlanColumnEnum.GSE]: {
    text: 'GSE',
    size: 2,
    borders: borderStyleGlobal(palette.common.white.string),
  },
  [HierarchyPlanColumnEnum.DESCRIPTION]: {
    text: 'Características do GSE',
    size: 5,
    borders: borderStyleGlobal(palette.common.white.string),
  },
  [HierarchyEnum.DIRECTORY]: {
    text: 'DIRETORIA',
    size: 3,
    position: 0,
    borders: borderStyleGlobal(palette.common.white.string),
  },
  [HierarchyEnum.MANAGEMENT]: {
    text: 'GERÊNCIA',
    size: 3,
    position: 1,
    borders: borderStyleGlobal(palette.common.white.string),
  },
  [HierarchyEnum.SECTOR]: {
    text: 'SETOR',
    size: 3,
    position: 2,
    borders: borderStyleGlobal(palette.common.white.string),
  },
  [HierarchyEnum.SUB_SECTOR]: {
    text: 'SUB-SETOR',
    size: 3,
    position: 3,
    borders: borderStyleGlobal(palette.common.white.string),
  },
  [HierarchyEnum.OFFICE]: {
    text: 'CARGO',
    size: 3,
    position: 4,
    borders: borderStyleGlobal(palette.common.white.string),
  },
  [HierarchyEnum.SUB_OFFICE]: {
    text: 'CARGO DESENVOLVIDO',
    size: 3,
    position: 5,
    borders: borderStyleGlobal(palette.common.white.string),
  },
};
