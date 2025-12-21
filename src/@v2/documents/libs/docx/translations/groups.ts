import { HomoTypeEnum } from '@/@v2/shared/domain/enum/security/homo-type.enum';

export const homogeneousGroupMap: Record<HomoTypeEnum, { text: string }> = {
  [HomoTypeEnum.HIERARCHY]: { text: 'Hierarquia' },
  [HomoTypeEnum.ENVIRONMENT]: { text: 'Ambientes' },
  [HomoTypeEnum.WORKSTATION]: { text: 'Postos de Trabalho' },
  [HomoTypeEnum.EQUIPMENT]: { text: 'Equipamentos' },
  [HomoTypeEnum.ACTIVITIES]: { text: 'Atividades' },
};
