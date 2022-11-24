"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachmentsIterable = void 0;
const variables_enum_1 = require("../../../builders/pgr/enums/variables.enum");
const elements_types_1 = require("../../../builders/pgr/types/elements.types");
const attachments_converter_1 = require("./attachments.converter");
const attachmentsIterable = (attachments, convertToDocx) => {
    const attachmentsVarArray = (0, attachments_converter_1.attachmentsConverter)(attachments);
    const iterableSections = attachmentsVarArray
        .map((variables, index) => {
        return convertToDocx([
            {
                type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                text: `<link>??${variables_enum_1.VariablesPGREnum.ATTACHMENT_LINK}??|ANEXO 0${index + 1} – ??${variables_enum_1.VariablesPGREnum.ATTACHMENT_NAME}??<link>`,
            },
        ], variables);
    })
        .reduce((acc, curr) => {
        return [...acc, ...curr];
    }, []);
    return iterableSections;
};
exports.attachmentsIterable = attachmentsIterable;
//# sourceMappingURL=attachments.iterable.js.map