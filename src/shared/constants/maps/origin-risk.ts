import {
  CharacterizationTypeEnum,
  CompanyEnvironmentTypesEnum,
  HierarchyEnum,
} from '@prisma/client';

export const originRiskMap: Record<string, { name: string }> = {
  [CompanyEnvironmentTypesEnum.ADMINISTRATIVE]: {
    name: 'Ambiente Administrativo',
  },
  [CompanyEnvironmentTypesEnum.OPERATION]: { name: 'Ambiente Operacional' },
  [CompanyEnvironmentTypesEnum.SUPPORT]: { name: 'Ambiente de Apoio' },
  [CharacterizationTypeEnum.ACTIVITIES]: { name: 'Atividade' },
  [CharacterizationTypeEnum.EQUIPMENT]: { name: 'Equipamento' },
  [CharacterizationTypeEnum.WORKSTATION]: { name: 'Posto de Trabalho' },
  [HierarchyEnum.DIRECTORY]: { name: 'Diretoria' },
  [HierarchyEnum.MANAGEMENT]: { name: 'Gerência' },
  [HierarchyEnum.SECTOR]: { name: 'Setor' },
  [HierarchyEnum.SUB_SECTOR]: { name: 'Sub Setor' },
  [HierarchyEnum.OFFICE]: { name: 'Cargo' },
  [HierarchyEnum.SUB_OFFICE]: { name: 'Cargo Desenvolvido' },
};
