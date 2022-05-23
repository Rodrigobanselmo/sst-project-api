"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.statusEnumTranslateUsToBr = exports.statusEnumTranslateBrToUs = exports.StatusEnumTranslated = void 0;
const client_1 = require("@prisma/client");
var StatusEnumTranslated;
(function (StatusEnumTranslated) {
    StatusEnumTranslated["ACTIVE"] = "Ativo";
    StatusEnumTranslated["PROGRESS"] = "Progresso";
    StatusEnumTranslated["INACTIVE"] = "Inativo";
    StatusEnumTranslated["PENDING"] = "Pendente";
    StatusEnumTranslated["CANCELED"] = "Cancelado";
})(StatusEnumTranslated = exports.StatusEnumTranslated || (exports.StatusEnumTranslated = {}));
const statusEnumTranslateBrToUs = (portugueseValue) => {
    let keyValue = '';
    Object.entries(StatusEnumTranslated).forEach(([key, value]) => {
        if (portugueseValue == value)
            keyValue = client_1.StatusEnum[key];
    });
    return keyValue;
};
exports.statusEnumTranslateBrToUs = statusEnumTranslateBrToUs;
const statusEnumTranslateUsToBr = (portugueseValue) => {
    let keyValue = '';
    Object.entries(client_1.StatusEnum).forEach(([key, value]) => {
        if (portugueseValue == value)
            keyValue = StatusEnumTranslated[key];
    });
    return keyValue;
};
exports.statusEnumTranslateUsToBr = statusEnumTranslateUsToBr;
//# sourceMappingURL=statusEnum.translate.js.map