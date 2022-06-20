"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataConverter = void 0;
const docx_1 = require("docx");
const body_1 = require("../../elements/body");
const header_1 = require("../../elements/header");
const dataConverter = (hierarchyData) => {
    return [
        {
            text: hierarchyData.descRh,
            alignment: docx_1.AlignmentType.CENTER,
            borders: header_1.borderRightStyle,
        },
        {
            text: hierarchyData.descReal,
            alignment: docx_1.AlignmentType.CENTER,
            borders: body_1.borderNoneStyle,
        },
    ];
};
exports.dataConverter = dataConverter;
//# sourceMappingURL=second.converter.js.map