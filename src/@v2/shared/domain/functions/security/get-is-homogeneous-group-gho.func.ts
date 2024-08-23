
export const getIsHomogeneousGroupGHO = ({ isHierarchy, isCharacterization, isEnviroment }: {
    isHierarchy: boolean;
    isCharacterization: boolean;
    isEnviroment: boolean;
}) => {
    return !isHierarchy && !isCharacterization && !isEnviroment

};