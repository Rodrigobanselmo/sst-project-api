"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sectionTypeMap = void 0;
const chapter_1 = require("../../../base/layouts/chapter/chapter");
const cover_1 = require("../../../base/layouts/cover/cover");
const headerAndFooter_1 = require("../../../base/layouts/headerAndFooter/headerAndFooter");
const summary_1 = require("../../../base/layouts/summary/summary");
const convertToDocx_1 = require("../functions/convertToDocx");
const replaceAllVariables_1 = require("../functions/replaceAllVariables");
const section_types_1 = require("../types/section.types");
const sectionTypeMap = ({ logoPath, version, }) => ({
    [section_types_1.PGRSectionTypeEnum.SECTION]: ({ children, version, footerText }, variables) => (Object.assign({ children: (0, convertToDocx_1.convertToDocx)(children, variables) }, (0, headerAndFooter_1.headerAndFooter)({
        footerText: (0, replaceAllVariables_1.replaceAllVariables)(footerText, variables),
        logoPath,
        version,
    }))),
    [section_types_1.PGRSectionTypeEnum.COVER]: ({}) => (0, cover_1.coverSections)({
        imgPath: logoPath,
        version,
    }),
    [section_types_1.PGRSectionTypeEnum.CHAPTER]: ({ text }, variables) => (0, chapter_1.chapterSection)({ version, chapter: (0, replaceAllVariables_1.replaceAllVariables)(text, variables) }),
    [section_types_1.PGRSectionTypeEnum.TOC]: () => (0, summary_1.summarySections)(),
});
exports.sectionTypeMap = sectionTypeMap;
//# sourceMappingURL=sectionTypeMap.js.map