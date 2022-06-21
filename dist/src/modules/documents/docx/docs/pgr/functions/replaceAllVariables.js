"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceAllVariables = void 0;
const replaceAllVariables = (text, variables) => {
    let textReplacement = text;
    if (text)
        variables.forEach((variable) => {
            textReplacement = textReplacement.replaceAll(`??${variable.placeholder}??`, variable.value);
        });
    return textReplacement;
};
exports.replaceAllVariables = replaceAllVariables;
//# sourceMappingURL=replaceAllVariables.js.map