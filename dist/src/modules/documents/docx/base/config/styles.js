"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.borderNoneStyle = exports.sectionCoverProperties = exports.sectionProperties = void 0;
const docx_1 = require("docx");
exports.sectionProperties = {
    page: {
        margin: {
            bottom: 900,
            left: 567,
            right: 567,
            top: 567,
            footer: 100,
            header: 100,
        },
    },
};
exports.sectionCoverProperties = {
    page: {
        margin: {
            bottom: 1133,
            left: 1133,
            right: 1133,
            top: 1133,
            footer: 100,
            header: 100,
        },
    },
};
exports.borderNoneStyle = {
    top: { style: docx_1.BorderStyle.NIL, size: 0 },
    bottom: { style: docx_1.BorderStyle.NIL, size: 0 },
    left: { style: docx_1.BorderStyle.NIL, size: 0 },
    insideVertical: { style: docx_1.BorderStyle.NIL, size: 0 },
    insideHorizontal: { style: docx_1.BorderStyle.NIL, size: 0 },
    right: { style: docx_1.BorderStyle.NIL, size: 0 },
};
//# sourceMappingURL=styles.js.map