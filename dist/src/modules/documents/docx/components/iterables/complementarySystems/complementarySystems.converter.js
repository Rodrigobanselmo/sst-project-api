"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.complementarySystemsConverter = void 0;
const variables_enum_1 = require("../../../builders/pgr/enums/variables.enum");
const complementarySystemsConverter = (complementarySystems) => {
    return complementarySystems.map((doc) => ({
        [variables_enum_1.VariablesPGREnum.DOCUMENT_COMPLEMENTARY_DOCS]: doc || '',
    }));
};
exports.complementarySystemsConverter = complementarySystemsConverter;
//# sourceMappingURL=complementarySystems.converter.js.map