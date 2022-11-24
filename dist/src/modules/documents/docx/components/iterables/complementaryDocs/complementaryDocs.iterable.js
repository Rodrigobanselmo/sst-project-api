"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.complementaryDocsIterable = void 0;
const variables_enum_1 = require("../../../builders/pgr/enums/variables.enum");
const elements_types_1 = require("../../../builders/pgr/types/elements.types");
const complementaryDocs_converter_1 = require("./complementaryDocs.converter");
const complementaryDocsIterable = (complementaryDocs, convertToDocx) => {
    if (!(complementaryDocs === null || complementaryDocs === void 0 ? void 0 : complementaryDocs.length))
        return convertToDocx([
            {
                type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                text: `Não há documentos complementares na elaboração do PGR.`,
            },
        ]);
    const complementaryDocsVarArray = (0, complementaryDocs_converter_1.ComplementaryDocsConverter)(complementaryDocs);
    const iterableSections = complementaryDocsVarArray
        .map((variables) => {
        return convertToDocx([
            {
                type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                text: `**??${variables_enum_1.VariablesPGREnum.DOCUMENT_COMPLEMENTARY_DOCS}??**`,
                level: 0,
            },
        ], variables);
    })
        .reduce((acc, curr) => {
        return [...acc, ...curr];
    }, []);
    return iterableSections;
};
exports.complementaryDocsIterable = complementaryDocsIterable;
//# sourceMappingURL=complementaryDocs.iterable.js.map