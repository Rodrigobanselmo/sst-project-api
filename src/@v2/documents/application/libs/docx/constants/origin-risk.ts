import { CharacterizationTypeEnum, HierarchyEnum } from '@prisma/client';

export const originRiskMap: Record<string, { name: string; type: string; prioritization?: number }> = {
  [CharacterizationTypeEnum.GENERAL]: {
    name: 'Visão Geral',
    type: 'Ambiente',
  },
  [CharacterizationTypeEnum.ADMINISTRATIVE]: {
    name: 'Ambiente Administrativo',
    type: 'Ambiente',
  },
  [CharacterizationTypeEnum.OPERATION]: {
    name: 'Ambiente Operacional',
    type: 'Ambiente',
  },
  [CharacterizationTypeEnum.SUPPORT]: {
    name: 'Ambiente de Apoio',
    type: 'Ambiente',
  },
  [CharacterizationTypeEnum.ACTIVITIES]: {
    name: 'Atividade',
    type: 'Mão de Obra',
  },
  [CharacterizationTypeEnum.EQUIPMENT]: {
    name: 'Equipamento',
    type: 'Mão de Obra',
  },
  [CharacterizationTypeEnum.WORKSTATION]: {
    name: 'Posto de Trabalho',
    type: 'Mão de Obra',
  },
  [HierarchyEnum.DIRECTORY]: {
    name: 'Diretoria',
    type: 'Nível Hierarquico',
    prioritization: 7,
  },
  [HierarchyEnum.MANAGEMENT]: {
    name: 'Gerência',
    type: 'Nível Hierarquico',
    prioritization: 6,
  },
  [HierarchyEnum.SECTOR]: {
    name: 'Setor',
    type: 'Nível Hierarquico',
    prioritization: 5,
  },
  [HierarchyEnum.SUB_SECTOR]: {
    name: 'Sub Setor',
    type: 'Nível Hierarquico',
    prioritization: 4,
  },
  [HierarchyEnum.OFFICE]: {
    name: 'Cargo',
    type: 'Nível Hierarquico',
    prioritization: 2,
  },
  [HierarchyEnum.SUB_OFFICE]: {
    name: 'Cargo Desenvolvido',
    type: 'Nível Hierarquico',
    prioritization: 1,
  },
};
