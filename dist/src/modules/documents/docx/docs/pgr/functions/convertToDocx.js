"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToDocx = void 0;
const elementTypeMap_1 = require("../constants/elementTypeMap");
const replaceAllVariables_1 = require("./replaceAllVariables");
const convertToDocx = (data, variables) => {
    return data.map((child) => {
        if ('text' in child) {
            child.text = (0, replaceAllVariables_1.replaceAllVariables)(child.text, variables);
        }
        return elementTypeMap_1.elementTypeMap[child.type](child, variables);
    });
};
exports.convertToDocx = convertToDocx;
//# sourceMappingURL=convertToDocx.js.map