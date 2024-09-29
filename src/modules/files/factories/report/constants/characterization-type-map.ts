import { CharacterizationTypeEnum } from "@prisma/client";

type CharacterizationTypeMapValue = {
  rowLabel: string;
};

export const CharacterizationTypeMap: Record<
  CharacterizationTypeEnum,
  CharacterizationTypeMapValue
> = {
  [CharacterizationTypeEnum.GENERAL]: { rowLabel: 'Visão Geral' },
  [CharacterizationTypeEnum.SUPPORT]: { rowLabel: 'Amb. de Apoio' },
  [CharacterizationTypeEnum.ADMINISTRATIVE]: {
    rowLabel: 'Amb. Administrativo',
  },
  [CharacterizationTypeEnum.OPERATION]: { rowLabel: 'Amb. Operacional' },
  [CharacterizationTypeEnum.ACTIVITIES]: { rowLabel: 'Atividade' },
  [CharacterizationTypeEnum.EQUIPMENT]: { rowLabel: 'Equipamento' },
  [CharacterizationTypeEnum.WORKSTATION]: { rowLabel: 'Posto de Trabalho' },
};
