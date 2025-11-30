import { HierarchyTypeEnum } from '@/@v2/shared/domain/enum/company/hierarchy-type.enum';

export const hierarchyMap: Record<HierarchyTypeEnum, { text: string }> = {
  [HierarchyTypeEnum.DIRECTORY]: { text: 'Diretoria' },
  [HierarchyTypeEnum.MANAGEMENT]: { text: 'Gerência' },
  [HierarchyTypeEnum.SECTOR]: { text: 'Setor' },
  [HierarchyTypeEnum.SUB_SECTOR]: { text: 'Subsetor (Posto de Trabalho)' },
  [HierarchyTypeEnum.OFFICE]: { text: 'Cargo' },
  [HierarchyTypeEnum.SUB_OFFICE]: { text: 'Cardo Desenvolvido' },
};
