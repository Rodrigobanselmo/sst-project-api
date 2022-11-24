"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requiredObsProc = exports.requiredOrdExams = exports.mapInverseResAso = exports.mapResAso = exports.mapInverseTpExameOcup = exports.mapTpExameOcup = exports.EnumResAso = exports.EnumTpExameOcup = void 0;
const client_1 = require("@prisma/client");
var EnumTpExameOcup;
(function (EnumTpExameOcup) {
    EnumTpExameOcup[EnumTpExameOcup["ADMI"] = 0] = "ADMI";
    EnumTpExameOcup[EnumTpExameOcup["PERI"] = 1] = "PERI";
    EnumTpExameOcup[EnumTpExameOcup["RETU"] = 2] = "RETU";
    EnumTpExameOcup[EnumTpExameOcup["CHAN"] = 3] = "CHAN";
    EnumTpExameOcup[EnumTpExameOcup["EVAL"] = 4] = "EVAL";
    EnumTpExameOcup[EnumTpExameOcup["DEMI"] = 9] = "DEMI";
})(EnumTpExameOcup = exports.EnumTpExameOcup || (exports.EnumTpExameOcup = {}));
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
exports.mapResAso = {
    [client_1.ExamHistoryTypeEnum.ADMI]: EnumTpExameOcup.ADMI,
    [client_1.ExamHistoryTypeEnum.PERI]: EnumTpExameOcup.PERI,
    [client_1.ExamHistoryTypeEnum.RETU]: EnumTpExameOcup.RETU,
    [client_1.ExamHistoryTypeEnum.CHAN]: EnumTpExameOcup.CHAN,
    [client_1.ExamHistoryTypeEnum.OFFI]: EnumTpExameOcup.CHAN,
    [client_1.ExamHistoryTypeEnum.EVAL]: EnumTpExameOcup.EVAL,
    [client_1.ExamHistoryTypeEnum.DEMI]: EnumTpExameOcup.DEMI,
};
exports.mapInverseResAso = {
    [EnumTpExameOcup.ADMI]: client_1.ExamHistoryTypeEnum.ADMI,
    [EnumTpExameOcup.PERI]: client_1.ExamHistoryTypeEnum.PERI,
    [EnumTpExameOcup.RETU]: client_1.ExamHistoryTypeEnum.RETU,
    [EnumTpExameOcup.CHAN]: client_1.ExamHistoryTypeEnum.CHAN,
    [EnumTpExameOcup.EVAL]: client_1.ExamHistoryTypeEnum.EVAL,
    [EnumTpExameOcup.DEMI]: client_1.ExamHistoryTypeEnum.DEMI,
};
exports.requiredOrdExams = ['0281'];
exports.requiredObsProc = ['0583', '0998', '0999', '1128', '1230', '1992', '1993', '1994', '1995', '1996', '1997', '1998', '1999', '9999'];
//# sourceMappingURL=event-2220.js.map