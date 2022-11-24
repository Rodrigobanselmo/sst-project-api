"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceAllVariables = void 0;
const isOdd_1 = require("../../../../../../shared/utils/isOdd");
const replaceAllVariables = (text, variables) => {
    if (text) {
        return text
            .split('??')
            .map((variable, index) => {
            if ((0, isOdd_1.isOdd)(index)) {
                return variables[variable];
            }
            return variable;
        })
            .join('');
    }
    return text;
};
exports.replaceAllVariables = replaceAllVariables;
//# sourceMappingURL=iterateArray.js.map