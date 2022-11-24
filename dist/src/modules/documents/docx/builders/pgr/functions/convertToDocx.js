"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToDocxHelper = void 0;
const replaceAllVariables_1 = require("./replaceAllVariables");
const convertToDocxHelper = (data, variables) => {
    const child = Object.assign({}, data);
    if ('removeWithSomeEmptyVars' in child) {
        const isEmpty = child.removeWithSomeEmptyVars.some((variable) => !variables[variable]);
        if (isEmpty) {
            return null;
        }
    }
    if ('removeWithAllEmptyVars' in child) {
        const isEmpty = child.removeWithAllEmptyVars.every((variable) => !variables[variable]);
        if (isEmpty) {
            return null;
        }
    }
    if ('removeWithAllValidVars' in child) {
        const isNotEmpty = child.removeWithAllValidVars.every((variable) => variables[variable]);
        if (isNotEmpty) {
            return null;
        }
    }
    if ('addWithAllVars' in child) {
        const isNotEmpty = child.addWithAllVars.every((variable) => variables[variable]);
        if (!isNotEmpty) {
            return null;
        }
    }
    if ('text' in child) {
        child.text = (0, replaceAllVariables_1.replaceAllVariables)(child.text, Object.assign({}, variables));
    }
    return child;
};
exports.convertToDocxHelper = convertToDocxHelper;
//# sourceMappingURL=convertToDocx.js.map