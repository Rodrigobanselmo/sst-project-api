"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SexTypeEnumTranslateUsToBr = exports.SexTypeEnumTranslateBrToUs = exports.SexTypeEnumTranslatedNotes = exports.SexTypeEnumTranslatedList = exports.SexTypeEnumNotes = exports.SexTypeEnumTranslated = void 0;
const client_1 = require("@prisma/client");
var SexTypeEnumTranslated;
(function (SexTypeEnumTranslated) {
    SexTypeEnumTranslated["M"] = "M";
    SexTypeEnumTranslated["F"] = "F";
})(SexTypeEnumTranslated = exports.SexTypeEnumTranslated || (exports.SexTypeEnumTranslated = {}));
var SexTypeEnumNotes;
(function (SexTypeEnumNotes) {
    SexTypeEnumNotes["M"] = "Masculino";
    SexTypeEnumNotes["F"] = "Feminino";
})(SexTypeEnumNotes = exports.SexTypeEnumNotes || (exports.SexTypeEnumNotes = {}));
exports.SexTypeEnumTranslatedList = [SexTypeEnumTranslated.M, SexTypeEnumTranslated.F];
exports.SexTypeEnumTranslatedNotes = Object.entries(SexTypeEnumTranslated).map(([key, value]) => `${value} : ${SexTypeEnumNotes[key]}`);
const SexTypeEnumTranslateBrToUs = (portugueseValue) => {
    let keyValue = '';
    Object.entries(SexTypeEnumTranslated).forEach(([key, value]) => {
        if (portugueseValue.substring(0, 1).toUpperCase() == value)
            keyValue = client_1.SexTypeEnum[key];
    });
    return keyValue;
};
exports.SexTypeEnumTranslateBrToUs = SexTypeEnumTranslateBrToUs;
const SexTypeEnumTranslateUsToBr = (portugueseValue) => {
    let keyValue = '';
    Object.entries(client_1.SexTypeEnum).forEach(([key, value]) => {
        if (portugueseValue == value)
            keyValue = SexTypeEnumTranslated[key];
    });
    return keyValue;
};
exports.SexTypeEnumTranslateUsToBr = SexTypeEnumTranslateUsToBr;
//# sourceMappingURL=sexType.translate.js.map