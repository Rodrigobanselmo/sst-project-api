import { CharacterizationTypeEnum } from "../../enum/security/characterization-type.enum";

export const getCharacterizationType = (type: CharacterizationTypeEnum) => {
    const isEnviroment = (
        [
            CharacterizationTypeEnum.ADMINISTRATIVE,
            CharacterizationTypeEnum.OPERATION,
            CharacterizationTypeEnum.SUPPORT,
            CharacterizationTypeEnum.GENERAL,
        ] as CharacterizationTypeEnum[]
    ).includes(type);

    return {
        isEnviroment,
        isCharacterization: !isEnviroment,
    }
};