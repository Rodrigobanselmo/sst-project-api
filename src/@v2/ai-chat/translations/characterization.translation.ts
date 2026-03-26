import { HierarchyTypeEnum } from '@/@v2/shared/domain/enum/company/hierarchy-type.enum';
import { CharacterizationTypeEnum } from '@/@v2/shared/domain/enum/security/characterization-type.enum';
import { HomoTypeEnum } from '@/@v2/shared/domain/enum/security/homo-type.enum';

export const CharacterizationTypeTranslation: Record<CharacterizationTypeEnum, string> = {
  [CharacterizationTypeEnum.WORKSTATION]: 'Posto de trabalho',
  [CharacterizationTypeEnum.ACTIVITIES]: 'Atividades',
  [CharacterizationTypeEnum.EQUIPMENT]: 'Equipamento',
  [CharacterizationTypeEnum.ADMINISTRATIVE]: 'Ambiente Administrativo',
  [CharacterizationTypeEnum.OPERATION]: 'Ambiente Operacional',
  [CharacterizationTypeEnum.SUPPORT]: 'Ambiente Apoio',
  [CharacterizationTypeEnum.GENERAL]: 'Ambiente - Visão Geral',
};

export const HomoTypeTranslation: Record<HomoTypeEnum, string> = {
  [HomoTypeEnum.ENVIRONMENT]: 'Ambiente',
  [HomoTypeEnum.WORKSTATION]: 'Posto de Trabalho',
  [HomoTypeEnum.ACTIVITIES]: 'Atividade',
  [HomoTypeEnum.EQUIPMENT]: 'Equipamento',
  [HomoTypeEnum.HIERARCHY]: 'Cargo / Setor',
};

export const HierarchyTypeTranslation: Record<HierarchyTypeEnum, string> = {
  [HierarchyTypeEnum.DIRECTORY]: 'Superintendência',
  [HierarchyTypeEnum.MANAGEMENT]: 'Diretoria',
  [HierarchyTypeEnum.SECTOR]: 'Setor',
  [HierarchyTypeEnum.SUB_SECTOR]: 'Sub setor',
  [HierarchyTypeEnum.OFFICE]: 'Cargo',
  [HierarchyTypeEnum.SUB_OFFICE]: 'Cargo desenvolvido',
};
