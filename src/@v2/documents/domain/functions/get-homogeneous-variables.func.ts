import { HomogeneousGroupModel } from "../models/homogeneous-group.model";

export function getHomogeneuosVariablesDomain(homogeneousGroups: HomogeneousGroupModel[]) {

    const variables = {
        hasEnviromentRisk: false,
        hasCharacterizationRisk: false,
        hasHierarchyRisk: false,
        hasGHORisk: false,
        hasEnviromentGeneral: false,
        hasEnviromentAdministrative: false,
        hasEnviromentOperation: false,
        hasEnviromentSupport: false,
        hasCharacterizationActivity: false,
        hasCharacterizationEquipment: false,
        hasCharacterizationWorkstation: false,
    }

    homogeneousGroups.forEach((homogeneousGroup) => {
        const hasRisk = homogeneousGroup.risksData({ documentType: 'isPGR' }).length

        if (hasRisk && homogeneousGroup.isEnviroment) variables.hasEnviromentRisk = true
        if (hasRisk && homogeneousGroup.isCharacterization) variables.hasCharacterizationRisk = true
        if (hasRisk && homogeneousGroup.isHierarchy) variables.hasHierarchyRisk = true
        if (hasRisk && homogeneousGroup.isGHO) variables.hasGHORisk = true

        if (homogeneousGroup.characterization?.type === 'GENERAL') variables.hasEnviromentGeneral = true
        if (homogeneousGroup.characterization?.type === 'ADMINISTRATIVE') variables.hasEnviromentAdministrative = true
        if (homogeneousGroup.characterization?.type === 'OPERATION') variables.hasEnviromentOperation = true
        if (homogeneousGroup.characterization?.type === 'SUPPORT') variables.hasEnviromentSupport = true
        if (homogeneousGroup.characterization?.type === 'ACTIVITIES') variables.hasCharacterizationActivity = true
        if (homogeneousGroup.characterization?.type === 'EQUIPMENT') variables.hasCharacterizationEquipment = true
        if (homogeneousGroup.characterization?.type === 'WORKSTATION') variables.hasCharacterizationWorkstation = true

    })

    return variables
}