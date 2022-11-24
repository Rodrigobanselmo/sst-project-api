"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachmentsLinkSection = void 0;
const variables_enum_1 = require("../enums/variables.enum");
const elements_types_1 = require("../types/elements.types");
const section_types_1 = require("../types/section.types");
exports.attachmentsLinkSection = {
    footer: true,
    header: true,
    data: [
        {
            type: section_types_1.PGRSectionTypeEnum.CHAPTER,
            text: `ANEXOS`,
        },
        {
            type: section_types_1.PGRSectionTypeEnum.SECTION,
            footerText: `??${variables_enum_1.VariablesPGREnum.CHAPTER_2}??`,
            children: [
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.H1,
                    text: `Anexos`,
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.ATTACHMENTS,
                },
            ],
        },
    ],
};
//# sourceMappingURL=3.01-anexos-link.js.map