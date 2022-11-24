"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testSection = void 0;
const elements_types_1 = require("../types/elements.types");
const section_types_1 = require("../types/section.types");
exports.testSection = {
    footer: true,
    header: true,
    data: [
        {
            type: section_types_1.PGRSectionTypeEnum.CHAPTER,
            text: `test`,
        },
        {
            type: section_types_1.PGRSectionTypeEnum.SECTION,
            footerText: `test`,
            children: [
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.HEALTH_EFFECT_TABLES,
                },
            ],
        },
    ],
};
//# sourceMappingURL=0.0-test.js.map