"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requiredDescAg = exports.requiredTpAval = exports.requiredLimTol = exports.mapInverseTpExameOcup = exports.mapTpExameOcup = exports.EnumResAso = exports.UnMedEnum = exports.utileEpiEpcEnum = exports.YesNoEnum = exports.TpInscEnum = exports.TpAvalEnum = exports.LocalAmbEnum = void 0;
const client_1 = require("@prisma/client");
var LocalAmbEnum;
(function (LocalAmbEnum) {
    LocalAmbEnum[LocalAmbEnum["OWNER"] = 1] = "OWNER";
    LocalAmbEnum[LocalAmbEnum["NOT_OWNER"] = 2] = "NOT_OWNER";
})(LocalAmbEnum = exports.LocalAmbEnum || (exports.LocalAmbEnum = {}));
var TpAvalEnum;
(function (TpAvalEnum) {
    TpAvalEnum[TpAvalEnum["QUANTITY"] = 1] = "QUANTITY";
    TpAvalEnum[TpAvalEnum["QUALITY"] = 2] = "QUALITY";
})(TpAvalEnum = exports.TpAvalEnum || (exports.TpAvalEnum = {}));
var TpInscEnum;
(function (TpInscEnum) {
    TpInscEnum[TpInscEnum["CNPJ"] = 1] = "CNPJ";
    TpInscEnum[TpInscEnum["CAEPF"] = 3] = "CAEPF";
    TpInscEnum[TpInscEnum["CNO"] = 4] = "CNO";
})(TpInscEnum = exports.TpInscEnum || (exports.TpInscEnum = {}));
var YesNoEnum;
(function (YesNoEnum) {
    YesNoEnum["YES"] = "S";
    YesNoEnum["NO"] = "N";
})(YesNoEnum = exports.YesNoEnum || (exports.YesNoEnum = {}));
var utileEpiEpcEnum;
(function (utileEpiEpcEnum) {
    utileEpiEpcEnum[utileEpiEpcEnum["NOT_APT"] = 0] = "NOT_APT";
    utileEpiEpcEnum[utileEpiEpcEnum["NOT_IMPLEMENTED"] = 1] = "NOT_IMPLEMENTED";
    utileEpiEpcEnum[utileEpiEpcEnum["IMPLEMENTED"] = 2] = "IMPLEMENTED";
})(utileEpiEpcEnum = exports.utileEpiEpcEnum || (exports.utileEpiEpcEnum = {}));
exports.UnMedEnum = {
    ['dose diária de ruído']: 1,
    ['dB (linear)']: 2,
    ['dB(C)']: 3,
    ['dB(A)']: 4,
    ['m/s2']: 5,
    ['m/s1,75']: 6,
    ['ppm']: 7,
    ['mg/m3']: 8,
    ['f/cm3']: 9,
    ['ºC']: 10,
    ['m/s']: 11,
    ['%']: 12,
    ['lx']: 13,
    ['ufc/m3']: 14,
    ['dose diária']: 15,
    ['dose mensal']: 16,
    ['dose trimestral']: 17,
    ['dose anual']: 18,
    ['W/m2']: 19,
    ['A/m']: 20,
    ['mT']: 21,
    ['μT']: 22,
    ['mA']: 23,
    ['kV/m']: 24,
    ['V/m']: 25,
    ['J/m2']: 26,
    ['mJ/cm2']: 27,
    ['mSv']: 28,
    ['mppdc']: 29,
    ['UR (%)']: 30,
};
var EnumResAso;
(function (EnumResAso) {
    EnumResAso[EnumResAso["APT"] = 1] = "APT";
    EnumResAso[EnumResAso["INAPT"] = 2] = "INAPT";
})(EnumResAso = exports.EnumResAso || (exports.EnumResAso = {}));
exports.mapTpExameOcup = {
    [client_1.ExamHistoryEvaluationEnum.APTO]: EnumResAso.APT,
    [client_1.ExamHistoryEvaluationEnum.INAPT]: EnumResAso.INAPT,
    [client_1.ExamHistoryEvaluationEnum.NONE]: null,
    [client_1.ExamHistoryEvaluationEnum.INCONCLUSIVE]: null,
};
exports.mapInverseTpExameOcup = {
    [EnumResAso.APT]: client_1.ExamHistoryEvaluationEnum.APTO,
    [EnumResAso.INAPT]: client_1.ExamHistoryEvaluationEnum.INAPT,
};
exports.requiredLimTol = ['02.01.014', '01.18.001'];
exports.requiredTpAval = ['09.01.001'];
exports.requiredDescAg = ['01.01.001', '01.02.001', '01.03.001', '01.04.001', '01.05.001', '01.06.001', '01.07.001', '01.08.001', '01.09.001', '01.10.001', '01.12.001', '01.13.001', '01.14.001', '01.15.001', '01.16.001', '01.17.001', '01.18.001', '05.01.001'];
//# sourceMappingURL=event-2240.js.map