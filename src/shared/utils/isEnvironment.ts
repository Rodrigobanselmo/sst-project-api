import { CharacterizationTypeEnum } from '@prisma/client';

export const isEnvironment = (type: CharacterizationTypeEnum) => {
  return (
    [
      CharacterizationTypeEnum.ADMINISTRATIVE,
      CharacterizationTypeEnum.OPERATION,
      CharacterizationTypeEnum.SUPPORT,
      CharacterizationTypeEnum.GENERAL,
    ] as CharacterizationTypeEnum[]
  ).includes(type);
};
