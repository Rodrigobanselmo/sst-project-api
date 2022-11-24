"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExamHistoryTypeEnumTranslateUsToBr = exports.ExamHistoryTypeEnumTranslateBrToUs = exports.examHistoryTypeEnumTranslatedNotes = exports.examHistoryTypeEnumTranslatedList = exports.ExamHistoryTypeEnumNotes = exports.ExamHistoryTypeEnumTranslated = void 0;
const client_1 = require("@prisma/client");
var ExamHistoryTypeEnumTranslated;
(function (ExamHistoryTypeEnumTranslated) {
    ExamHistoryTypeEnumTranslated["ADMI"] = "ADM";
    ExamHistoryTypeEnumTranslated["PERI"] = "PER";
    ExamHistoryTypeEnumTranslated["RETU"] = "RET";
    ExamHistoryTypeEnumTranslated["CHAN"] = "MUD";
    ExamHistoryTypeEnumTranslated["DEMI"] = "DEM";
})(ExamHistoryTypeEnumTranslated = exports.ExamHistoryTypeEnumTranslated || (exports.ExamHistoryTypeEnumTranslated = {}));
var ExamHistoryTypeEnumNotes;
(function (ExamHistoryTypeEnumNotes) {
    ExamHistoryTypeEnumNotes["ADMI"] = "Admissional";
    ExamHistoryTypeEnumNotes["PERI"] = "Per\u00EDodico";
    ExamHistoryTypeEnumNotes["RETU"] = "Retorno ao trabalho";
    ExamHistoryTypeEnumNotes["CHAN"] = "Mudan\u00E7a de risco ocupacional";
    ExamHistoryTypeEnumNotes["DEMI"] = "Demissional";
})(ExamHistoryTypeEnumNotes = exports.ExamHistoryTypeEnumNotes || (exports.ExamHistoryTypeEnumNotes = {}));
exports.examHistoryTypeEnumTranslatedList = [
    ExamHistoryTypeEnumTranslated.ADMI,
    ExamHistoryTypeEnumTranslated.PERI,
    ExamHistoryTypeEnumTranslated.RETU,
    ExamHistoryTypeEnumTranslated.CHAN,
    ExamHistoryTypeEnumTranslated.DEMI,
];
exports.examHistoryTypeEnumTranslatedNotes = Object.entries(ExamHistoryTypeEnumTranslated).map(([key, value]) => `${value} : ${ExamHistoryTypeEnumNotes[key]}`);
const ExamHistoryTypeEnumTranslateBrToUs = (portugueseValue) => {
    let keyValue = '';
    Object.entries(ExamHistoryTypeEnumTranslated).forEach(([key, value]) => {
        if (portugueseValue == value)
            keyValue = client_1.ExamHistoryTypeEnum[key];
    });
    return keyValue;
};
exports.ExamHistoryTypeEnumTranslateBrToUs = ExamHistoryTypeEnumTranslateBrToUs;
const ExamHistoryTypeEnumTranslateUsToBr = (portugueseValue) => {
    let keyValue = '';
    Object.entries(client_1.ExamHistoryTypeEnum).forEach(([key, value]) => {
        if (portugueseValue == value)
            keyValue = ExamHistoryTypeEnumTranslated[key];
    });
    return keyValue;
};
exports.ExamHistoryTypeEnumTranslateUsToBr = ExamHistoryTypeEnumTranslateUsToBr;
//# sourceMappingURL=examType.translate.js.map