/* eslint-disable prettier/prettier */
import { HierarchyEnum } from '@prisma/client';
import { headerTableProps } from '../../elements/header';

export enum FirstRiskInventoryColumnEnum {
  INFO,
  HIERARCHY,
  MORE,
}

const rows = ["Fonte:", ]

const RewRiskInventoryHeader = (): headerTableProps[] => {
  const header: headerTableProps[] = [];

  header[FirstRiskInventoryColumnEnum.INFO] = { text: 'ITEM' }
  header[FirstRiskInventoryColumnEnum.HIERARCHY] = { text: 'GSE' }
  header[FirstRiskInventoryColumnEnum.MORE] = { text: 'PERIGOS\nFATORES DE RISCO' }

  return header
};

export const firstRiskInventoryHeader = RewRiskInventoryHeader()


export const riskInventoryTitle: string[] = [
  'PLANO DE AÇÃO',
  'PGR - PROGRAMA DE GERENCIAMENTO DE RISCOS',
];



  export const hierarchyMap: Record<string, {text:string; index:number}> = {
    [HierarchyEnum.DIRECTORY]: {text:'DIRETORIA:', index:0},
    [HierarchyEnum.MANAGEMENT]: {text:'Gerência:', index:1},
    [HierarchyEnum.SECTOR]: {text:'Setor:', index:2},
    [HierarchyEnum.SUB_SECTOR]: {text:'Subsetor (Posto de Trabalho):', index:3},
    [HierarchyEnum.OFFICE]: {text:'Cargo:', index:4},
    [HierarchyEnum.SUB_OFFICE]: {text:'Cardo Desenvolvido:', index:5},

  };
