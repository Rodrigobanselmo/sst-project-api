import { RiskDataModel } from "../models/risk-data.model";
import { RiskTypeEnum } from '@/@v2/shared/domain/enum/security/risk-type.enum';

export function getRiskDataVariablesDomain(risksData: RiskDataModel[]) {

    const variables = {
        hasFis: false,
        hasQui: false,
        hasBio: false,
        hasErg: false,
        hasAci: false,
        hasQuantity: false,
        hasQuantityNoise: false,
        hasQuantityQui: false,
        hasQuantityVibrationFB: false,
        hasQuantityVibrationL: false,
        hasQuantityRadiation: false,
        hasQuantityHeat: false,
        hasHeat: false,
        hasVibrationFB: false,
        hasVibrationL: false,
        isEmergency: false,
    }

    risksData.forEach((riskData) => {
        const isFis = riskData.risk.type === RiskTypeEnum.FIS
        if (isFis) variables.hasFis = true

        const isQui = riskData.risk.type === RiskTypeEnum.QUI
        if (isQui) variables.hasQui = true

        const isBio = riskData.risk.type === RiskTypeEnum.BIO
        if (isBio) variables.hasBio = true

        const isErg = riskData.risk.type === RiskTypeEnum.ERG
        if (isErg) variables.hasErg = true

        const isAci = riskData.risk.type === RiskTypeEnum.ACI
        if (isAci) variables.hasAci = true

        const isQuantity = riskData.isQuantity
        if (isQuantity) variables.hasQuantity = true

        const isQuantityNoise = riskData.quantityNoise
        if (isQuantityNoise && isQuantity) variables.hasQuantityNoise = true

        const isQuantityQui = riskData.quantityQui
        if (isQuantityQui && isQuantity) variables.hasQuantityQui = true

        const isQuantityVibrationFB = riskData.quantityVibrationFB
        if (isQuantityVibrationFB && isQuantity) variables.hasQuantityVibrationFB = true

        const isQuantityVibrationL = riskData.quantityVibrationL
        if (isQuantityVibrationL && isQuantity) variables.hasQuantityVibrationL = true

        const isQuantityRadiation = riskData.quantityRadiation
        if (isQuantityRadiation && isQuantity) variables.hasQuantityRadiation = true

        const isQuantityHeat = riskData.quantityHeat
        if (isQuantityHeat && isQuantity) variables.hasQuantityHeat = true

        const isHeat = riskData.risk.id === 'fda7e05a-0f90-4720-8429-c44a56109411' || riskData.risk.name === 'Temperaturas anormais (calor)'
        if (isHeat && isFis) variables.hasHeat = true

        const isVFB = riskData.risk.id === 'd6c59841-9e2e-4a59-b069-86c28ae05507' || riskData.risk.name === 'Vibrações de Corpo Inteiro'
        if (isVFB && isFis) variables.hasVibrationFB = true

        const isVL = riskData.risk.id === '0fc5e0d1-b455-4b77-a583-9a6170ecc2a9' || riskData.risk.name === 'Vibrações Localizadas (Mão-Braço)'
        if (isVL && isFis) variables.hasVibrationL = true

        const isEmergency = riskData.risk.isEmergency
        if (isEmergency) variables.isEmergency = true
    })

    return variables
}