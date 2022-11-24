"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplementaryDocsConverter = void 0;
const variables_enum_1 = require("../../../builders/pgr/enums/variables.enum");
const ComplementaryDocsConverter = (complementaryDocs) => {
    return complementaryDocs.map((doc) => ({
        [variables_enum_1.VariablesPGREnum.DOCUMENT_COMPLEMENTARY_DOCS]: doc || '',
    }));
};
exports.ComplementaryDocsConverter = ComplementaryDocsConverter;
//# sourceMappingURL=complementaryDocs.converter.js.map