"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringCapitalizeTransform = void 0;
const StringCapitalizeTransform = (data) => {
    const str = data.obj[data.key];
    if (!str)
        return null;
    if (typeof str === 'string') {
        const ignore = ['de', 'da', 'das', 'do', 'dos', 'a', 'e', 'o'];
        const arrWords = str.replace(/\s+/g, ' ').trim().split(' ');
        for (const i in arrWords) {
            if (ignore.indexOf(arrWords[i]) === -1) {
                arrWords[i] =
                    arrWords[i].charAt(0).toUpperCase() +
                        arrWords[i].toLowerCase().slice(1);
            }
        }
        return arrWords.join(' ');
    }
    return null;
};
exports.StringCapitalizeTransform = StringCapitalizeTransform;
//# sourceMappingURL=string-capitalize.js.map