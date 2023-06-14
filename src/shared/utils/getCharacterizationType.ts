import { CharacterizationTypeEnum, HomoTypeEnum } from '@prisma/client';
import { isEnvironment } from './isEnvironment';


export const getCharacterizationType = (type: CharacterizationTypeEnum) => {
    if (isEnvironment(type)) return HomoTypeEnum.ENVIRONMENT;

    return type as HomoTypeEnum;
};
