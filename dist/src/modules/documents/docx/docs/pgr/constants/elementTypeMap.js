"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.elementTypeMap = void 0;
const bullets_1 = require("../../../base/elements/bullets");
const heading_1 = require("../../../base/elements/heading");
const paragraphs_1 = require("../../../base/elements/paragraphs");
const elements_types_1 = require("../types/elements.types");
exports.elementTypeMap = {
    [elements_types_1.PGRSectionChildrenTypeEnum.H1]: ({ text }) => (0, heading_1.h1)(text),
    [elements_types_1.PGRSectionChildrenTypeEnum.H2]: ({ text }) => (0, heading_1.h2)(text),
    [elements_types_1.PGRSectionChildrenTypeEnum.H3]: ({ text }) => (0, heading_1.h3)(text),
    [elements_types_1.PGRSectionChildrenTypeEnum.H4]: ({ text }) => (0, heading_1.h4)(text),
    [elements_types_1.PGRSectionChildrenTypeEnum.H5]: ({ text }) => (0, heading_1.h5)(text),
    [elements_types_1.PGRSectionChildrenTypeEnum.H6]: ({ text }) => (0, heading_1.h6)(text),
    [elements_types_1.PGRSectionChildrenTypeEnum.BREAK]: ({}) => (0, paragraphs_1.pageBreak)(),
    [elements_types_1.PGRSectionChildrenTypeEnum.TITLE]: ({ text }) => (0, heading_1.title)(text),
    [elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH]: ({ text }) => (0, paragraphs_1.paragraphNormal)(text),
    [elements_types_1.PGRSectionChildrenTypeEnum.BULLET]: ({ level, text }) => (0, bullets_1.bulletsNormal)(text, level),
};
//# sourceMappingURL=elementTypeMap.js.map