/* eslint-disable prettier/prettier */
import { HierarchyEnum } from '@prisma/client';

import { bodyTableProps } from '../../elements/body';

export enum FirstRiskInventoryColumnEnum {
  SOURCE,
  REVIEW,
  ELABORATION_BY,
  APPROVE_BY,
  DATA,
  UNIT,
}

const RewRiskInventoryHeader = (): bodyTableProps[] => {
  const header: bodyTableProps[] = [];

  header[FirstRiskInventoryColumnEnum.SOURCE] = { text: 'Fonte:', bold: true };
  header[FirstRiskInventoryColumnEnum.REVIEW] = { text: 'Revisão:' , bold: true };
  header[FirstRiskInventoryColumnEnum.ELABORATION_BY] = { text: 'Elaborador:', bold: true  };
  header[FirstRiskInventoryColumnEnum.APPROVE_BY] = { text: 'Aprovação:', bold: true  };
  header[FirstRiskInventoryColumnEnum.DATA] = { text: 'Data:', bold: true };
  header[FirstRiskInventoryColumnEnum.UNIT] = { text: 'Estabelecimento:', bold: true  };

  return header;
};

export const firstRiskInventoryHeader = RewRiskInventoryHeader();

//! have two of these
export const hierarchyMap: Record<string, {text:string; index:number}> = {
  [HierarchyEnum.DIRECTORY]: {text:'DIRETORIA:', index: 0 },
  [HierarchyEnum.MANAGEMENT]: {text:'Gerência:', index: 1 },
  [HierarchyEnum.SECTOR]: {text:'Setor:', index: 2 },
  [HierarchyEnum.SUB_SECTOR]: {text:'Subsetor (Posto de Trabalho):', index: 3 },
  [HierarchyEnum.OFFICE]: {text:'Cargo:', index: 4 },
  [HierarchyEnum.SUB_OFFICE]: {text:'Cardo Desenvolvido:', index: 5 },
};
