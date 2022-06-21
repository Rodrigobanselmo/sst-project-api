"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToSections = void 0;
const sectionTypeMap_1 = require("../constants/sectionTypeMap");
const convertToSections = (data, variables) => {
    const sections = [];
    data.forEach((child) => {
        const section = sectionTypeMap_1.sectionTypeMap[child.type](child, variables);
        if (Array.isArray(section)) {
            return sections.push(...section);
        }
        return sections.push(section);
    });
    return sections;
};
exports.convertToSections = convertToSections;
//# sourceMappingURL=convertToSection.js.map