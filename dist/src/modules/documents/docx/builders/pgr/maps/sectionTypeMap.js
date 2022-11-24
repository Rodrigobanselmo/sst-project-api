"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SectionsMapClass = void 0;
const styles_1 = require("../../../base/config/styles");
const chapter_1 = require("../../../base/layouts/chapter/chapter");
const cover_1 = require("../../../base/layouts/cover/cover");
const headerAndFooter_1 = require("../../../base/layouts/headerAndFooter/headerAndFooter");
const summary_1 = require("../../../base/layouts/summary/summary");
const convertToDocx_1 = require("../functions/convertToDocx");
const replaceAllVariables_1 = require("../functions/replaceAllVariables");
const section_types_1 = require("../types/section.types");
const all_characterization_sections_1 = require("../../../components/iterables/all-characterization/all-characterization.sections");
class SectionsMapClass {
    constructor({ variables, cover, company, version, logoImagePath, elementsMap, document, hierarchy, homogeneousGroup, environments, characterizations, consultantLogoImagePath, }) {
        this.map = {
            [section_types_1.PGRSectionTypeEnum.TOC]: () => (0, summary_1.summarySections)(),
            [section_types_1.PGRSectionTypeEnum.COVER]: ({}) => (0, cover_1.coverSections)(Object.assign({ imgPath: this.logoPath, version: this.version, companyName: `${this.company.name} ${this.company.initials ? `(${this.company.initials})` : ''}` }, (this.cover && this.cover.json))),
            [section_types_1.PGRSectionTypeEnum.CHAPTER]: ({ text }) => (0, chapter_1.chapterSection)({
                version: this.version,
                chapter: (0, replaceAllVariables_1.replaceAllVariables)(text, this.variables),
                imagePath: this.logoPath,
            }),
            [section_types_1.PGRSectionTypeEnum.SECTION]: (_a) => {
                var { children, footerText } = _a, rest = __rest(_a, ["children", "footerText"]);
                return (Object.assign(Object.assign(Object.assign({ children: this.convertToDocx(children) }, this.getFooterHeader(footerText)), rest), styles_1.sectionLandscapeProperties));
            },
            [section_types_1.PGRSectionTypeEnum.ITERABLE_ENVIRONMENTS]: () => (0, all_characterization_sections_1.allCharacterizationSections)(this.environments, this.hierarchy, this.homogeneousGroup, 'env', (x, v) => this.convertToDocx(x, v)).map(({ footerText, children }) => (Object.assign(Object.assign({ children }, this.getFooterHeader(footerText)), styles_1.sectionLandscapeProperties))),
            [section_types_1.PGRSectionTypeEnum.ITERABLE_CHARACTERIZATION]: () => (0, all_characterization_sections_1.allCharacterizationSections)(this.characterizations, this.hierarchy, this.homogeneousGroup, 'char', (x, v) => this.convertToDocx(x, v)).map(({ footerText, children }) => (Object.assign(Object.assign({ children }, this.getFooterHeader(footerText)), styles_1.sectionLandscapeProperties))),
        };
        this.getFooterHeader = (footerText) => {
            return (0, headerAndFooter_1.headerAndFooter)({
                footerText: (0, replaceAllVariables_1.replaceAllVariables)(footerText, this.variables),
                logoPath: this.logoPath,
                consultantLogoPath: this.consultantLogoPath,
                version: this.version,
            });
        };
        this.variables = variables;
        this.version = version;
        this.logoPath = logoImagePath;
        this.consultantLogoPath = consultantLogoImagePath;
        this.elementsMap = elementsMap;
        this.document = document;
        this.hierarchy = hierarchy;
        this.homogeneousGroup = homogeneousGroup;
        this.environments = environments;
        this.characterizations = characterizations;
        this.company = company;
        this.cover = cover;
    }
    convertToDocx(data, variables = {}) {
        return data
            .map((child) => {
            const childData = (0, convertToDocx_1.convertToDocxHelper)(child, Object.assign(Object.assign({}, this.variables), variables));
            if (!childData)
                return null;
            return this.elementsMap[childData.type](childData);
        })
            .filter((x) => x)
            .reduce((acc, curr) => {
            return [...acc, ...curr];
        }, []);
    }
}
exports.SectionsMapClass = SectionsMapClass;
//# sourceMappingURL=sectionTypeMap.js.map