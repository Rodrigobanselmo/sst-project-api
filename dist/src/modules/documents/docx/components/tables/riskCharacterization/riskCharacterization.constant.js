"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.riskCharacterizationHeader = exports.RiskCharacterizationColumnEnum = void 0;
const docx_1 = require("docx");
const palette_1 = require("../../../../../../shared/constants/palette");
const styles_1 = require("../../../base/config/styles");
var RiskCharacterizationColumnEnum;
(function (RiskCharacterizationColumnEnum) {
    RiskCharacterizationColumnEnum[RiskCharacterizationColumnEnum["AGENT"] = 0] = "AGENT";
    RiskCharacterizationColumnEnum[RiskCharacterizationColumnEnum["CAS"] = 1] = "CAS";
    RiskCharacterizationColumnEnum[RiskCharacterizationColumnEnum["PROPAGATION"] = 2] = "PROPAGATION";
    RiskCharacterizationColumnEnum[RiskCharacterizationColumnEnum["UNIT"] = 3] = "UNIT";
    RiskCharacterizationColumnEnum[RiskCharacterizationColumnEnum["NR15LT"] = 4] = "NR15LT";
    RiskCharacterizationColumnEnum[RiskCharacterizationColumnEnum["ACGIH_TWA"] = 5] = "ACGIH_TWA";
    RiskCharacterizationColumnEnum[RiskCharacterizationColumnEnum["ACGIH_STEL"] = 6] = "ACGIH_STEL";
    RiskCharacterizationColumnEnum[RiskCharacterizationColumnEnum["IPVS"] = 7] = "IPVS";
    RiskCharacterizationColumnEnum[RiskCharacterizationColumnEnum["PV"] = 8] = "PV";
    RiskCharacterizationColumnEnum[RiskCharacterizationColumnEnum["PE"] = 9] = "PE";
    RiskCharacterizationColumnEnum[RiskCharacterizationColumnEnum["CARNOGENICITY_ACGIH"] = 10] = "CARNOGENICITY_ACGIH";
    RiskCharacterizationColumnEnum[RiskCharacterizationColumnEnum["CARNOGENICITY_LINACH"] = 11] = "CARNOGENICITY_LINACH";
    RiskCharacterizationColumnEnum[RiskCharacterizationColumnEnum["BEI"] = 12] = "BEI";
    RiskCharacterizationColumnEnum[RiskCharacterizationColumnEnum["SEVERITY"] = 13] = "SEVERITY";
    RiskCharacterizationColumnEnum[RiskCharacterizationColumnEnum["SYMPTOMS"] = 14] = "SYMPTOMS";
    RiskCharacterizationColumnEnum[RiskCharacterizationColumnEnum["EFFECT_BODY"] = 15] = "EFFECT_BODY";
})(RiskCharacterizationColumnEnum = exports.RiskCharacterizationColumnEnum || (exports.RiskCharacterizationColumnEnum = {}));
const NewRiskCharacterizationHeader = () => {
    const header = [];
    header[RiskCharacterizationColumnEnum.AGENT] = {
        text: 'Agentes',
        size: 4,
        textDirection: docx_1.TextDirection.LEFT_TO_RIGHT_TOP_TO_BOTTOM,
        borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string),
    };
    header[RiskCharacterizationColumnEnum.CAS] = {
        text: 'N° CAS',
        size: 2,
        borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string),
    };
    header[RiskCharacterizationColumnEnum.PROPAGATION] = {
        text: 'Meio de Agentes No CAS Propagação',
        size: 2,
        borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string),
    };
    header[RiskCharacterizationColumnEnum.UNIT] = {
        text: 'Unidade',
        size: 2,
        borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string),
    };
    header[RiskCharacterizationColumnEnum.NR15LT] = {
        text: 'NR-15 LT (ppm)',
        size: 2,
        borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string),
    };
    header[RiskCharacterizationColumnEnum.ACGIH_TWA] = {
        text: 'ACGIH TWA',
        size: 3,
        borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string),
    };
    header[RiskCharacterizationColumnEnum.ACGIH_STEL] = {
        text: 'ACGIH STEL',
        size: 2,
        borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string),
    };
    header[RiskCharacterizationColumnEnum.IPVS] = {
        text: 'IPVS/IDHL',
        size: 2,
        borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string),
    };
    header[RiskCharacterizationColumnEnum.PV] = {
        text: 'PV (mmHg)',
        size: 2,
        borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string),
    };
    header[RiskCharacterizationColumnEnum.PE] = {
        text: 'PE (°C)',
        size: 2,
        borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string),
    };
    header[RiskCharacterizationColumnEnum.CARNOGENICITY_ACGIH] = {
        text: 'Carcinogenicidade ACGIH',
        size: 2,
        borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string),
    };
    header[RiskCharacterizationColumnEnum.CARNOGENICITY_LINACH] = {
        text: 'Carcinogenicidade LINACH',
        size: 2,
        borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string),
    };
    header[RiskCharacterizationColumnEnum.BEI] = {
        text: 'BEI/Exame Complementar (ACGIH/NR07)',
        size: 2,
        borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string),
    };
    header[RiskCharacterizationColumnEnum.SEVERITY] = {
        text: 'Severidade',
        size: 1,
        borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string),
    };
    header[RiskCharacterizationColumnEnum.SYMPTOMS] = {
        text: 'SINTOMAS',
        size: 4,
        textDirection: docx_1.TextDirection.LEFT_TO_RIGHT_TOP_TO_BOTTOM,
        borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string),
    };
    header[RiskCharacterizationColumnEnum.EFFECT_BODY] = {
        text: 'Efeitos Sinérgicos (Órgãos Alvo)',
        size: 4,
        textDirection: docx_1.TextDirection.LEFT_TO_RIGHT_TOP_TO_BOTTOM,
        borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string),
    };
    return header;
};
exports.riskCharacterizationHeader = NewRiskCharacterizationHeader();
//# sourceMappingURL=riskCharacterization.constant.js.map