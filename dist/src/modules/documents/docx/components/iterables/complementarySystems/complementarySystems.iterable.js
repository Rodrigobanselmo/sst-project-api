"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.complementarySystemsIterable = void 0;
const variables_enum_1 = require("../../../builders/pgr/enums/variables.enum");
const elements_types_1 = require("../../../builders/pgr/types/elements.types");
const complementarySystems_converter_1 = require("./complementarySystems.converter");
const complementarySystemsIterable = (complementarySystems, convertToDocx) => {
    if (!(complementarySystems === null || complementarySystems === void 0 ? void 0 : complementarySystems.length))
        return convertToDocx([
            {
                type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                text: `Não há um sistema de gestão “normatizado” implantado na unidade.`,
            },
        ]);
    const complementarySystemsVarArray = (0, complementarySystems_converter_1.complementarySystemsConverter)(complementarySystems);
    const iterableSections = complementarySystemsVarArray
        .map((variables) => {
        return convertToDocx([
            {
                type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                text: `**??${variables_enum_1.VariablesPGREnum.DOCUMENT_COMPLEMENTARY_SYSTEMS}??**`,
                level: 0,
            },
        ], variables);
    })
        .reduce((acc, curr) => {
        return [...acc, ...curr];
    }, []);
    return iterableSections;
};
exports.complementarySystemsIterable = complementarySystemsIterable;
//# sourceMappingURL=complementarySystems.iterable.js.map